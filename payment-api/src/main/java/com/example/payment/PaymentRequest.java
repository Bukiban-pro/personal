package com.example.payment;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record PaymentRequest(
    @NotBlank(message = "userId is required")
    String userId,

    @NotNull(message = "amount is required")
    @DecimalMin(value = "0.01", message = "amount must be positive")
    @DecimalMax(value = "999999.99", message = "amount exceeds maximum")
    BigDecimal amount,

    @NotBlank(message = "currency is required")
    @Size(min = 3, max = 3, message = "currency must be 3 characters")
    String currency
) {}
