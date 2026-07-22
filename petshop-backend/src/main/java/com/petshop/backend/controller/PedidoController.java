package com.petshop.backend.controller;

import com.petshop.backend.dto.pedido.CrearPedidoRequest;
import com.petshop.backend.dto.pedido.PedidoDTO;
import com.petshop.backend.security.services.UserDetailsImpl;
import com.petshop.backend.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@Tag(name = "Pedidos", description = "Checkout e historial de compras del usuario autenticado")
@SecurityRequirement(name = "bearerAuth")
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    @Operation(summary = "Finalizar la compra generando un pedido a partir del carrito")
    public ResponseEntity<PedidoDTO> checkout(@AuthenticationPrincipal UserDetailsImpl usuario,
                                               @Valid @RequestBody CrearPedidoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.crearDesdeCarrito(usuario.getId(), request));
    }

    @GetMapping
    @Operation(summary = "Historial de pedidos del usuario autenticado")
    public ResponseEntity<Page<PedidoDTO>> misPedidos(@AuthenticationPrincipal UserDetailsImpl usuario,
                                                        @PageableDefault(size = 10, sort = "fechaPedido") Pageable pageable) {
        return ResponseEntity.ok(pedidoService.misPedidos(usuario.getId(), pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener el detalle de un pedido propio")
    public ResponseEntity<PedidoDTO> obtener(@AuthenticationPrincipal UserDetailsImpl usuario,
                                              @PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.obtenerPedido(usuario.getId(), id, false));
    }
}
