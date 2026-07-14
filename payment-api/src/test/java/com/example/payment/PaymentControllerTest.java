package com.example.payment;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createPayment_shouldReturn201() throws Exception {
        var request = new PaymentRequest("user1", new BigDecimal("100.00"), "USD");

        mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.userId").value("user1"))
            .andExpect(jsonPath("$.amount").value(100.00))
            .andExpect(jsonPath("$.currency").value("USD"))
            .andExpect(jsonPath("$.status").value("PENDING"))
            .andExpect(jsonPath("$.createdAt").isNotEmpty());
    }

    @Test
    void createPayment_withInvalidBody_shouldReturn400() throws Exception {
        var request = new PaymentRequest("", new BigDecimal("-1"), "US");

        mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void getPayment_shouldReturn200() throws Exception {
        var createRequest = new PaymentRequest("user2", new BigDecimal("50.00"), "EUR");
        String createResponse = mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

        PaymentResponse created = objectMapper.readValue(createResponse, PaymentResponse.class);

        mockMvc.perform(get("/api/v1/payments/{id}", created.id()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(created.id()))
            .andExpect(jsonPath("$.userId").value("user2"))
            .andExpect(jsonPath("$.amount").value(50.00));
    }

    @Test
    void getPayment_notFound_shouldReturn404() throws Exception {
        mockMvc.perform(get("/api/v1/payments/{id}", 99999L))
            .andExpect(status().isNotFound());
    }

    @Test
    void processPayment_shouldReturn200() throws Exception {
        var createRequest = new PaymentRequest("user3", new BigDecimal("200.00"), "GBP");
        String createResponse = mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

        PaymentResponse created = objectMapper.readValue(createResponse, PaymentResponse.class);

        mockMvc.perform(post("/api/v1/payments/{id}/process", created.id()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("PROCESSING"))
            .andExpect(jsonPath("$.processedAt").isNotEmpty());
    }

    @Test
    void processPayment_alreadyProcessed_shouldReturn409() throws Exception {
        var createRequest = new PaymentRequest("user4", new BigDecimal("300.00"), "USD");
        String createResponse = mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

        PaymentResponse created = objectMapper.readValue(createResponse, PaymentResponse.class);

        mockMvc.perform(post("/api/v1/payments/{id}/process", created.id()))
            .andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/payments/{id}/process", created.id()))
            .andExpect(status().isConflict());
    }

    @Test
    void processPayment_notFound_shouldReturn404() throws Exception {
        mockMvc.perform(post("/api/v1/payments/{id}/process", 99999L))
            .andExpect(status().isNotFound());
    }

    @Test
    void refundPayment_shouldReturn200() throws Exception {
        var createRequest = new PaymentRequest("user5", new BigDecimal("150.00"), "USD");
        String createResponse = mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();

        PaymentResponse created = objectMapper.readValue(createResponse, PaymentResponse.class);

        mockMvc.perform(post("/api/v1/payments/{id}/process", created.id()))
            .andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/payments/{id}/process", created.id()))
            .andExpect(status().isConflict())
            .andReturn();

        mockMvc.perform(post("/api/v1/payments/{id}/refund", created.id()))
            .andExpect(status().isConflict());
    }

    @Test
    void refundPayment_notFound_shouldReturn404() throws Exception {
        mockMvc.perform(post("/api/v1/payments/{id}/refund", 99999L))
            .andExpect(status().isNotFound());
    }
}
