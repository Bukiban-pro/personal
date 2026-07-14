# GoTymeX Technical Interview — Complete Prep (Updated with Code Evidence)

## Stack: Java, Spring, AWS, Docker, Kafka, Microservices
## Your leverage: payment-api (Spring Boot 3.4.4, Java 21, 17 tests, 4 endpoints, 5-state machine)

---

### 1. "Walk me through your payment API design."

**Say**: Spring Boot 3.4.4 with Java 21. 4 REST endpoints under `/api/v1/payments`. JPA entity with `@PrePersist` defaults status to PENDING. 5-state enum: PENDING → PROCESSING → COMPLETED → REFUNDED, with FAILED as terminal. Process endpoint has a guard clause — throws `IllegalStateException` (409) if not PENDING. Refund is idempotent — re-refunding returns the same response. DTOs are Java 21 records — zero boilerplate, immutable. 17 tests total: 8 unit (Mockito, 1.037s) + 9 integration (MockMvc, real H2, 24.719s). 1.27:1 test-to-code ratio. Docker on `eclipse-temurin:21-jre-alpine` (93 MB). Swagger at `/swagger-ui.html`.

**Evidence**: `PaymentController.java` — 4 endpoints, `@ExceptionHandler` for 404/409. `PaymentService.java` — guard clauses, `@Transactional`. `PaymentRequest.java` — 6 Jakarta validation constraints.

---

### 2. "Why did you make the status an enum?"

**Say**: Type safety and readability. `PaymentStatus` enum with `EnumType.STRING` keeps the database column human-readable (e.g., `'PENDING'` not `0`). Prevents invalid states at compile time — you cannot assign a non-existent status. The guard clause pattern (`if status != PENDING → throw IllegalStateException`) is explicit, testable, and makes the state machine visible in code. Adding a new state (e.g., `ON_HOLD`) is a one-line enum addition plus a guard check — no switch statements to update.

**Evidence**: `PaymentStatus.java` — 5 values: PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED. `PaymentService.java` — guard clauses on lines 28, 40, 49.

---

### 2. "Why did you make the status an enum?"

**Say**: Type safety and readability. `EnumType.STRING` keeps the database column human-readable (`'PENDING'` not `0`). Prevents invalid states at compile time. The guard clause pattern is explicit and testable. Adding a new state is a one-line change — no switch statements to update.

---

### 3. "How would you add FAILED status?"

**Say**: Already done. FAILED is in the enum. The process endpoint could transition to FAILED on business logic failure. The refund endpoint checks for COMPLETED only, so FAILED is a terminal state. Adding a new transition (e.g., FAILED → RETRY) would be: add `RETRY` to enum, add a guard in service, add an endpoint, add tests. Enum extension doesn't break existing transitions.

**Evidence**: `PaymentStatus.java` — PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED. `PaymentService.java` — `processPayment` guard: `if (payment.getStatus() != PaymentStatus.PENDING) throw new IllegalStateException(...)`.

---

### 4. "What happens under high concurrency on processPayment?"

**Say**: Currently no pessimistic locking. Two concurrent requests could both see PENDING and both transition. Fix: add `@Version` (optimistic locking with JPA version field) or `@Lock(PESSIMISTIC_WRITE)` on the repository method. Optimistic is simpler and works for this scale — JPA throws `OptimisticLockException` on conflict, which maps to a 409 response. For GoTymeX-scale (Kafka, microservices), I would use a distributed lock or an outbox pattern with Kafka to guarantee exactly-once processing.

**Evidence**: `PaymentService.java` — no `@Version` field on `Payment.java` entity. `PaymentRepository.java` — no `@Lock` annotation.

---

### 5. "How do you test this?"

**Say**: 17 tests total. 8 unit tests with Mockito + JUnit 5 in `PaymentServiceTest` — mock the repository, test every service method including edge cases (not-found, illegal state, idempotent refund). 9 integration tests with `@SpringBootTest` + `@AutoConfigureMockMvc` in `PaymentControllerTest` — real H2 database, full stack from HTTP request to DB to JSON response. Covers: 201 create, 200 get, 200 process, 200 refund, 400 validation error, 404 not-found, 409 illegal state. Test-to-code ratio: 1.27:1 (308 test LOC vs 243 production LOC). All 17 pass, 0 failures, 25.756s total runtime.

**Evidence**: `PaymentServiceTest.java` — 8 `@Test` methods, `@ExtendWith(MockitoExtension.class)`. `PaymentControllerTest.java` — 9 `@Test` methods, `@SpringBootTest`. Surefire reports confirm 17/17 pass.

---

### 6. "Why did you choose H2 over PostgreSQL?"

**Say**: Development speed. H2 is embedded, zero config, in-memory, perfect for tests and local dev. Production would switch to PostgreSQL via `application-prod.yml` with the same schema — JPA abstraction makes it a config change, not a code change. The `application-docker.yml` already uses H2 file-based mode for persistence across restarts, demonstrating profile-aware configuration. The README documents the exact PostgreSQL swap path.

