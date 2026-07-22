package com.petshop.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class JwtResponse {

    private String token;

    @Builder.Default
    private String tipo = "Bearer";

    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private List<String> roles;
}
