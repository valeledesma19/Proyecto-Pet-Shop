package com.petshop.backend.dto.categoria;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoriaRequest {

    @NotBlank(message = "El nombre de la categoria es obligatorio")
    @Size(max = 80)
    private String nombre;

    @Size(max = 300)
    private String descripcion;

    private String imagenUrl;

    private Boolean activa;
}
