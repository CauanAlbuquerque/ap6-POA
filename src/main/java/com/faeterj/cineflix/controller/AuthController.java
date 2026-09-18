package com.faeterj.cineflix.controller;

import com.faeterj.cineflix.dto.Dtos.LoginRequest;
import com.faeterj.cineflix.dto.Dtos.RegisterRequest;
import com.faeterj.cineflix.dto.Dtos.UserResponse;
import com.faeterj.cineflix.model.User;
import com.faeterj.cineflix.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest req) {
        User user = authService.register(req.name(), req.email(), req.password());
        return toResponse(user);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest req) {
        User user = authService.login(req.email(), req.password());
        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }
}
