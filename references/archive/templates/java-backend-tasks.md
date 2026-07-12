# Java Backend Task Templates

## Implement REST Endpoint

Formula: `core + profile + task`

```
1. Identify: what's the resource? what CRUD operations? what are the contracts?
2. Follow existing patterns: check an existing Controller/Service/Repository first.
3. Artifacts:
   - DTO (request/response classes, with validation annotations)
   - Entity (JPA annotations, table mapping)
   - Repository (Spring Data JPA interface)
   - Service (business logic, transaction boundaries)
   - Controller (REST mapping, status codes, exception handling)
   - Exception handler (if new error type)
4. Tests: Controller test (MockMvc), Service test (unit), Repository test (@DataJpaTest)
5. Verify: compile, run related tests, check OpenAPI spec if available.
```

## Write DB Migration

Formula: `core + profile + task`

```
- Tool: Flyway or Liquibase (check build.gradle for which)
- Pattern: V<timestamp>__<description>.sql
- Include: rollback script (if team convention requires it)
- Check: existing migrations for naming conventions
- Verify: migration runs clean, rollback works
```

## Create Service Layer

Formula: `core + profile + task`

```
1. Interface first: define the contract (what, not how)
2. Implementation: @Service, @Transactional, dependency injection via constructor
3. Error handling: custom exceptions extending RuntimeException or team base
4. Logging: Slf4j at info/warn/error boundaries
5. Tests: mock dependencies, test happy path + edge cases + error paths
```

## Debug Production Issue

Formula: `core + profile + inquisitor + problem`

```
1. Collect: error logs, stack traces, timestamps, request IDs
2. Reproduce: is it deterministic or flaky?
3. Hypothesize: 3 most likely root causes
4. Verify: add logging if needed, check recent changes
5. Fix: minimal change, root cause only
6. Verify: deploy fix, monitor for 15min
```

## Add Validation

Formula: `core + profile + task`

```
- Bean Validation: jakarta.validation.constraints on DTOs
- Custom validator: if team convention exists, use it; otherwise @Pattern or custom ConstraintValidator
- Service-layer validation: for cross-field or business logic rules
- Test: invalid inputs produce correct error codes
```

## Refactor Legacy Code

Formula: `core + profile + inquisitor + task`

```
1. Understand: what does it do? what are the inputs/outputs?
2. Test: write characterization tests (capture current behavior)
3. Refactor: one pattern at a time (extract method, extract class, rename)
4. Verify: characterization tests still pass
5. Cleanup: remove dead code, unused imports
```

## Common Patterns

Check existing code first. If no precedent, use these conventions:
- Controller: @RestController, @RequestMapping("/api/v1/resources")
- Service: Interface + Impl pattern
- Repository: extend JpaRepository
- DTO: Java record (or class if records not available)
- Exception: extend RuntimeException, @ResponseStatus for HTTP mapping
- Logging: private static final Logger log = LoggerFactory.getLogger(X.class)

## Build Tools
- Gradle: check build.gradle or build.gradle.kts — note the DSL (Groovy vs Kotlin)
- Spring Boot version: always check which version is in use (affects API compatibility)
- Java version: check sourceCompatibility or java { toolchain }
