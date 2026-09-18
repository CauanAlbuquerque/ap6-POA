package com.faeterj.cineflix.dto;

/** Payloads de entrada e saida da API. */
public class Dtos {

    public record RegisterRequest(String name, String email, String password) {}

    public record LoginRequest(String email, String password) {}

    public record RentRequest(Long userId, Long movieId) {}

    public record UserResponse(Long id, String name, String email) {}

    public record ErrorResponse(String message) {}
}
