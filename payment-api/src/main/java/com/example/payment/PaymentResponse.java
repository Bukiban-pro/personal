package com.example.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
    Long id,
    String userId,
    BigDecimal amount,
    String currency,
    String status,
    LocalDateTime createdAt,
    LocalDateTime processedAt
) {
    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
            payment.getId(),
            payment.getUserId(),
            payment.getAmount(),
            payment.getCurrency(),
            payment.getStatus().name(),
            payment.getCreatedAt(),
            payment.getProcessedAt()
        );
    }
}
