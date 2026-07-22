package com.petshop.backend.mapper;

import com.petshop.backend.dto.favorito.FavoritoDTO;
import com.petshop.backend.entity.Favorito;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ProductoMapper.class})
public interface FavoritoMapper {
    FavoritoDTO toDTO(Favorito favorito);
}
