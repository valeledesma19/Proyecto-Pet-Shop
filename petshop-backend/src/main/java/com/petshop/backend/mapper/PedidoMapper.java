package com.petshop.backend.mapper;

import com.petshop.backend.dto.pedido.DetallePedidoDTO;
import com.petshop.backend.dto.pedido.PedidoDTO;
import com.petshop.backend.entity.DetallePedido;
import com.petshop.backend.entity.Pedido;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ProductoMapper.class})
public interface PedidoMapper {

    DetallePedidoDTO toDetalleDTO(DetallePedido detalle);

    @Mapping(target = "usuarioId", source = "usuario.id")
    @Mapping(target = "usuarioNombre", expression = "java(pedido.getUsuario().getNombre() + \" \" + pedido.getUsuario().getApellido())")
    PedidoDTO toDTO(Pedido pedido);
}
