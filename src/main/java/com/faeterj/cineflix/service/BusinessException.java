package com.faeterj.cineflix.service;

/** Excecao para erros de regra de negocio (retorna 400/409 na API). */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
