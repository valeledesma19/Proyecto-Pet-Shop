package com.petshop.backend.mapper;

import com.petshop.backend.dto.carrito.CarritoDTO;
import com.petshop.backend.dto.carrito.CarritoItemDTO;
import com.petshop.backend.entity.Carrito;
import com.petshop.backend.entity.CarritoItem;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Mapper(componentModel = "spring", uses = {ProductoMapper.class})
public interface CarritoMapper {

    @Mapping(target = "precioUnitario", ignore = true)
    @Mapping(target = "subtotal", ignore = true)
    CarritoItemDTO toItemDTO(CarritoItem item);

    @Mapping(target = "cantidadItems", ignore = true)
    @Mapping(target = "subtotal", ignore = true)
    @Mapping(target = "total", ignore = true)
    CarritoDTO toDTO(Carrito carrito);

    @AfterMapping
    default void calcularItem(CarritoItem item, @MappingTarget CarritoItemDTO dto) {
        BigDecimal precioUnitario = precioFinal(item.getProducto().getPrecio(), item.getProducto().getDescuento());
        dto.setPrecioUnitario(precioUnitario);
        dto.setSubtotal(precioUnitario.multiply(BigDecimal.valueOf(item.getCantidad())).setScale(2, RoundingMode.HALF_UP));
    }

    @AfterMapping
    default void calcularTotales(Carrito carrito, @MappingTarget CarritoDTO dto) {
        BigDecimal subtotal = dto.getItems().stream()
                .map(CarritoItemDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int cantidadItems = dto.getItems().stream()
                .mapToInt(CarritoItemDTO::getCantidad)
                .sum();
        dto.setSubtotal(subtotal);
        dto.setTotal(subtotal);
        dto.setCantidadItems(cantidadItems);
    }

    private BigDecimal precioFinal(BigDecimal precio, Integer descuento) {
        int d = descuento == null ? 0 : descuento;
        BigDecimal factor = BigDecimal.valueOf(100 - d).divide(BigDecimal.valueOf(100));
        return precio.multiply(factor).setScale(2, RoundingMode.HALF_UP);
    }
}
