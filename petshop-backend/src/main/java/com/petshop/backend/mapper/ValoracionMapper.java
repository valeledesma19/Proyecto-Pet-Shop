package com.petshop.backend.mapper;

import com.petshop.backend.dto.valoracion.ValoracionDTO;
import com.petshop.backend.entity.Valoracion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ValoracionMapper {

    @Mapping(target = "usuarioId", source = "usuario.id")
    @Mapping(target = "usuarioNombre", expression = "java(valoracion.getUsuario().getNombre() + \" \" + valoracion.getUsuario().getApellido())")
    @Mapping(target = "productoId", source = "producto.id")
    ValoracionDTO toDTO(Valoracion valoracion);
}
