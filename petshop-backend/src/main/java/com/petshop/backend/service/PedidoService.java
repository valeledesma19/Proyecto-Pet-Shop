package com.petshop.backend.service;

import com.petshop.backend.dto.pedido.CrearPedidoRequest;
import com.petshop.backend.dto.pedido.PedidoDTO;
import com.petshop.backend.entity.*;
import com.petshop.backend.exception.BadRequestException;
import com.petshop.backend.exception.ResourceNotFoundException;
import com.petshop.backend.mapper.PedidoMapper;
import com.petshop.backend.repository.PedidoRepository;
import com.petshop.backend.repository.ProductoRepository;
import com.petshop.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CarritoService carritoService;
    private final PedidoMapper pedidoMapper;

    /**
     * Genera un pedido a partir del contenido actual del carrito del usuario,
     * descuenta stock, acumula ventas y vacia el carrito.
     */
    @Transactional
    public PedidoDTO crearDesdeCarrito(Long usuarioId, CrearPedidoRequest request) {
        Carrito carrito = carritoService.obtenerOCrearCarrito(usuarioId);

        if (carrito.getItems().isEmpty()) {
            throw new BadRequestException("El carrito esta vacio, agrega productos antes de finalizar la compra");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", usuarioId));

        List<DetallePedido> detalles = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CarritoItem item : carrito.getItems()) {
            Producto producto = productoRepository.findById(item.getProducto().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", item.getProducto().getId()));

            if (item.getCantidad() > producto.getStock()) {
                throw new BadRequestException("Stock insuficiente para '" + producto.getNombre()
                        + "'. Disponible: " + producto.getStock());
            }

            BigDecimal precioUnitario = precioFinal(producto.getPrecio(), producto.getDescuento());
            BigDecimal subtotal = precioUnitario.multiply(BigDecimal.valueOf(item.getCantidad()))
                    .setScale(2, RoundingMode.HALF_UP);

            detalles.add(DetallePedido.builder()
                    .producto(producto)
                    .cantidad(item.getCantidad())
                    .precioUnitario(precioUnitario)
                    .subtotal(subtotal)
                    .build());

            total = total.add(subtotal);

            producto.setStock(producto.getStock() - item.getCantidad());
            producto.setCantidadVendida(producto.getCantidadVendida() + item.getCantidad());
            productoRepository.save(producto);
        }

        Pedido pedido = Pedido.builder()
                .usuario(usuario)
                .estado(EEstadoPedido.PENDIENTE)
                .total(total.setScale(2, RoundingMode.HALF_UP))
                .direccionEnvio(request.getDireccionEnvio())
                .build();

        detalles.forEach(detalle -> detalle.setPedido(pedido));
        pedido.setDetalles(detalles);

        Pedido guardado = pedidoRepository.save(pedido);

        // orphanRemoval=true en Carrito.items emite los DELETE al hacer flush/commit
        carrito.getItems().clear();

        return pedidoMapper.toDTO(guardado);
    }

    @Transactional(readOnly = true)
    public Page<PedidoDTO> misPedidos(Long usuarioId, Pageable pageable) {
        return pedidoRepository.findByUsuarioId(usuarioId, pageable).map(pedidoMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public PedidoDTO obtenerPedido(Long usuarioId, Long pedidoId, boolean esAdmin) {
        Pedido pedido = buscarEntidad(pedidoId);
        if (!esAdmin && !pedido.getUsuario().getId().equals(usuarioId)) {
            throw new ResourceNotFoundException("Pedido", "id", pedidoId);
        }
        return pedidoMapper.toDTO(pedido);
    }

    @Transactional(readOnly = true)
    public Page<PedidoDTO> listarTodos(Pageable pageable) {
        return pedidoRepository.findAll(pageable).map(pedidoMapper::toDTO);
    }

    /**
     * Actualiza el estado del pedido. Si se cancela un pedido que aun no estaba
     * cancelado, se restituye el stock de cada producto involucrado.
     */
    @Transactional
    public PedidoDTO actualizarEstado(Long pedidoId, EEstadoPedido nuevoEstado) {
        Pedido pedido = buscarEntidad(pedidoId);

        if (nuevoEstado == EEstadoPedido.CANCELADO && pedido.getEstado() != EEstadoPedido.CANCELADO) {
            for (DetallePedido detalle : pedido.getDetalles()) {
                Producto producto = detalle.getProducto();
                producto.setStock(producto.getStock() + detalle.getCantidad());
                producto.setCantidadVendida(Math.max(0, producto.getCantidadVendida() - detalle.getCantidad()));
                productoRepository.save(producto);
            }
        }

        pedido.setEstado(nuevoEstado);
        return pedidoMapper.toDTO(pedidoRepository.save(pedido));
    }

    private Pedido buscarEntidad(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", "id", id));
    }

    private BigDecimal precioFinal(BigDecimal precio, Integer descuento) {
        int d = descuento == null ? 0 : descuento;
        BigDecimal factor = BigDecimal.valueOf(100 - d).divide(BigDecimal.valueOf(100));
        return precio.multiply(factor).setScale(2, RoundingMode.HALF_UP);
    }
}
