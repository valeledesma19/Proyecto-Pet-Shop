package com.petshop.backend.config;

import com.petshop.backend.entity.ERol;
import com.petshop.backend.entity.Rol;
import com.petshop.backend.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Se ejecuta al iniciar la aplicacion y asegura que los roles base
 * (ROLE_USER, ROLE_ADMIN) existan en la base de datos.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;

    @Override
    public void run(String... args) {
        for (ERol erol : ERol.values()) {
            rolRepository.findByNombre(erol)
                    .orElseGet(() -> rolRepository.save(Rol.builder().nombre(erol).build()));
        }
    }
}
