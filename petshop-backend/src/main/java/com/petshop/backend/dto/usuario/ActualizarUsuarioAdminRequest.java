package com.petshop.backend.dto.usuario;

import com.petshop.backend.entity.ERol;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class ActualizarUsuarioAdminRequest {

    @NotNull(message = "El estado activo/inactivo es obligatorio")
    private Boolean activo;

    @NotEmpty(message = "El usuario debe tener al menos un rol")
    private Set<ERol> roles;
}