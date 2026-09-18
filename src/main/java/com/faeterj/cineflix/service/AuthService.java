package com.faeterj.cineflix.service;

import com.faeterj.cineflix.model.User;
import com.faeterj.cineflix.repository.UserRepository;
import org.springframework.stereotype.Service;

/**
 * Servico de autenticacao e cadastro de usuarios.
 *
 * Observacao: para fins didaticos a senha e comparada em texto puro.
 * Em producao use hashing (ex.: BCrypt via spring-security-crypto).
 */
@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String name, String email, String password) {
        if (name == null || name.isBlank()) {
            throw new BusinessException("Informe seu nome.");
        }
        if (email == null || email.isBlank()) {
            throw new BusinessException("Informe um e-mail.");
        }
        if (password == null || password.length() < 6) {
            throw new BusinessException("A senha deve ter ao menos 6 caracteres.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("Ja existe uma conta com este e-mail.");
        }
        User user = new User(name.trim(), email.trim().toLowerCase(), password);
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email == null ? "" : email.trim().toLowerCase())
                .orElseThrow(() -> new BusinessException("E-mail ou senha invalidos."));
        if (!user.getPassword().equals(password)) {
            throw new BusinessException("E-mail ou senha invalidos.");
        }
        return user;
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Usuario nao encontrado."));
    }
}
