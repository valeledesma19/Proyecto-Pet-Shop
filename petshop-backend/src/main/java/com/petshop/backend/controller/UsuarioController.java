package com.petshop.backend.controller;

import com.petshop.backend.dto.MessageResponse;
import com.petshop.backend.dto.usuario.ActualizarPerfilRequest;
import com.petshop.backend.dto.usuario.CambiarPasswordRequest;
import com.petshop.backend.dto.usuario.UsuarioDTO;
import com.petshop.backend.security.services.UserDetailsImpl;
import com.petshop.backend.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Perfil del usuario autenticado")
@SecurityRequirement(name = "bearerAuth")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/me")
    @Operation(summary = "Obtener el perfil del usuario autenticado")
    public ResponseEntity<UsuarioDTO> obtenerPerfil(@AuthenticationPrincipal UserDetailsImpl usuario) {
        return ResponseEntity.ok(usuarioService.obtenerPerfil(usuario.getId()));
    }

    @PutMapping("/me")
    @Operation(summary = "Actualizar nombre, apellido, telefono y direccion")
    public ResponseEntity<UsuarioDTO> actualizarPerfil(@AuthenticationPrincipal UserDetailsImpl usuario,
                                                       @Valid @RequestBody ActualizarPerfilRequest request) {
        return ResponseEntity.ok(usuarioService.actualizarPerfil(usuario.getId(), request));
    }

    @PutMapping("/me/password")
    @Operation(summary = "Cambiar la contraseña del usuario autenticado")
    public ResponseEntity<MessageResponse> cambiarPassword(@AuthenticationPrincipal UserDetailsImpl usuario,
                                                           @Valid @RequestBody CambiarPasswordRequest request) {
        usuarioService.cambiarPassword(usuario.getId(), request);
        return ResponseEntity.ok(new MessageResponse("Contraseña actualizada correctamente"));
    }
}