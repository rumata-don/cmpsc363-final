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

    @GetMapping("/{paymentId}/{tripId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Integer paymentId, @PathVariable Integer tripId) {
        return paymentService.getPayment(paymentId, tripId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<Payment> getPaymentByTripId(@PathVariable Integer tripId) {
        Payment payment = paymentService.findByTripId(tripId);
        if (payment != null) {
            return ResponseEntity.ok(payment);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        try {
            // For new payments, we only need to set the basic fields
            Payment newPayment = new Payment();
            newPayment.setPaymentId(payment.getPaymentId());
            newPayment.setTripId(payment.getTripId());
            newPayment.setAmount(payment.getAmount());
            newPayment.setPaymentMethod(payment.getPaymentMethod());
            newPayment.setPaymentDate(payment.getPaymentDate());

            Payment savedPayment = paymentService.savePayment(newPayment);
            return ResponseEntity.ok(savedPayment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{paymentId}/{tripId}")
    public ResponseEntity<Payment> updatePayment(
            @PathVariable Integer paymentId,
            @PathVariable Integer tripId,
            @RequestBody Payment payment) {
        try {
            // Get existing payment
            Payment existingPayment = paymentService.getPayment(paymentId, tripId)
                .orElse(null);
            
            if (existingPayment == null) {
                return ResponseEntity.notFound().build();
            }

            // Update only the modifiable fields
            existingPayment.setAmount(payment.getAmount());
            existingPayment.setPaymentMethod(payment.getPaymentMethod());
            existingPayment.setPaymentDate(payment.getPaymentDate());

            Payment updatedPayment = paymentService.savePayment(existingPayment);
            return ResponseEntity.ok(updatedPayment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{paymentId}/{tripId}")
    public ResponseEntity<Void> deletePayment(@PathVariable Integer paymentId, @PathVariable Integer tripId) {
        if (!paymentService.existsById(paymentId, tripId)) {
            return ResponseEntity.notFound().build();
        }
        paymentService.deletePayment(paymentId, tripId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/customer/{customerId}")
    public List<Payment> getPaymentsByCustomer(@PathVariable Integer customerId) {
        return paymentService.findByCustomerId(customerId);
    }
} 