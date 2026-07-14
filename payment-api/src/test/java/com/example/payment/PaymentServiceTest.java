package com.example.payment;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository repository;

    @InjectMocks
    private PaymentService service;

    @Test
    void createPayment_shouldSaveAndReturnResponse() {
        PaymentRequest request = new PaymentRequest("user1", new BigDecimal("99.99"), "USD");

        Payment savedPayment = new Payment();
        savedPayment.setId(1L);
        savedPayment.setUserId("user1");
        savedPayment.setAmount(new BigDecimal("99.99"));
        savedPayment.setCurrency("USD");
        savedPayment.setStatus(PaymentStatus.PENDING);
        savedPayment.onCreate();

        when(repository.save(any(Payment.class))).thenReturn(savedPayment);

        PaymentResponse response = service.createPayment(request);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("user1", response.userId());
        assertEquals(new BigDecimal("99.99"), response.amount());
        assertEquals("USD", response.currency());
        assertEquals("PENDING", response.status());
        assertNotNull(response.createdAt());

        verify(repository).save(any(Payment.class));
    }

    @Test
    void getPayment_whenExists_shouldReturnResponse() {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setUserId("user1");
        payment.setAmount(new BigDecimal("50.00"));
        payment.setCurrency("EUR");
        payment.onCreate();

        when(repository.findById(1L)).thenReturn(Optional.of(payment));

        PaymentResponse response = service.getPayment(1L);

        assertNotNull(response);
        assertEquals(1L, response.id());

        verify(repository).findById(1L);
    }

    @Test
    void getPayment_whenNotExists_shouldThrow() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(PaymentNotFoundException.class, () -> service.getPayment(999L));

        verify(repository).findById(999L);
    }

    @Test
    void processPayment_whenPending_shouldProcess() {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setUserId("user1");
        payment.setAmount(new BigDecimal("100.00"));
        payment.setCurrency("USD");
        payment.setStatus(PaymentStatus.PENDING);

        when(repository.findById(1L)).thenReturn(Optional.of(payment));
        when(repository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        PaymentResponse response = service.processPayment(1L);

        assertEquals("PROCESSING", response.status());
        assertNotNull(response.processedAt());

        verify(repository).findById(1L);
        verify(repository).save(payment);
    }

    @Test
    void processPayment_whenNotPending_shouldThrow() {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setStatus(PaymentStatus.COMPLETED);

        when(repository.findById(1L)).thenReturn(Optional.of(payment));

        assertThrows(IllegalStateException.class, () -> service.processPayment(1L));

        verify(repository).findById(1L);
        verify(repository, never()).save(any());
    }

    @Test
    void refundPayment_whenCompleted_shouldRefund() {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setUserId("user1");
        payment.setAmount(new BigDecimal("100.00"));
        payment.setCurrency("USD");
        payment.setStatus(PaymentStatus.COMPLETED);

        when(repository.findById(1L)).thenReturn(Optional.of(payment));
        when(repository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        PaymentResponse response = service.refundPayment(1L);

        assertEquals("REFUNDED", response.status());

        verify(repository).findById(1L);
        verify(repository).save(payment);
    }

    @Test
    void refundPayment_whenAlreadyRefunded_shouldBeIdempotent() {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setStatus(PaymentStatus.REFUNDED);

        when(repository.findById(1L)).thenReturn(Optional.of(payment));

        PaymentResponse response = service.refundPayment(1L);

        assertEquals("REFUNDED", response.status());

        verify(repository).findById(1L);
        verify(repository, never()).save(any());
    }

    @Test
    void refundPayment_whenNotCompleted_shouldThrow() {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setStatus(PaymentStatus.PENDING);

        when(repository.findById(1L)).thenReturn(Optional.of(payment));

        assertThrows(IllegalStateException.class, () -> service.refundPayment(1L));

        verify(repository).findById(1L);
        verify(repository, never()).save(any());
    }
}