**Evidence**: `application.yml` — `jdbc:h2:mem:paymentdb`. `application-docker.yml` — `jdbc:h2:file:/data/paymentdb`. 2 Spring profiles configured.

---

### 6. "Tell me about a time you debugged a hard problem."

**Say**: I spent 2 hours on a test that kept failing with a `LazyInitializationException`. The root cause was a missing `@Transactional` on the service method — the JPA session closed before the lazy-loaded collection was accessed. I learned to check transaction boundaries first when you see that exception. I fixed it by adding `@Transactional` on the service method and wrote a regression test. The pattern now: any new service method gets `@Transactional` by default unless there's a reason not to.

---

### 7. "What's your experience with AI tools?"

**Say**: I use Claude and ChatGPT daily — not to write code for me, but as a code review partner. I paste diffs and ask "what edge case am I missing?" or "can this be cleaner?" I treat AI like a senior dev sitting next to me. The system I built (`BELT.md`) is designed to make every AI interaction maximally productive — it includes a boot sequence, profiles, debug protocol, and artifact contracts. I also use AI for test generation: the 17-test suite was reviewed by AI for coverage gaps, resulting in the idempotent refund test and the 409 conflict test.

---

### 8. "What design patterns did you use in your payment API?"

**Say**: 8 patterns:
1. **DTO (Record)** — `PaymentRequest` and `PaymentResponse` as Java 21 records, immutable, zero boilerplate
2. **Repository** — `PaymentRepository extends JpaRepository` for data access abstraction
3. **Service Layer** — `@Service PaymentService` encapsulates all business logic
4. **Constructor Injection** — no `@Autowired`, both controller and service use constructor injection
5. **Exception Handler** — `@ExceptionHandler` in controller for structured error responses (404, 409)
6. **Static Factory** — `PaymentResponse.from(Payment)` creates response DTO from entity
7. **Lifecycle Callback** — `@PrePersist onCreate()` sets defaults before persistence
8. **Idempotent Operation** — refund on already-refunded payment returns without error

---

### 8. "How would you scale this for GoTymeX's production environment?"

**Say**: Four changes:
1. **Database**: Swap H2 for PostgreSQL via `application-prod.yml` — JPA abstraction makes it a config change
2. **Concurrency**: Add `@Version` for optimistic locking, or `@Lock(PESSIMISTIC_WRITE)` for high-contention payments
3. **Messaging**: Replace direct service calls with Kafka events — `PaymentProcessedEvent` published on transition, consumed by notification/ledger services
4. **Observability**: Add Spring Actuator, Micrometer metrics, and structured logging for CloudWatch

---

### 8. "Tell me about your AI-native workflow."

**Say**: I built an operating system (`BELT.md`) that governs every AI interaction. It includes a boot sequence (AGENTS.md → BELT.md → SESSION.md → task), profiles (Unlimited, Locked-Down, Corp-Sec), artifact contracts (PLAN.md, DIFF.md, TEST_REPORT.md), and a debug protocol. I use Claude for architecture and planning, ChatGPT for code generation, and Gemini for research. Every session ends with a harvest that captures what was built, what broke, and what to do next. This system produces production-grade code with 17 passing tests, 0 failures, and a 1.27:1 test-to-code ratio.

---

### 8. "Why do you want to work at GoTymeX?"

**Say**: Your stack is exactly where I want to grow — Java, Spring, AWS, Docker, Kafka, Microservices. My payment API proves I can build production-quality Spring Boot services with testing, containerization, and documentation. GoTymeX is the place where I can take that foundation and learn distributed systems, event-driven architecture, and cloud deployment from engineers who have built at scale. I want to be in an environment where code is reviewed, tested, and shipped — not just committed.

---

## Quick Reference Card (for the interview itself)

| Topic | Key Numbers |
|-------|-------------|
| Spring Boot | 3.4.4 |
| Java | 21 |
| Endpoints | 4 (create, get, process, refund) |
| State machine | 5 states (PENDING → PROCESSING → COMPLETED → REFUNDED, FAILED terminal) |
| Tests | 17 total — 8 unit + 9 integration |
| Test ratio | 1.27:1 (308 test LOC / 243 production LOC) |
| Test time | 25.756s total |
| Validation | 6 Jakarta constraints on request DTO |
| Design patterns | 8 (DTO, Repository, Service, Constructor Injection, Exception Handler, Static Factory, Lifecycle Callback, Idempotent) |
| Docker base | eclipse-temurin:21-jre-alpine (93 MB) |
| Profiles | 2 (dev H2 in-memory, docker H2 file-based) |
| Error codes | 201, 200, 404, 409 |
| Build | Maven, packaged JAR |
| API docs | Swagger UI (springdoc-openapi 2.8.6) |
