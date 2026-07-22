package com.petshop.backend.dto.favorito;

import com.petshop.backend.dto.producto.ProductoDTO;
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
public class FavoritoDTO {
    private Long id;
    private ProductoDTO producto;
    private LocalDateTime fechaAgregado;
}
