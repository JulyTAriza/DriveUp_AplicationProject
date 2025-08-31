package com.dh.DriveUp.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dh.DriveUp.config.JwtService;
import com.dh.DriveUp.entity.Role;
import com.dh.DriveUp.entity.User;
import com.dh.DriveUp.repository.IUserRepository;

@Service
public class AuthenticationService {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Constructor explícito
    public AuthenticationService(
            IUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        // Crear usuario
        User user = User.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // por defecto usuario normal
                .build();

        userRepository.save(user);

        String jwt = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwt)
                .id(user.getId())
                .email(user.getEmail())
                .rol(user.getRole())
                .build();
    }

    public AuthenticationResponse login(AuthenticationRequest request) {
        // Buscar por email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar contraseña
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        String jwt = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwt)
                .id(user.getId())
                .email(user.getEmail())
                .rol(user.getRole())
                .build();
    }
}
