package com.petshop.backend.dto.marca;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarcaRequest {

    @NotBlank(message = "El nombre de la marca es obligatorio")
    @Size(max = 80)
    private String nombre;

    @Size(max = 300)
    private String descripcion;

    private String logoUrl;

    private Boolean activa;
}
