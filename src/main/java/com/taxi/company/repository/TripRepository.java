package com.taxi.company.repository;

import com.taxi.company.model.Trip;


import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface TripRepository extends CrudRepository<Trip, Integer> {
    Trip findByTripId(Integer tripId);
    List<Trip> findByDriver_DriverId(Integer driverId);
    List<Trip> findByCustomer_CustomerId(Integer customerId);
}