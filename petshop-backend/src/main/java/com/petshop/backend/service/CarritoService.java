package com.petshop.backend.service;

import com.petshop.backend.dto.carrito.CarritoDTO;
import com.petshop.backend.dto.carrito.CarritoItemRequest;
import com.petshop.backend.entity.Carrito;
import com.petshop.backend.entity.CarritoItem;
import com.petshop.backend.entity.Producto;
import com.petshop.backend.entity.Usuario;
import com.petshop.backend.exception.BadRequestException;
import com.petshop.backend.exception.ResourceNotFoundException;
import com.petshop.backend.mapper.CarritoMapper;
import com.petshop.backend.repository.CarritoItemRepository;
import com.petshop.backend.repository.CarritoRepository;
import com.petshop.backend.repository.ProductoRepository;
import com.petshop.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoItemRepository carritoItemRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CarritoMapper carritoMapper;

    @Transactional(readOnly = true)
    public CarritoDTO obtenerCarrito(Long usuarioId) {
        return carritoMapper.toDTO(obtenerOCrearCarrito(usuarioId));
    }

    @Transactional
    public CarritoDTO agregarItem(Long usuarioId, CarritoItemRequest request) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", request.getProductoId()));

        if (!producto.isActivo()) {
            throw new BadRequestException("El producto '" + producto.getNombre() + "' no esta disponible");
        }

        CarritoItem item = carritoItemRepository.findByCarritoIdAndProductoId(carrito.getId(), producto.getId())
                .orElse(null);

        int cantidadDeseada = request.getCantidad() + (item != null ? item.getCantidad() : 0);
        validarStockDisponible(producto, cantidadDeseada);

        if (item != null) {
            item.setCantidad(cantidadDeseada);
        } else {
            item = CarritoItem.builder()
                    .carrito(carrito)
                    .producto(producto)
                    .cantidad(request.getCantidad())
                    .build();
            carrito.getItems().add(item);
        }
        carritoItemRepository.save(item);

        return carritoMapper.toDTO(carrito);
    }

    @Transactional
    public CarritoDTO actualizarCantidad(Long usuarioId, Long itemId, Integer cantidad) {
        CarritoItem item = buscarItemDelUsuario(usuarioId, itemId);
        validarStockDisponible(item.getProducto(), cantidad);
        item.setCantidad(cantidad);
        carritoItemRepository.save(item);
        return carritoMapper.toDTO(item.getCarrito());
    }

    @Transactional
    public CarritoDTO eliminarItem(Long usuarioId, Long itemId) {
        CarritoItem item = buscarItemDelUsuario(usuarioId, itemId);
        Carrito carrito = item.getCarrito();
        // Basta con quitarlo de la coleccion: orphanRemoval=true en Carrito.items
        // se encarga de emitir el DELETE al hacer flush/commit.
        carrito.getItems().remove(item);
        return carritoMapper.toDTO(carrito);
    }

    @Transactional
    public CarritoDTO vaciarCarrito(Long usuarioId) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        carrito.getItems().clear();
        carritoRepository.save(carrito);
        return carritoMapper.toDTO(carrito);
    }

    /**
     * Devuelve la entidad Carrito lista para usar dentro de otros services (ej. checkout).
     */
    @Transactional
    public Carrito obtenerOCrearCarrito(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> {
                    Usuario usuario = usuarioRepository.findById(usuarioId)
                            .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", usuarioId));
                    return carritoRepository.save(Carrito.builder().usuario(usuario).build());
                });
    }

    private CarritoItem buscarItemDelUsuario(Long usuarioId, Long itemId) {
        CarritoItem item = carritoItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item de carrito", "id", itemId));
        if (!item.getCarrito().getUsuario().getId().equals(usuarioId)) {
            throw new ResourceNotFoundException("Item de carrito", "id", itemId);
        }
        return item;
    }

    private void validarStockDisponible(Producto producto, int cantidadDeseada) {
        if (cantidadDeseada > producto.getStock()) {
            throw new BadRequestException("Stock insuficiente para '" + producto.getNombre()
                    + "'. Disponible: " + producto.getStock());
        }
    }
}
