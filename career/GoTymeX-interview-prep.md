# GoTymeX Technical Interview — Targeted Prep

## Stack they use: Java, Spring, AWS, Docker, Kafka, Microservices
## What they'll ask about your payment-api project:

---

### 1. "Walk me through your payment API design."
**Say**: Spring Boot 3.4, 3 REST endpoints under `/api/v1/payments`. JPA entity with `@PrePersist` defaults status to PENDING. Process endpoint has a guard — throws 409 if not PENDING. DTOs are Java 21 records. 12 tests cover happy path + edge cases. Docker runs it on port 8080.

---

### 2. "Why did you make the status an enum?"
**Say**: Type safety. Enum with `EnumType.STRING` keeps the DB readable. Prevents invalid states at compile time. The guard clause (`if status != PENDING → throw`) is explicit and testable.

---

### 3. "How would you add FAILED status?"
**Say**: Add `FAILED` to the enum. Add a `/process` rollback path that sets status to `FAILED` with a reason field. New integration test for the transition. That's it — enum extension doesn't break existing PENDING→PROCESSING logic.

---

### 4. "What happens under high concurrency on processPayment?"
**Say**: Currently no pessimistic locking. Two requests could see PENDING simultaneously. Fix: add `@Version` (optimistic locking with JPA version field) or `SELECT ... FOR UPDATE` with `@Lock(PESSIMISTIC_WRITE)`. Optimistic is simpler and works for this scale.

---

### 5. "How do you test this?"
**Say**: 5 unit tests for service logic (edge cases like duplicate process, nonexistent payment). 7 integration tests with `@SpringBootTest` that hit the full stack — controller → service → DB → response. No mocking of JPA — real H2 database for integration.

---

### 6. "Why did you choose H2 over PostgreSQL?"
**Say**: Development speed. H2 is embedded, zero config, in-memory, perfect for tests. Production would switch to PostgreSQL via `application-prod.yml` with the same schema. The JPA abstraction makes it a config change, not a code change.

---

### 7. "Tell me about a time you debugged a hard problem."
**Say**: (Use a real example from your experience. If none: "I spent 2 hours on a test that kept failing — it was a missing `@Transactional` on the service method. Learned to check transaction boundaries first when you see `LazyInitializationException`.")

---

### 8. "What's your experience with AI tools?"
**Say**: I use Claude and ChatGPT daily — not to write code for me, but as a code review partner. I paste diffs and ask "what edge case am I missing?" or "can this be cleaner?" I treat AI like a senior dev sitting next to me. The system I built (`BELT.md`) is designed to make every AI interaction maximally productive.

---

## My payment API is your leverage. Every answer brings it back to the code you wrote.
