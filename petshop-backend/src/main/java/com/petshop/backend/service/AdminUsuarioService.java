package com.petshop.backend.service;

import com.petshop.backend.dto.usuario.ActualizarUsuarioAdminRequest;
import com.petshop.backend.dto.usuario.UsuarioDTO;
import com.petshop.backend.entity.ERol;
import com.petshop.backend.entity.Rol;
import com.petshop.backend.entity.Usuario;
import com.petshop.backend.exception.ResourceNotFoundException;
import com.petshop.backend.mapper.UsuarioMapper;
import com.petshop.backend.repository.RolRepository;
import com.petshop.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final UsuarioMapper usuarioMapper;

    @Transactional(readOnly = true)
    public Page<UsuarioDTO> listar(String buscar, Pageable pageable) {
        return usuarioRepository.buscar(buscar, pageable).map(usuarioMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public UsuarioDTO obtenerPorId(Long id) {
        return usuarioMapper.toDTO(buscarUsuario(id));
    }

    @Transactional
    public UsuarioDTO actualizar(Long id, ActualizarUsuarioAdminRequest request) {
        Usuario usuario = buscarUsuario(id);

        Set<Rol> roles = request.getRoles().stream()
                .map(this::buscarRol)
                .collect(Collectors.toCollection(HashSet::new));

        usuario.setActivo(request.getActivo());
        usuario.setRoles(roles);

        return usuarioMapper.toDTO(usuarioRepository.save(usuario));
    }

    private Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
    }

    private Rol buscarRol(ERol nombre) {
        return rolRepository.findByNombre(nombre)
                .orElseThrow(() -> new ResourceNotFoundException("Rol", "nombre", nombre));
    }
}