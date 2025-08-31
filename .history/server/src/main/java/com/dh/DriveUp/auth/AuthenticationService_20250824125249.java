package com.dh.DriveUp.auth;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.dh.DriveUp.config.JwtService;
import com.dh.DriveUp.entity.Role;
import com.dh.DriveUp.entity.User;
import com.dh.DriveUp.repository.IUserRepository;

@Service
public class AuthenticationService {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Constructor explícito (evita depender de Lombok en el IDE)
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
        // Construir usuario con los mismos nombres de tu tabla: nombre, apellido, email, password, role
        User user = User.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        String jwt = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwt)
                .build();
    }

    public AuthenticationResponse login(AuthenticationRequest request) {
        // Buscar por email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        String jwt = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwt)
                .build();
    }
}
