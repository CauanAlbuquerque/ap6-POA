package com.faeterj.cineflix.controller;

import com.faeterj.cineflix.dto.Dtos.RentRequest;
import com.faeterj.cineflix.model.Movie;
import com.faeterj.cineflix.model.Rental;
import com.faeterj.cineflix.service.RentalService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    /** DTO de resposta do aluguel (evita serializar entidades com relacoes lazy). */
    public record RentalResponse(
            Long id,
            Movie movie,
            LocalDateTime rentedAt,
            LocalDateTime expiresAt,
            BigDecimal pricePaid,
            boolean active) {
    }

    /** Aluga um filme. */
    @PostMapping
    public RentalResponse rent(@RequestBody RentRequest req) {
        Rental rental = rentalService.rent(req.userId(), req.movieId());
        return toResponse(rental);
    }

    /** Lista os alugueis de um usuario. */
    @GetMapping
    public List<RentalResponse> myRentals(@RequestParam Long userId) {
        return rentalService.listByUser(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    /** Verifica se o usuario pode assistir (tem aluguel ativo) e devolve dados para o player. */
    @GetMapping("/watch")
    public RentalResponse watch(@RequestParam Long userId, @RequestParam Long movieId) {
        Rental rental = rentalService.requireActiveRental(userId, movieId);
        return toResponse(rental);
    }

    private RentalResponse toResponse(Rental r) {
        return new RentalResponse(
                r.getId(),
                r.getMovie(),
                r.getRentedAt(),
                r.getExpiresAt(),
                r.getPricePaid(),
                r.isActive());
    }
}
