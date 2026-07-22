package com.petshop.backend.controller;

import com.petshop.backend.dto.carrito.ActualizarCantidadRequest;
import com.petshop.backend.dto.carrito.CarritoDTO;
import com.petshop.backend.dto.carrito.CarritoItemRequest;
import com.petshop.backend.security.services.UserDetailsImpl;
import com.petshop.backend.service.CarritoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
@RequiredArgsConstructor
@Tag(name = "Carrito", description = "Carrito de compras del usuario autenticado")
@SecurityRequirement(name = "bearerAuth")
public class CarritoController {

    private final CarritoService carritoService;

    @GetMapping
    @Operation(summary = "Obtener el carrito del usuario autenticado")
    public ResponseEntity<CarritoDTO> obtener(@AuthenticationPrincipal UserDetailsImpl usuario) {
        return ResponseEntity.ok(carritoService.obtenerCarrito(usuario.getId()));
    }

    @PostMapping("/items")
    @Operation(summary = "Agregar un producto al carrito")
    public ResponseEntity<CarritoDTO> agregarItem(@AuthenticationPrincipal UserDetailsImpl usuario,
                                                    @Valid @RequestBody CarritoItemRequest request) {
        return ResponseEntity.ok(carritoService.agregarItem(usuario.getId(), request));
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Actualizar la cantidad de un item del carrito")
    public ResponseEntity<CarritoDTO> actualizarCantidad(@AuthenticationPrincipal UserDetailsImpl usuario,
                                                           @PathVariable Long itemId,
                                                           @Valid @RequestBody ActualizarCantidadRequest request) {
        return ResponseEntity.ok(carritoService.actualizarCantidad(usuario.getId(), itemId, request.getCantidad()));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Eliminar un item del carrito")
    public ResponseEntity<CarritoDTO> eliminarItem(@AuthenticationPrincipal UserDetailsImpl usuario,
                                                     @PathVariable Long itemId) {
        return ResponseEntity.ok(carritoService.eliminarItem(usuario.getId(), itemId));
    }

    @DeleteMapping
    @Operation(summary = "Vaciar el carrito")
    public ResponseEntity<CarritoDTO> vaciar(@AuthenticationPrincipal UserDetailsImpl usuario) {
        return ResponseEntity.ok(carritoService.vaciarCarrito(usuario.getId()));
    }
}
