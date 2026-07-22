package com.petshop.backend.controller.admin;

import com.petshop.backend.dto.usuario.ActualizarUsuarioAdminRequest;
import com.petshop.backend.dto.usuario.UsuarioDTO;
import com.petshop.backend.service.AdminUsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/usuarios")
@RequiredArgsConstructor
@Tag(name = "Admin - Usuarios", description = "Gestion de usuarios (requiere ROLE_ADMIN)")
@SecurityRequirement(name = "bearerAuth")
public class AdminUsuarioController {

    private final AdminUsuarioService adminUsuarioService;

    @GetMapping
    @Operation(summary = "Listar usuarios con busqueda y paginacion")
    public ResponseEntity<Page<UsuarioDTO>> listar(
            @RequestParam(required = false) String buscar,
            @PageableDefault(size = 15, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(adminUsuarioService.listar(buscar, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un usuario por id")
    public ResponseEntity<UsuarioDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(adminUsuarioService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar el estado activo/inactivo y los roles de un usuario")
    public ResponseEntity<UsuarioDTO> actualizar(@PathVariable Long id,
                                                 @Valid @RequestBody ActualizarUsuarioAdminRequest request) {
        return ResponseEntity.ok(adminUsuarioService.actualizar(id, request));
    }
}