package com.petshop.backend.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String recurso, String campo, Object valor) {
        super(String.format("%s no encontrado con %s: '%s'", recurso, campo, valor));
    }

    public ResourceNotFoundException(String mensaje) {
        super(mensaje);
    }
}
