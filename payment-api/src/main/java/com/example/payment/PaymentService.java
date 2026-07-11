package com.example.payment;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final PaymentRepository repository;

    public PaymentService(PaymentRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Payment payment = new Payment();
        payment.setUserId(request.userId());
        payment.setAmount(request.amount());
        payment.setCurrency(request.currency().toUpperCase());
        payment = repository.save(payment);
        return PaymentResponse.from(payment);
    }

    public PaymentResponse getPayment(Long id) {
        Payment payment = repository.findById(id)
            .orElseThrow(() -> new PaymentNotFoundException(id));
        return PaymentResponse.from(payment);
    }

    @Transactional
    public PaymentResponse processPayment(Long id) {
        Payment payment = repository.findById(id)
            .orElseThrow(() -> new PaymentNotFoundException(id));
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new IllegalStateException("Payment " + id + " is not in PENDING state");
        }
        payment.setStatus(PaymentStatus.PROCESSING);
        payment.setProcessedAt(LocalDateTime.now());
        payment = repository.save(payment);
        return PaymentResponse.from(payment);
    }
}
