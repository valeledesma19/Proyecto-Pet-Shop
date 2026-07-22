package com.petshop.backend.dto.producto;

import com.petshop.backend.dto.categoria.CategoriaDTO;
import com.petshop.backend.dto.marca.MarcaDTO;
import com.petshop.backend.entity.ETipoMascota;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer descuento;
    private BigDecimal precioFinal;
    private Integer stock;
    private String imagenPrincipal;
    private List<String> imagenesSecundarias;
    private ETipoMascota tipoMascota;
    private Double calificacionPromedio;
    private Long cantidadVendida;
    private boolean activo;
    private CategoriaDTO categoria;
    private MarcaDTO marca;
}
