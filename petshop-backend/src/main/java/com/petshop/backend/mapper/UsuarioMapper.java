package com.petshop.backend.mapper;

import com.petshop.backend.dto.usuario.UsuarioDTO;
import com.petshop.backend.entity.Rol;
import com.petshop.backend.entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    @Mapping(target = "roles", expression = "java(mapRoles(usuario.getRoles()))")
    UsuarioDTO toDTO(Usuario usuario);

    default Set<String> mapRoles(Set<Rol> roles) {
        if (roles == null) return Set.of();
        return roles.stream().map(rol -> rol.getNombre().name()).collect(Collectors.toSet());
    }
}
