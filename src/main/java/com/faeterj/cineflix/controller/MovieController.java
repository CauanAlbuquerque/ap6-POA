package com.faeterj.cineflix.controller;

import com.faeterj.cineflix.model.Movie;
import com.faeterj.cineflix.service.MovieService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    /** Lista filmes; aceita busca por titulo (?search=) ou genero (?genre=). */
    @GetMapping
    public List<Movie> list(@RequestParam(required = false) String search,
                            @RequestParam(required = false) String genre) {
        if (search != null && !search.isBlank()) {
            return movieService.search(search);
        }
        if (genre != null && !genre.isBlank()) {
            return movieService.byGenre(genre);
        }
        return movieService.listAll();
    }

    @GetMapping("/featured")
    public List<Movie> featured() {
        return movieService.listFeatured();
    }

    @GetMapping("/{id}")
    public Movie byId(@PathVariable Long id) {
        return movieService.findById(id);
    }
}
