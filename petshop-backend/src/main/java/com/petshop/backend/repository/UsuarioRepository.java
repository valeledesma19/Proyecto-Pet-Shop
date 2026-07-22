package com.petshop.backend.repository;

import com.petshop.backend.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("""
            SELECT u FROM Usuario u WHERE
            :buscar IS NULL OR :buscar = '' OR
            LOWER(u.nombre) LIKE LOWER(CONCAT('%', :buscar, '%')) OR
            LOWER(u.apellido) LIKE LOWER(CONCAT('%', :buscar, '%')) OR
            LOWER(u.email) LIKE LOWER(CONCAT('%', :buscar, '%'))
            """)
    Page<Usuario> buscar(@Param("buscar") String buscar, Pageable pageable);
}