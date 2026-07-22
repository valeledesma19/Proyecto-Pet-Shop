package com.petshop.backend.dto.marca;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarcaDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String logoUrl;
    private boolean activa;
}
