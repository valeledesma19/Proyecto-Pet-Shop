package com.petshop.backend.mapper;

import com.petshop.backend.dto.categoria.CategoriaDTO;
import com.petshop.backend.dto.categoria.CategoriaRequest;
import com.petshop.backend.entity.Categoria;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.BeanMapping;

@Mapper(componentModel = "spring")
public interface CategoriaMapper {

    CategoriaDTO toDTO(Categoria categoria);

    Categoria toEntity(CategoriaRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(CategoriaRequest request, @MappingTarget Categoria categoria);
}
