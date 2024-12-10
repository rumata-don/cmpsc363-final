package com.taxi.company.repository;

import com.taxi.company.model.Payment;
import com.taxi.company.model.PaymentId;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface PaymentRepository extends CrudRepository<Payment, PaymentId> {
    Payment findByPaymentId(Integer paymentId);
    Payment findByTripId(Integer tripId);
    List<Payment> findByTrip_Customer_CustomerId(Integer customerId);
}