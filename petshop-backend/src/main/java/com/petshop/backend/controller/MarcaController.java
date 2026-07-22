package com.petshop.backend.controller;

import com.petshop.backend.dto.marca.MarcaDTO;
import com.petshop.backend.service.MarcaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
@RequiredArgsConstructor
@Tag(name = "Marcas", description = "Marcas publicas de productos")
public class MarcaController {

    private final MarcaService marcaService;

    @GetMapping
    @Operation(summary = "Listar marcas activas")
    public ResponseEntity<List<MarcaDTO>> listar() {
        return ResponseEntity.ok(marcaService.listarActivas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una marca por id")
    public ResponseEntity<MarcaDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(marcaService.obtenerPorId(id));
    }
}
