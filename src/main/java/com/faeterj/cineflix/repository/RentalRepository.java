package com.faeterj.cineflix.repository;

import com.faeterj.cineflix.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    List<Rental> findByUserIdOrderByRentedAtDesc(Long userId);

    /** Aluguel ativo (nao expirado) de um usuario para um filme especifico. */
    Optional<Rental> findFirstByUserIdAndMovieIdAndExpiresAtAfter(
            Long userId, Long movieId, LocalDateTime now);
}
