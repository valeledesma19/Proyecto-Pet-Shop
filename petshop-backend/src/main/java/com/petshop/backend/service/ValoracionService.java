package com.petshop.backend.service;

import com.petshop.backend.dto.valoracion.ValoracionDTO;
import com.petshop.backend.dto.valoracion.ValoracionRequest;
import com.petshop.backend.entity.Producto;
import com.petshop.backend.entity.Usuario;
import com.petshop.backend.entity.Valoracion;
import com.petshop.backend.exception.ResourceNotFoundException;
import com.petshop.backend.exception.BadRequestException;
import com.petshop.backend.mapper.ValoracionMapper;
import com.petshop.backend.repository.ProductoRepository;
import com.petshop.backend.repository.UsuarioRepository;
import com.petshop.backend.repository.ValoracionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ValoracionService {

    private final ValoracionRepository valoracionRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ValoracionMapper valoracionMapper;

    @Transactional(readOnly = true)
    public List<ValoracionDTO> listarPorProducto(Long productoId) {
        return valoracionRepository.findByProductoIdOrderByFechaCreacionDesc(productoId).stream()
                .map(valoracionMapper::toDTO)
                .toList();
    }

    /**
     * Crea una nueva valoracion o actualiza la existente si el usuario ya habia
     * calificado este producto (una valoracion por usuario y producto).
     */
    @Transactional
    public ValoracionDTO crearOActualizar(Long usuarioId, Long productoId, ValoracionRequest request) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", productoId));

        Valoracion valoracion = valoracionRepository.findByUsuarioIdAndProductoId(usuarioId, productoId)
                .orElse(null);

        if (valoracion != null) {
            valoracion.setPuntuacion(request.getPuntuacion());
            valoracion.setComentario(request.getComentario());
        } else {
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", usuarioId));
            valoracion = Valoracion.builder()
                    .usuario(usuario)
                    .producto(producto)
                    .puntuacion(request.getPuntuacion())
                    .comentario(request.getComentario())
                    .build();
        }

        Valoracion guardada = valoracionRepository.save(valoracion);
        recalcularPromedio(producto);

        return valoracionMapper.toDTO(guardada);
    }

    @Transactional
    public void eliminar(Long usuarioId, Long valoracionId, boolean esAdmin) {
        Valoracion valoracion = valoracionRepository.findById(valoracionId)
                .orElseThrow(() -> new ResourceNotFoundException("Valoracion", "id", valoracionId));

        if (!esAdmin && !valoracion.getUsuario().getId().equals(usuarioId)) {
            throw new BadRequestException("No puedes eliminar una valoracion que no te pertenece");
        }

        Producto producto = valoracion.getProducto();
        valoracionRepository.delete(valoracion);
        recalcularPromedio(producto);
    }

    private void recalcularPromedio(Producto producto) {
        List<Valoracion> valoraciones = valoracionRepository.findByProductoIdOrderByFechaCreacionDesc(producto.getId());
        double promedio = valoraciones.stream()
                .mapToInt(Valoracion::getPuntuacion)
                .average()
                .orElse(0.0);
        producto.setCalificacionPromedio(Math.round(promedio * 10.0) / 10.0);
        productoRepository.save(producto);
    }
}
