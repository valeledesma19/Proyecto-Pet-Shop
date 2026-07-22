package com.petshop.backend.service;

import com.petshop.backend.dto.favorito.FavoritoDTO;
import com.petshop.backend.entity.Favorito;
import com.petshop.backend.entity.Producto;
import com.petshop.backend.entity.Usuario;
import com.petshop.backend.exception.DuplicateResourceException;
import com.petshop.backend.exception.ResourceNotFoundException;
import com.petshop.backend.mapper.FavoritoMapper;
import com.petshop.backend.repository.FavoritoRepository;
import com.petshop.backend.repository.ProductoRepository;
import com.petshop.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final FavoritoMapper favoritoMapper;

    @Transactional(readOnly = true)
    public List<FavoritoDTO> listar(Long usuarioId) {
        return favoritoRepository.findByUsuarioId(usuarioId).stream()
                .map(favoritoMapper::toDTO)
                .toList();
    }

    @Transactional
    public FavoritoDTO agregar(Long usuarioId, Long productoId) {
        if (favoritoRepository.existsByUsuarioIdAndProductoId(usuarioId, productoId)) {
            throw new DuplicateResourceException("El producto ya se encuentra en tus favoritos");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", usuarioId));
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", productoId));

        Favorito favorito = Favorito.builder()
                .usuario(usuario)
                .producto(producto)
                .build();

        return favoritoMapper.toDTO(favoritoRepository.save(favorito));
    }

    @Transactional
    public void eliminar(Long usuarioId, Long productoId) {
        Favorito favorito = favoritoRepository.findByUsuarioIdAndProductoId(usuarioId, productoId)
                .orElseThrow(() -> new ResourceNotFoundException("El producto no esta en tus favoritos"));
        favoritoRepository.delete(favorito);
    }
}
