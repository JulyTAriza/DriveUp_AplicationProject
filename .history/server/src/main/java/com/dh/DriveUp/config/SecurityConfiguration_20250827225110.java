package com.dh.DriveUp.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().and()
            .authorizeHttpRequests()
                // Rutas públicas que no requieren autenticación
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/autos", "/autos/{id}").permitAll()
                // Rutas para administradores que requieren el rol 'ADMIN'
                .requestMatchers(HttpMethod.POST, "/autos").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/autos").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/autos/{id}").hasRole("ADMIN")
                // Cualquier otra solicitud requiere autenticación
                .anyRequest().authenticated()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
