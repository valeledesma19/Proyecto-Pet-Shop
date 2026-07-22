package com.petshop.backend.service;

import com.petshop.backend.dto.producto.ProductoDTO;
import com.petshop.backend.dto.producto.ProductoRequest;
import com.petshop.backend.entity.Categoria;
import com.petshop.backend.entity.ETipoMascota;
import com.petshop.backend.entity.Marca;
import com.petshop.backend.entity.Producto;
import com.petshop.backend.exception.ResourceNotFoundException;
import com.petshop.backend.mapper.ProductoMapper;
import com.petshop.backend.repository.CategoriaRepository;
import com.petshop.backend.repository.MarcaRepository;
import com.petshop.backend.repository.ProductoRepository;
import com.petshop.backend.service.specification.ProductoSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MarcaRepository marcaRepository;
    private final ProductoMapper productoMapper;

    @Transactional(readOnly = true)
    public Page<ProductoDTO> buscar(Long categoriaId, Long marcaId, ETipoMascota tipoMascota,
                                     BigDecimal precioMin, BigDecimal precioMax, String texto,
                                     boolean soloActivos, Pageable pageable) {
        var spec = ProductoSpecification.construir(categoriaId, marcaId, tipoMascota, precioMin, precioMax, texto, soloActivos);
        return productoRepository.findAll(spec, pageable).map(productoMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public ProductoDTO obtenerPorId(Long id) {
        return productoMapper.toDTO(buscarEntidad(id));
    }

    @Transactional
    public ProductoDTO crear(ProductoRequest request) {
        Producto producto = productoMapper.toEntity(request);
        producto.setCategoria(buscarCategoria(request.getCategoriaId()));
        producto.setMarca(buscarMarca(request.getMarcaId()));
        if (request.getActivo() == null) {
            producto.setActivo(true);
        }
        if (request.getDescuento() == null) {
            producto.setDescuento(0);
        }
        return productoMapper.toDTO(productoRepository.save(producto));
    }

    @Transactional
    public ProductoDTO actualizar(Long id, ProductoRequest request) {
        Producto producto = buscarEntidad(id);
        productoMapper.updateEntityFromRequest(request, producto);

        if (request.getCategoriaId() != null) {
            producto.setCategoria(buscarCategoria(request.getCategoriaId()));
        }
        if (request.getMarcaId() != null) {
            producto.setMarca(buscarMarca(request.getMarcaId()));
        }

        return productoMapper.toDTO(productoRepository.save(producto));
    }

    /**
     * Baja logica: se conserva el producto (por integridad con pedidos/historial)
     * pero deja de listarse en el catalogo publico.
     */
    @Transactional
    public void eliminar(Long id) {
        Producto producto = buscarEntidad(id);
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    private Producto buscarEntidad(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
    }

    private Categoria buscarCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", "id", id));
    }

    private Marca buscarMarca(Long id) {
        return marcaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca", "id", id));
    }
}
