package com.taxi.company.model;

import java.io.Serializable;
import java.util.Objects;

public class PaymentId implements Serializable {
    private Integer paymentId;
    private Integer tripId;

    // Default constructor
    public PaymentId() {}

    public PaymentId(Integer paymentId, Integer tripId) {
        this.paymentId = paymentId;
        this.tripId = tripId;
    }

    // Getters and Setters
    public Integer getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Integer paymentId) {
        this.paymentId = paymentId;
    }

    public Integer getTripId() {
        return tripId;
    }

    public void setTripId(Integer tripId) {
        this.tripId = tripId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PaymentId paymentId1 = (PaymentId) o;
        return Objects.equals(paymentId, paymentId1.paymentId) &&
               Objects.equals(tripId, paymentId1.tripId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(paymentId, tripId);
    }
} 