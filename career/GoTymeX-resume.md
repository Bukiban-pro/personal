# [Your Full Name]

**Java Backend Intern** | Ho Chi Minh City, Vietnam
📧 [your.email@gmail.com] | 📱 [+84 xxx xxx xxx]
🔗 [linkedin.com/in/yourprofile] | 💻 [github.com/Bukiban-pro/personal]

---

## Summary

Java backend developer with a production-ready **Spring Boot payment processing API** demonstrating RESTful design, JPA state-machine logic, validation, exception handling, containerization, and Swagger documentation. Comfortable with Git, CI pipelines, and AI-assisted development workflows.

---

## Technical Skills

| Category | Technologies |
|----------|-------------|
| **Languages** | Java 21, TypeScript, SQL |
| **Frameworks** | Spring Boot 3.4, Spring Data JPA, Hibernate, Jakarta Validation |
| **Databases** | H2, PostgreSQL (working knowledge) |
| **Tools** | Maven, Git, Docker, Swagger/OpenAPI, VS Code |
| **Testing** | JUnit 5, Mockito, Spring Boot Test (integration + unit) |
| **AI/LLM** | Claude, ChatGPT, Gemini — prompt engineering, code generation, diff review |
| **Other** | REST API design, OOP, SOLID, state-machine patterns, exception handling |

---

## Project

### Payment Processing API — *Spring Boot 3.4 + Java 21*
`github.com/Bukiban-pro/personal/tree/main/payment-api`

RESTful payment service with full CRUD + state progression (PENDING → PROCESSING → COMPLETED/FAILED).

- **REST endpoints**: `POST /api/v1/payments`, `GET /api/v1/payments/{id}`, `POST /api/v1/payments/{id}/process`
- **Domain design**: JPA entity with `@PrePersist` lifecycle hook, `BigDecimal` amounts, `@Enumerated(EnumType.STRING)` status
- **Validation**: `@Valid` request body with Jakarta Bean Validation constraints
- **Error handling**: `@ExceptionHandler` for not-found (404) and illegal-state (409) — production-grade error responses
- **State machine**: Guard clause pattern prevents invalid state transitions (PENDING guard on process)
- **Testing**: 12 tests — 5 unit (service logic, validation, edge cases) + 7 integration (full controller → DB → response)
- **Containerization**: Docker image with multi-stage build
- **Documentation**: Swagger UI at `/swagger-ui.html` for interactive API exploration
- **Build**: Maven, Java 21 records for DTOs, clean package structure

---

## Education

**Bachelor of Computer Science / Software Engineering** (or related)
*[University Name]* — Ho Chi Minh City
*Expected Graduation: [Month Year]* | *GPA: [score]/10*

**Relevant coursework**: Data Structures & Algorithms, Object-Oriented Programming, Database Systems, Software Engineering

---

## Additional

- **Languages**: Vietnamese (native), English (technical reading/writing)
- **Tools I use daily**: VS Code + PowerShell + Git + Maven → commit → push cycle
- **AI-native workflow**: Use Claude/GPT for code review, diff validation, test generation, and architecture discussions
- **Availability**: Full-time intern, 3-6 months, immediate start
