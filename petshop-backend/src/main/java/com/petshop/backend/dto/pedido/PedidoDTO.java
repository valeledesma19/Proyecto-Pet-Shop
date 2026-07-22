package com.petshop.backend.dto.pedido;

import com.petshop.backend.entity.EEstadoPedido;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDTO {
    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private LocalDateTime fechaPedido;
    private EEstadoPedido estado;
    private BigDecimal total;
    private String direccionEnvio;
    private List<DetallePedidoDTO> detalles;
}
