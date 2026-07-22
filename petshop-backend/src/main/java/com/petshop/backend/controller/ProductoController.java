package com.petshop.backend.controller;

import com.petshop.backend.dto.producto.ProductoDTO;
import com.petshop.backend.entity.ETipoMascota;
import com.petshop.backend.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@Tag(name = "Productos", description = "Catalogo publico de productos")
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    @Operation(summary = "Buscar productos con filtros, orden y paginacion")
    public ResponseEntity<Page<ProductoDTO>> buscar(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long marcaId,
            @RequestParam(required = false) ETipoMascota tipoMascota,
            @RequestParam(required = false) BigDecimal precioMin,
            @RequestParam(required = false) BigDecimal precioMax,
            @RequestParam(required = false) String buscar,
            @PageableDefault(size = 12, sort = "id") Pageable pageable) {

        Page<ProductoDTO> resultado = productoService.buscar(
                categoriaId, marcaId, tipoMascota, precioMin, precioMax, buscar, true, pageable);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener el detalle de un producto")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }
}
