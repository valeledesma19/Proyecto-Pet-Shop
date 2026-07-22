package com.petshop.backend.service;

import com.petshop.backend.dto.categoria.CategoriaDTO;
import com.petshop.backend.dto.categoria.CategoriaRequest;
import com.petshop.backend.entity.Categoria;
import com.petshop.backend.exception.DuplicateResourceException;
import com.petshop.backend.exception.ResourceNotFoundException;
import com.petshop.backend.mapper.CategoriaMapper;
import com.petshop.backend.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    @Transactional(readOnly = true)
    public List<CategoriaDTO> listarActivas() {
        return categoriaRepository.findAll().stream()
                .filter(Categoria::isActiva)
                .map(categoriaMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoriaDTO> listarTodas() {
        return categoriaRepository.findAll().stream()
                .map(categoriaMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoriaDTO obtenerPorId(Long id) {
        return categoriaMapper.toDTO(buscarEntidad(id));
    }

    @Transactional
    public CategoriaDTO crear(CategoriaRequest request) {
        if (categoriaRepository.existsByNombreIgnoreCase(request.getNombre())) {
            throw new DuplicateResourceException("Ya existe una categoria con el nombre: " + request.getNombre());
        }
        Categoria categoria = categoriaMapper.toEntity(request);
        if (request.getActiva() == null) {
            categoria.setActiva(true);
        }
        return categoriaMapper.toDTO(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaDTO actualizar(Long id, CategoriaRequest request) {
        Categoria categoria = buscarEntidad(id);
        categoriaMapper.updateEntityFromRequest(request, categoria);
        return categoriaMapper.toDTO(categoriaRepository.save(categoria));
    }

    @Transactional
    public void eliminar(Long id) {
        Categoria categoria = buscarEntidad(id);
        categoriaRepository.delete(categoria);
    }

    private Categoria buscarEntidad(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", "id", id));
    }
}
