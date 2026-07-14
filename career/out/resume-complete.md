# Bui Khiem (Bukiban)

**Java Backend Intern** | Ho Chi Minh City, Vietnam
📧 buikhiem.dev@gmail.com | 📱 +84 794 196 196
🔗 [linkedin.com/in/buikhiem](https://linkedin.com/in/buikhiem) | 💻 [github.com/Bukiban-pro/personal](https://github.com/Bukiban-pro/personal)

---

## Summary

Java backend developer with a production-grade **Spring Boot 3.4 payment processing API** — 17 passing tests (1.27:1 test-to-code ratio), 4 REST endpoints, 5-state state machine, Docker containerization, and Swagger documentation. Built with Java 21 records, constructor injection, and declarative validation. Proven ability to ship production-quality code with comprehensive test coverage, containerized deployment, and AI-assisted development workflows.

---

## Technical Skills

| Category | Technologies |
|----------|-------------|
| **Languages** | Java 21, TypeScript, SQL |
| **Frameworks** | Spring Boot 3.4, Spring Data JPA, Hibernate, Jakarta Validation |
| **Databases** | H2 (dev/test), PostgreSQL (production-ready via profile swap) |
| **Tools** | Maven, Git, Docker, Swagger/OpenAPI (springdoc-openapi 2.8.6), VS Code |
| **Testing** | JUnit 5, Mockito, Spring Boot Test — 17 tests (8 unit + 9 integration), 1.27:1 test-to-code ratio |
| **AI/LLM** | Claude, ChatGPT, Gemini — prompt engineering, code review, diff validation, architecture discussion |
| **Other** | REST API design, OOP, SOLID, state-machine patterns, constructor injection, idempotent operations |

---

## Project

### Payment Processing API — *Spring Boot 3.4.4 + Java 21*
`github.com/Bukiban-pro/personal/tree/main/payment-api`

Production-grade RESTful payment service with a 5-state state machine (PENDING → PROCESSING → COMPLETED → REFUNDED, with FAILED terminal state) across 4 endpoints.

- **REST endpoints**: `POST /api/v1/payments` (201), `GET /api/v1/payments/{id}` (200), `POST /api/v1/payments/{id}/process` (200), `POST /api/v1/payments/{id}/refund` (200)
- **Domain design**: JPA entity with `@PrePersist` lifecycle hook, `BigDecimal` monetary amounts with precision/scale, `@Enumerated(EnumType.STRING)` status, 5-state state machine with transition guards
- **Validation**: 6 declarative Jakarta Bean Validation constraints on request DTO (`@NotBlank`, `@NotNull`, `@DecimalMin`, `@DecimalMax`, `@Size`) with custom error messages
- **Error handling**: Structured `@ExceptionHandler` returning proper HTTP codes — 404 for not-found, 409 for illegal state transitions
- **State machine**: Guard clause pattern prevents invalid transitions; idempotent refund operation (re-refunding is safe)
- **Testing**: 17 tests — 8 unit (Mockito, service logic, edge cases, idempotency) + 9 integration (MockMvc, full stack, real H2 database). 1.27:1 test-to-code ratio. 0% failure rate.
- **Design patterns**: 8 patterns — DTO (records), Repository, Service Layer, Constructor Injection, Exception Handler, Static Factory, Lifecycle Callback, Idempotent Operation
- **Containerization**: Docker multi-stage build on `eclipse-temurin:21-jre-alpine` (93 MB base), docker-compose with profile-aware config
- **Documentation**: Swagger UI at `/swagger-ui.html` (springdoc-openapi 2.8.6)
- **Build**: Maven, Java 21 records for DTOs, 2 Spring profiles (dev H2 in-memory, docker H2 file-based), documented PostgreSQL swap path

---

## Education

**Bachelor of Computer Science / Software Engineering**
*Nong Lam University* — Ho Chi Minh City
*Expected Graduation: 2027* | *GPA: 7.5/10*

**Relevant coursework**: Data Structures & Algorithms, Object-Oriented Programming, Database Systems, Software Engineering

---

## Additional

- **Languages**: Vietnamese (native), English (technical reading/writing)
- **Tools I use daily**: VS Code + PowerShell + Git + Maven → commit → push → test cycle
- **AI-native workflow**: Use Claude/GPT for code review, diff validation, test generation, and architecture discussions — documented in `BELT.md` operating system
- **Availability**: Full-time intern, 3-6 months, immediate start
