-- ============================================================
--  CineFlix - Schema do banco de dados (H2 / SQL)
-- ============================================================

-- Tabela de usuarios
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120)        NOT NULL,
    email       VARCHAR(180) UNIQUE NOT NULL,
    password    VARCHAR(200)        NOT NULL,
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de filmes (catalogo)
CREATE TABLE IF NOT EXISTS movies (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    title          VARCHAR(200)   NOT NULL,
    description    VARCHAR(2000)  NOT NULL,
    genre          VARCHAR(80)    NOT NULL,
    release_year   INT            NOT NULL,
    duration_min   INT            NOT NULL,
    rating         VARCHAR(10),
    poster_url     VARCHAR(500),
    backdrop_url   VARCHAR(500),
    video_url      VARCHAR(500),
    rental_price   DECIMAL(10,2)  NOT NULL,
    rental_days    INT            NOT NULL DEFAULT 2,
    featured       BOOLEAN        NOT NULL DEFAULT FALSE
);

-- Tabela de alugueis
CREATE TABLE IF NOT EXISTS rentals (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT        NOT NULL,
    movie_id     BIGINT        NOT NULL,
    rented_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at   TIMESTAMP     NOT NULL,
    price_paid   DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_rental_user  FOREIGN KEY (user_id)  REFERENCES users(id),
    CONSTRAINT fk_rental_movie FOREIGN KEY (movie_id) REFERENCES movies(id)
);
