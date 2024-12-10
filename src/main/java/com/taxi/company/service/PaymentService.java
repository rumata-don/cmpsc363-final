package com.taxi.company.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxi.company.model.Payment;
import com.taxi.company.model.PaymentId;
import com.taxi.company.repository.PaymentRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return (List<Payment>) paymentRepository.findAll();
    }

    public Optional<Payment> getPayment(Integer paymentId, Integer tripId) {
        PaymentId id = new PaymentId(paymentId, tripId);
        return paymentRepository.findById(id);
    }

    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public void deletePayment(Integer paymentId, Integer tripId) {
        PaymentId id = new PaymentId(paymentId, tripId);
        paymentRepository.deleteById(id);
    }

    public boolean existsById(Integer paymentId, Integer tripId) {
        PaymentId id = new PaymentId(paymentId, tripId);
        return paymentRepository.existsById(id);
    }

    public Payment findPaymentByTripId(Integer tripId) {
        return paymentRepository.findByTripId(tripId);
    }

    public Payment findByTripId(Integer tripId) {
        return paymentRepository.findByTripId(tripId);
    }

    public List<Payment> findByCustomerId(Integer customerId) {
        return paymentRepository.findByTrip_Customer_CustomerId(customerId);
    }
}