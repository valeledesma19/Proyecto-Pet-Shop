package com.petshop.backend.dto.valoracion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValoracionDTO {
    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private Long productoId;
    private Integer puntuacion;
    private String comentario;
    private LocalDateTime fechaCreacion;
}
