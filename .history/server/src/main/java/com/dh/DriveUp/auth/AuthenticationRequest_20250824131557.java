package com.dh.DriveUp.auth;

import java.util.Objects;

public class AuthenticationRequest {

    private String email;
    private String password;

    // Constructor vacío (necesario para frameworks como Spring)
    public AuthenticationRequest() {
    }

    // Constructor con parámetros
    public AuthenticationRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // Setters
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // equals y hashCode (útil si comparas objetos)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AuthenticationRequest)) return false;
        AuthenticationRequest that = (AuthenticationRequest) o;
        return Objects.equals(email, that.email) &&
                Objects.equals(password, that.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email, password);
    }

    // toString (para debug) esto es temporal - BORRARLO LUEGO DE PRUEBAS
    @Override
    public String toString() {
        return "AuthenticationRequest{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
