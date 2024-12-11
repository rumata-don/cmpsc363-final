package com.taxi.company.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.io.Serializable;

@Entity
@Table(name = "trip")
public class Trip implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trip_id")
    private Integer tripId;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "distance", precision = 10, scale = 2)
    private BigDecimal distance;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TripStatus status;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL)
    private List<Payment> payments;

    public enum TripStatus {
        SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    }

    // Default constructor
    public Trip() {}

    // Getters and Setters
    public Integer getTripId() {
        return tripId;
    }

    public void setTripId(Integer tripId) {
        this.tripId = tripId;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public BigDecimal getDistance() {
        return distance;
    }

    public void setDistance(BigDecimal distance) {
        this.distance = distance;
    }

    public TripStatus getStatus() {
        return status;
    }

    public void setStatus(TripStatus status) {
        this.status = status;
    }

    public List<Payment> getPayments() {
        return payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }
} 