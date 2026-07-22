package com.petshop.backend.controller;

import com.petshop.backend.dto.valoracion.ValoracionDTO;
import com.petshop.backend.dto.valoracion.ValoracionRequest;
import com.petshop.backend.security.services.UserDetailsImpl;
import com.petshop.backend.service.ValoracionService;
import com.petshop.backend.utils.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/valoraciones")
@RequiredArgsConstructor
@Tag(name = "Valoraciones", description = "Calificaciones y comentarios de productos")
public class ValoracionController {

    private final ValoracionService valoracionService;

    @GetMapping("/producto/{productoId}")
    @Operation(summary = "Listar las valoraciones de un producto (publico)")
    public ResponseEntity<List<ValoracionDTO>> listarPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(valoracionService.listarPorProducto(productoId));
    }

    @PostMapping("/producto/{productoId}")
    @Operation(summary = "Crear o actualizar la valoracion propia de un producto")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ValoracionDTO> crearOActualizar(@AuthenticationPrincipal UserDetailsImpl usuario,
                                                            @PathVariable Long productoId,
                                                            @Valid @RequestBody ValoracionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(valoracionService.crearOActualizar(usuario.getId(), productoId, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una valoracion propia (o cualquiera si es ADMIN)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        valoracionService.eliminar(SecurityUtils.usuarioActualId(), id, SecurityUtils.esAdmin());
        return ResponseEntity.noContent().build();
    }
}
