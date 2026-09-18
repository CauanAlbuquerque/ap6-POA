package com.faeterj.cineflix.repository;

import com.faeterj.cineflix.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByFeaturedTrue();

    List<Movie> findByGenreIgnoreCase(String genre);

    List<Movie> findByTitleContainingIgnoreCase(String title);
}
