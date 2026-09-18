package com.faeterj.cineflix.service;

import com.faeterj.cineflix.model.Movie;
import com.faeterj.cineflix.repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servico de catalogo de filmes.
 */
@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> listAll() {
        return movieRepository.findAll();
    }

    public List<Movie> listFeatured() {
        return movieRepository.findByFeaturedTrue();
    }

    public List<Movie> search(String query) {
        if (query == null || query.isBlank()) {
            return listAll();
        }
        return movieRepository.findByTitleContainingIgnoreCase(query.trim());
    }

    public List<Movie> byGenre(String genre) {
        return movieRepository.findByGenreIgnoreCase(genre);
    }

    public Movie findById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Filme nao encontrado."));
    }
}
