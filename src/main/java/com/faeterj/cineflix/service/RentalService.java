package com.faeterj.cineflix.service;

import com.faeterj.cineflix.model.Movie;
import com.faeterj.cineflix.model.Rental;
import com.faeterj.cineflix.model.User;
import com.faeterj.cineflix.repository.RentalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Servico de alugueis: aluga filmes e valida acesso ao player.
 */
@Service
public class RentalService {

    private final RentalRepository rentalRepository;
    private final MovieService movieService;
    private final AuthService authService;

    public RentalService(RentalRepository rentalRepository,
                         MovieService movieService,
                         AuthService authService) {
        this.rentalRepository = rentalRepository;
        this.movieService = movieService;
        this.authService = authService;
    }

    /** Realiza o aluguel de um filme para um usuario. */
    @Transactional
    public Rental rent(Long userId, Long movieId) {
        User user = authService.findById(userId);
        Movie movie = movieService.findById(movieId);

        // Ja possui aluguel ativo? Reaproveita (nao cobra de novo).
        Rental existing = findActiveRental(userId, movieId);
        if (existing != null) {
            return existing;
        }

        Rental rental = new Rental();
        rental.setUser(user);
        rental.setMovie(movie);
        rental.setRentedAt(LocalDateTime.now());
        rental.setExpiresAt(LocalDateTime.now().plusDays(movie.getRentalDays()));
        rental.setPricePaid(movie.getRentalPrice());
        return rentalRepository.save(rental);
    }

    /** Lista todos os alugueis do usuario (mais recentes primeiro). */
    public List<Rental> listByUser(Long userId) {
        return rentalRepository.findByUserIdOrderByRentedAtDesc(userId);
    }

    /** Retorna o aluguel ativo do usuario para o filme, ou null. */
    public Rental findActiveRental(Long userId, Long movieId) {
        return rentalRepository
                .findFirstByUserIdAndMovieIdAndExpiresAtAfter(userId, movieId, LocalDateTime.now())
                .orElse(null);
    }

    /** Garante que o usuario tem aluguel ativo antes de assistir. */
    public Rental requireActiveRental(Long userId, Long movieId) {
        Rental rental = findActiveRental(userId, movieId);
        if (rental == null) {
            throw new BusinessException("Voce precisa alugar este filme para assistir.");
        }
        return rental;
    }
}
