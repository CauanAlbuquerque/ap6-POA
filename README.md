# CineFlix 🎬

Locadora online de filmes (estilo Netflix, com aluguéis). Você navega por um
catálogo, aluga filmes e assiste pelo tempo contratado.

## Tecnologias

- **Backend:** Java 17 + Spring Boot 3 (Spring Web, Spring Data JPA)
- **Banco de dados:** H2 (SQL, arquivo local) com scripts `schema.sql` e `data.sql`
- **Frontend:** HTML + CSS + JavaScript puro (sem frameworks)

## Funcionalidades

- Cadastro e login de usuários
- Catálogo com banner de destaque, trilhos por gênero e busca
- Aluguel de filmes com preço e prazo de acesso
- Página "Meus Aluguéis" com status (ativo/expirado) e player de vídeo
- Player só libera o filme se houver aluguel ativo (validado no backend)

## Como executar

Pré-requisitos: **JDK 17** e **Maven** instalados.

```bash
# compilar e gerar o JAR
mvn -DskipTests package

# executar
java -jar target/cineflix-1.0.0.jar
```

Acesse: <http://localhost:8080>

Conta de demonstração: `demo@cineflix.com` / senha `123456`

## Estrutura

```
src/main/java/com/faeterj/cineflix
├── controller   # endpoints REST (auth, movies, rentals)
├── service      # regras de negócio
├── repository   # acesso a dados (JPA)
├── model        # entidades (User, Movie, Rental)
└── dto          # objetos de transferência

src/main/resources
├── schema.sql              # criação das tabelas
├── data.sql                # filmes e usuário de exemplo
├── application.properties  # configuração
└── static                  # frontend (HTML, CSS, JS)
```

## API

| Método | Rota                                  | Descrição                     |
|--------|---------------------------------------|-------------------------------|
| POST   | `/api/auth/register`                  | Cadastro                      |
| POST   | `/api/auth/login`                     | Login                         |
| GET    | `/api/movies`                         | Lista filmes (`?search`/`?genre`) |
| GET    | `/api/movies/featured`                | Filmes em destaque            |
| GET    | `/api/movies/{id}`                    | Detalhe do filme              |
| POST   | `/api/rentals`                        | Alugar filme                  |
| GET    | `/api/rentals?userId=`                | Aluguéis do usuário           |
| GET    | `/api/rentals/watch?userId=&movieId=` | Valida acesso e retorna vídeo |
