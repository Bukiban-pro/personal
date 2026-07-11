# payment-api

RESTful payment processing API built with Spring Boot 3.4, Java 21, and JPA.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/payments` | Create a payment |
| GET | `/api/v1/payments/{id}` | Get payment by ID |
| POST | `/api/v1/payments/{id}/process` | Process a pending payment |

Swagger UI: http://localhost:8080/swagger-ui.html

## Run locally

```bash
./mvnw spring-boot:run
```

## Run with Docker

```bash
docker compose up --build
```

## Run tests

```bash
./mvnw test
```

## Design decisions

- Java records for DTOs (immutable, concise, no boilerplate)
- Constructor injection (testable, explicit dependencies)
- Custom `RuntimeException` for 404 (consistent with Spring `ResponseEntityExceptionHandler`)
- Validation via `jakarta.validation` annotations (declarative, framework-agnostic)
- In-memory H2 for dev, file-based H2 for Docker (swap to PostgreSQL by changing URL + driver)
