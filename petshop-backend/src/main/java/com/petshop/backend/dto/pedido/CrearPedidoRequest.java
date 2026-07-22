package com.petshop.backend.dto.pedido;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CrearPedidoRequest {

    @NotBlank(message = "La direccion de envio es obligatoria")
    @Size(max = 250)
    private String direccionEnvio;
}
