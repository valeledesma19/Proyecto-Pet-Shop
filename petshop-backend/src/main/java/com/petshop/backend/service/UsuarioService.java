package com.petshop.backend.service;

import com.petshop.backend.dto.usuario.ActualizarPerfilRequest;
import com.petshop.backend.dto.usuario.CambiarPasswordRequest;
import com.petshop.backend.dto.usuario.UsuarioDTO;
import com.petshop.backend.entity.Usuario;
import com.petshop.backend.exception.BadRequestException;
import com.petshop.backend.exception.ResourceNotFoundException;
import com.petshop.backend.mapper.UsuarioMapper;
import com.petshop.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UsuarioDTO obtenerPerfil(Long usuarioId) {
        return usuarioMapper.toDTO(buscarUsuario(usuarioId));
    }

    @Transactional
    public UsuarioDTO actualizarPerfil(Long usuarioId, ActualizarPerfilRequest request) {
        Usuario usuario = buscarUsuario(usuarioId);
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setTelefono(request.getTelefono());
        usuario.setDireccion(request.getDireccion());
        return usuarioMapper.toDTO(usuarioRepository.save(usuario));
    }

    @Transactional
    public void cambiarPassword(Long usuarioId, CambiarPasswordRequest request) {
        Usuario usuario = buscarUsuario(usuarioId);

        if (!passwordEncoder.matches(request.getPasswordActual(), usuario.getPassword())) {
            throw new BadRequestException("La contraseña actual es incorrecta");
        }

        usuario.setPassword(passwordEncoder.encode(request.getPasswordNueva()));
        usuarioRepository.save(usuario);
    }

    private Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
    }
}