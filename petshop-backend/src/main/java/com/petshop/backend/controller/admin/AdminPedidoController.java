package com.petshop.backend.controller.admin;

import com.petshop.backend.dto.pedido.ActualizarEstadoRequest;
import com.petshop.backend.dto.pedido.PedidoDTO;
import com.petshop.backend.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/pedidos")
@RequiredArgsConstructor
@Tag(name = "Admin - Pedidos", description = "Gestion de pedidos (requiere ROLE_ADMIN)")
@SecurityRequirement(name = "bearerAuth")
public class AdminPedidoController {

    private final PedidoService pedidoService;

    @GetMapping
    @Operation(summary = "Listar todos los pedidos")
    public ResponseEntity<Page<PedidoDTO>> listar(@PageableDefault(size = 15, sort = "fechaPedido") Pageable pageable) {
        return ResponseEntity.ok(pedidoService.listarTodos(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener el detalle de cualquier pedido")
    public ResponseEntity<PedidoDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.obtenerPedido(null, id, true));
    }

    @PutMapping("/{id}/estado")
    @Operation(summary = "Actualizar el estado de un pedido")
    public ResponseEntity<PedidoDTO> actualizarEstado(@PathVariable Long id,
                                                        @Valid @RequestBody ActualizarEstadoRequest request) {
        return ResponseEntity.ok(pedidoService.actualizarEstado(id, request.getEstado()));
    }
}
