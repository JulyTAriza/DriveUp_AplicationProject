package com.dh.DriveUp.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(authorize -> authorize
                // Permitir todas las solicitudes OPTIONS sin autenticación
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Rutas públicas que no requieren autenticación
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/autos/**").permitAll()
                // Rutas para administradores que requieren el rol 'ADMIN'
                .requestMatchers(HttpMethod.POST, "/autos").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/autos").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/autos/**").hasAuthority("ADMIN")
                // Cualquier otra solicitud requiere autenticación
                    // Usuarios
              // Usuarios
              .requestMatchers(HttpMethod.GET, "/usuarios").hasAuthority("ADMIN")
              .requestMatchers(HttpMethod.GET, "/usuarios/**").hasAnyAuthority("ADMIN", "USER")
              .requestMatchers(HttpMethod.POST, "/usuarios").hasAuthority("ADMIN")
              .requestMatchers(HttpMethod.PUT, "/usuarios/**").hasAnyAuthority("ADMIN", "USER")
              .requestMatchers(HttpMethod.DELETE, "/usuarios/**").hasAuthority("ADMIN")

                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}