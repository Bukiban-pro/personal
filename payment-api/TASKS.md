## [TASK] Add refund endpoint
Status: pending
Description: POST /api/v1/payments/{id}/refund — transitions REFUNDED state, idempotent
Files: `src/main/java/com/example/payment/PaymentController.java`, `src/main/java/com/example/payment/PaymentService.java`, `src/test/java/com/example/payment/PaymentControllerTest.java`

## [TASK] Replace H2 with PostgreSQL for production
Status: pending
Description: Add PostgreSQL dependency, docker-compose postgres service, application-prod.yml
Files: `pom.xml`, `docker-compose.yml`, `src/main/resources/application-prod.yml`

## [TASK] Add pagination to GET /api/v1/payments
Status: pending
Description: Support ?page=0&size=20 query params, return Page<PaymentResponse>
Files: `src/main/java/com/example/payment/PaymentController.java`, `src/main/java/com/example/payment/PaymentRepository.java`

## [TASK] Add metrics endpoint
Status: pending
Description: Add spring-boot-starter-actuator, expose /actuator/health, /actuator/metrics
Files: `pom.xml`
