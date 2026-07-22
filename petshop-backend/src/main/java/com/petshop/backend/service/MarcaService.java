package com.petshop.backend.service;

import com.petshop.backend.dto.marca.MarcaDTO;
import com.petshop.backend.dto.marca.MarcaRequest;
import com.petshop.backend.entity.Marca;
import com.petshop.backend.exception.DuplicateResourceException;
import com.petshop.backend.exception.ResourceNotFoundException;
import com.petshop.backend.mapper.MarcaMapper;
import com.petshop.backend.repository.MarcaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarcaService {

    private final MarcaRepository marcaRepository;
    private final MarcaMapper marcaMapper;

    @Transactional(readOnly = true)
    public List<MarcaDTO> listarActivas() {
        return marcaRepository.findAll().stream()
                .filter(Marca::isActiva)
                .map(marcaMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MarcaDTO> listarTodas() {
        return marcaRepository.findAll().stream()
                .map(marcaMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public MarcaDTO obtenerPorId(Long id) {
        return marcaMapper.toDTO(buscarEntidad(id));
    }

    @Transactional
    public MarcaDTO crear(MarcaRequest request) {
        if (marcaRepository.existsByNombreIgnoreCase(request.getNombre())) {
            throw new DuplicateResourceException("Ya existe una marca con el nombre: " + request.getNombre());
        }
        Marca marca = marcaMapper.toEntity(request);
        if (request.getActiva() == null) {
            marca.setActiva(true);
        }
        return marcaMapper.toDTO(marcaRepository.save(marca));
    }

    @Transactional
    public MarcaDTO actualizar(Long id, MarcaRequest request) {
        Marca marca = buscarEntidad(id);
        marcaMapper.updateEntityFromRequest(request, marca);
        return marcaMapper.toDTO(marcaRepository.save(marca));
    }

    @Transactional
    public void eliminar(Long id) {
        Marca marca = buscarEntidad(id);
        marcaRepository.delete(marca);
    }

    private Marca buscarEntidad(Long id) {
        return marcaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca", "id", id));
    }
}
