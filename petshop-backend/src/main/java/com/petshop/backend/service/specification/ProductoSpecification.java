package com.petshop.backend.service.specification;

import com.petshop.backend.entity.ETipoMascota;
import com.petshop.backend.entity.Producto;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

/**
 * Construye filtros dinamicos y combinables para la busqueda de productos
 * (categoria, marca, rango de precio, tipo de mascota, texto libre, estado activo)
 * sin tener que escribir una query distinta para cada combinacion posible.
 */
public class ProductoSpecification {

    private ProductoSpecification() {
    }

    public static Specification<Producto> soloActivos() {
        return (root, query, cb) -> cb.isTrue(root.get("activo"));
    }

    public static Specification<Producto> categoriaId(Long categoriaId) {
        return (root, query, cb) ->
                categoriaId == null ? null : cb.equal(root.get("categoria").get("id"), categoriaId);
    }

    public static Specification<Producto> marcaId(Long marcaId) {
        return (root, query, cb) ->
                marcaId == null ? null : cb.equal(root.get("marca").get("id"), marcaId);
    }

    public static Specification<Producto> tipoMascota(ETipoMascota tipoMascota) {
        return (root, query, cb) ->
                tipoMascota == null ? null : cb.equal(root.get("tipoMascota"), tipoMascota);
    }

    public static Specification<Producto> precioMinimo(BigDecimal precioMin) {
        return (root, query, cb) ->
                precioMin == null ? null : cb.greaterThanOrEqualTo(root.get("precio"), precioMin);
    }

    public static Specification<Producto> precioMaximo(BigDecimal precioMax) {
        return (root, query, cb) ->
                precioMax == null ? null : cb.lessThanOrEqualTo(root.get("precio"), precioMax);
    }

    public static Specification<Producto> textoLibre(String texto) {
        return (root, query, cb) -> {
            if (texto == null || texto.isBlank()) return null;
            String patron = "%" + texto.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("nombre")), patron),
                    cb.like(cb.lower(root.get("descripcion")), patron)
            );
        };
    }

    public static Specification<Producto> construir(Long categoriaId, Long marcaId, ETipoMascota tipoMascota,
                                                      BigDecimal precioMin, BigDecimal precioMax,
                                                      String texto, boolean soloActivos) {
        Specification<Producto> spec = Specification.where(null);

        if (soloActivos) {
            spec = spec.and(soloActivos());
        }
        spec = spec.and(categoriaId(categoriaId))
                .and(marcaId(marcaId))
                .and(tipoMascota(tipoMascota))
                .and(precioMinimo(precioMin))
                .and(precioMaximo(precioMax))
                .and(textoLibre(texto));

        return spec;
    }
}
