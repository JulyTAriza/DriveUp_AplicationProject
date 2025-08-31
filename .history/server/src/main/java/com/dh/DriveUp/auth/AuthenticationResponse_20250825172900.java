package com.dh.DriveUp.auth;

import com.dh.DriveUp.entity.Role;

public class AuthenticationResponse {

    private String token;
    private Long id;
    private String email;
    private Role rol;

    public AuthenticationResponse() {
    }

    public AuthenticationResponse(String token, Long id, String email, Role rol) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.rol = rol;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRol() {
        return rol;
    }

    public void setRol(Role rol) {
        this.rol = rol;
    }

    // Builder manual actualizado
    public static class Builder {
        private String token;
        private Long id;
        private String email;
        private Role rol;

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder rol(Role rol) {
            this.rol = rol;
            return this;
        }

        public AuthenticationResponse build() {
            return new AuthenticationResponse(token, id, email, rol);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
