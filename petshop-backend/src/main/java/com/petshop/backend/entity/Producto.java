package com.petshop.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precio;

    @Builder.Default
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    @Column(nullable = false)
    private Integer descuento = 0;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer stock;

    @Column(name = "imagen_principal", length = 500)
    private String imagenPrincipal;

    @ElementCollection
    @CollectionTable(name = "producto_imagenes", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "url_imagen", length = 500)
    @Builder.Default
    private List<String> imagenesSecundarias = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_mascota", length = 20)
    private ETipoMascota tipoMascota;

    @Builder.Default
    @Column(name = "calificacion_promedio")
    private Double calificacionPromedio = 0.0;

    @Builder.Default
    @Column(name = "cantidad_vendida", nullable = false)
    private Long cantidadVendida = 0L;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

    @Builder.Default
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "marca_id", nullable = false)
    private Marca marca;
}
