package com.taxi.company.controller;

import com.taxi.company.model.Payment;
import com.taxi.company.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Integer id, @PathVariable Integer tripId) {
        return paymentService.getPayment(id, tripId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.savePayment(payment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Integer id, @PathVariable Integer tripId, @RequestBody Payment payment) {
        if (!paymentService.existsById(id, tripId)) {
            return ResponseEntity.notFound().build();
        }
        payment.setPaymentId(id);
        payment.setTripId(tripId);
        return ResponseEntity.ok(paymentService.savePayment(payment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Integer id, @PathVariable Integer tripId) {
        if (!paymentService.existsById(id, tripId)) {
            return ResponseEntity.notFound().build();
        }
        paymentService.deletePayment(id, tripId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/customer/{customerId}")
    public List<Payment> getPaymentsByCustomer(@PathVariable Integer customerId) {
        return paymentService.findByCustomerId(customerId);
    }
} 