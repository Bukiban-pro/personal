package com.example.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(String userId);
    List<Payment> findByStatus(PaymentStatus status);
    long countByUserIdAndStatus(String userId, PaymentStatus status);
}
