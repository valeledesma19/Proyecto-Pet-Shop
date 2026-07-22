package com.petshop.backend.service;

import com.petshop.backend.dto.auth.JwtResponse;
import com.petshop.backend.dto.auth.LoginRequest;
import com.petshop.backend.dto.auth.RegistroRequest;
import com.petshop.backend.entity.Carrito;
import com.petshop.backend.entity.ERol;
import com.petshop.backend.entity.Rol;
import com.petshop.backend.entity.Usuario;
import com.petshop.backend.exception.DuplicateResourceException;
import com.petshop.backend.exception.ResourceNotFoundException;
import com.petshop.backend.repository.CarritoRepository;
import com.petshop.backend.repository.RolRepository;
import com.petshop.backend.repository.UsuarioRepository;
import com.petshop.backend.security.jwt.JwtUtils;
import com.petshop.backend.security.services.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final CarritoRepository carritoRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Transactional
    public JwtResponse registrar(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Ya existe una cuenta registrada con el email: " + request.getEmail());
        }

        Rol rolUsuario = rolRepository.findByNombre(ERol.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Rol", "nombre", ERol.ROLE_USER));

        Set<Rol> roles = new HashSet<>();
        roles.add(rolUsuario);

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono())
                .direccion(request.getDireccion())
                .roles(roles)
                .build();

        usuario = usuarioRepository.save(usuario);

        // Cada usuario nuevo arranca con su carrito vacio ya creado
        Carrito carrito = Carrito.builder().usuario(usuario).build();
        carritoRepository.save(carrito);

        return autenticarYGenerarToken(request.getEmail(), request.getPassword());
    }

    public JwtResponse login(LoginRequest request) {
        return autenticarYGenerarToken(request.getEmail(), request.getPassword());
    }

    private JwtResponse autenticarYGenerarToken(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return JwtResponse.builder()
                .token(jwt)
                .tipo("Bearer")
                .id(userDetails.getId())
                .nombre(userDetails.getNombre())
                .apellido(userDetails.getApellido())
                .email(userDetails.getEmail())
                .roles(roles)
                .build();
    }
}
