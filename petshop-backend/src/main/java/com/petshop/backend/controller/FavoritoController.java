package com.petshop.backend.controller;

import com.petshop.backend.dto.favorito.FavoritoDTO;
import com.petshop.backend.security.services.UserDetailsImpl;
import com.petshop.backend.service.FavoritoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
@RequiredArgsConstructor
@Tag(name = "Favoritos", description = "Lista de productos favoritos del usuario autenticado")
@SecurityRequirement(name = "bearerAuth")
public class FavoritoController {

    private final FavoritoService favoritoService;

    @GetMapping
    @Operation(summary = "Listar los productos favoritos del usuario")
    public ResponseEntity<List<FavoritoDTO>> listar(@AuthenticationPrincipal UserDetailsImpl usuario) {
        return ResponseEntity.ok(favoritoService.listar(usuario.getId()));
    }

    @PostMapping("/{productoId}")
    @Operation(summary = "Agregar un producto a favoritos")
    public ResponseEntity<FavoritoDTO> agregar(@AuthenticationPrincipal UserDetailsImpl usuario,
                                                @PathVariable Long productoId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(favoritoService.agregar(usuario.getId(), productoId));
    }

    @DeleteMapping("/{productoId}")
    @Operation(summary = "Quitar un producto de favoritos")
    public ResponseEntity<Void> eliminar(@AuthenticationPrincipal UserDetailsImpl usuario,
                                          @PathVariable Long productoId) {
        favoritoService.eliminar(usuario.getId(), productoId);
        return ResponseEntity.noContent().build();
    }
}
