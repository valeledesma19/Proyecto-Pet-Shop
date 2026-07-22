package com.petshop.backend.mapper;

import com.petshop.backend.dto.producto.ProductoDTO;
import com.petshop.backend.dto.producto.ProductoRequest;
import com.petshop.backend.entity.Producto;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Mapper(componentModel = "spring", uses = {CategoriaMapper.class, MarcaMapper.class})
public interface ProductoMapper {

    @Mapping(target = "precioFinal", ignore = true)
    ProductoDTO toDTO(Producto producto);

    @AfterMapping
    default void calcularPrecioFinal(Producto producto, @MappingTarget ProductoDTO dto) {
        BigDecimal precio = producto.getPrecio();
        Integer descuento = producto.getDescuento() == null ? 0 : producto.getDescuento();
        if (precio == null) return;
        BigDecimal factor = BigDecimal.valueOf(100 - descuento).divide(BigDecimal.valueOf(100));
        dto.setPrecioFinal(precio.multiply(factor).setScale(2, RoundingMode.HALF_UP));
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categoria", ignore = true)
    @Mapping(target = "marca", ignore = true)
    @Mapping(target = "calificacionPromedio", ignore = true)
    @Mapping(target = "cantidadVendida", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    Producto toEntity(ProductoRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categoria", ignore = true)
    @Mapping(target = "marca", ignore = true)
    @Mapping(target = "calificacionPromedio", ignore = true)
    @Mapping(target = "cantidadVendida", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(ProductoRequest request, @MappingTarget Producto producto);
}
