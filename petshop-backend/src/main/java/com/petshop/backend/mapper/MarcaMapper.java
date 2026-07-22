package com.petshop.backend.mapper;

import com.petshop.backend.dto.marca.MarcaDTO;
import com.petshop.backend.dto.marca.MarcaRequest;
import com.petshop.backend.entity.Marca;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface MarcaMapper {

    MarcaDTO toDTO(Marca marca);

    Marca toEntity(MarcaRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(MarcaRequest request, @MappingTarget Marca marca);
}
