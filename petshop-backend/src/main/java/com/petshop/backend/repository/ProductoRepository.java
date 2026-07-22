package com.petshop.backend.repository;

import com.petshop.backend.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductoRepository extends JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {

    // JpaSpecificationExecutor permite construir filtros dinamicos
    // (categoria, marca, precio, tipo de mascota, texto de busqueda) en el service
    // combinando Specifications sin duplicar queries.

    Page<Producto> findByActivoTrue(Pageable pageable);
}
