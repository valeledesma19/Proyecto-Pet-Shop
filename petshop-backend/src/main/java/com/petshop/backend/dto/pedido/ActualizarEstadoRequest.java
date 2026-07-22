package com.petshop.backend.dto.pedido;

import com.petshop.backend.entity.EEstadoPedido;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActualizarEstadoRequest {

    @NotNull(message = "El estado es obligatorio")
    private EEstadoPedido estado;
}
