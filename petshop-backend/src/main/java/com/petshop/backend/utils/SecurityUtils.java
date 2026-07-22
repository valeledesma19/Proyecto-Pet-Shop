package com.petshop.backend.utils;

import com.petshop.backend.security.services.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Helper para obtener datos del usuario autenticado a partir del contexto de seguridad.
 * Evita repetir el casteo a UserDetailsImpl en cada service.
 */
public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static Long usuarioActualId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl userDetails)) {
            throw new IllegalStateException("No hay un usuario autenticado en el contexto actual");
        }
        return userDetails.getId();
    }

    public static boolean esAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
