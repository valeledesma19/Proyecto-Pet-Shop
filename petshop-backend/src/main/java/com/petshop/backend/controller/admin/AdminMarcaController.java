package com.petshop.backend.controller.admin;

import com.petshop.backend.dto.marca.MarcaDTO;
import com.petshop.backend.dto.marca.MarcaRequest;
import com.petshop.backend.service.MarcaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/marcas")
@RequiredArgsConstructor
@Tag(name = "Admin - Marcas", description = "CRUD de marcas (requiere ROLE_ADMIN)")
@SecurityRequirement(name = "bearerAuth")
public class AdminMarcaController {

    private final MarcaService marcaService;

    @GetMapping
    @Operation(summary = "Listar todas las marcas, incluyendo inactivas")
    public ResponseEntity<List<MarcaDTO>> listar() {
        return ResponseEntity.ok(marcaService.listarTodas());
    }

    @PostMapping
    @Operation(summary = "Crear una marca")
    public ResponseEntity<MarcaDTO> crear(@Valid @RequestBody MarcaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(marcaService.crear(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una marca")
    public ResponseEntity<MarcaDTO> actualizar(@PathVariable Long id, @Valid @RequestBody MarcaRequest request) {
        return ResponseEntity.ok(marcaService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una marca")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        marcaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
