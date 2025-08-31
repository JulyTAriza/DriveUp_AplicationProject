package com.dh.DriveUp.config;

import java.io.IOException;

import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain)
            throws ServletException, IOException {

        try {
            final String authHeader = request.getHeader("Authorization");
            log.debug("Request {} {} Authorization header present={}", request.getMethod(), request.getRequestURI(), authHeader != null);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                // no token -> continuar la cadena (público o manejo por Spring)
                return;
            }

            final String jwt = authHeader.substring(7);
            String userEmail = null;
            try {
                userEmail = jwtService.extractUsername(jwt);
                log.debug("extractUsername -> {}", userEmail);
            } catch (Exception e) {
                log.warn("Error extracting username from token", e);
            }

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = null;
                try {
                    userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                    log.debug("Loaded userDetails: username={}, authorities={}", userDetails.getUsername(), userDetails.getAuthorities());
                } catch (Exception e) {
                    log.warn("Error loading userDetails for {}: {}", userEmail, e.getMessage());
                }

                boolean valid = false;
                try {
                    valid = userDetails != null && jwtService.isTokenValid(jwt, userDetails);
                    log.debug("isTokenValid -> {}", valid);
                } catch (Exception e) {
                    log.warn("Error validating token: {}", e.getMessage(), e);
                }

                if (valid) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    log.info("Authentication set for user: {}", userDetails.getUsername());
                } else {
                    log.debug("Token invalid or userDetails null, not setting authentication");
                }
            }
        } finally {
            // IMPORTANTE: siempre continuar la cadena de filtros
            filterChain.doFilter(request, response);
        }
    }
}
