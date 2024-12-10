package com.taxi.company.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxi.company.model.Trip;

import com.taxi.company.repository.TripRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TripService {
    
    @Autowired
    private TripRepository tripRepository;

    public List<Trip> getAllTrips() {
        return (List<Trip>) tripRepository.findAll();
    }

    public Optional<Trip> getTripById(Integer id) {
        return tripRepository.findById(id);
    }

    public Trip saveTrip(Trip trip) {
        return tripRepository.save(trip);
    }

    public void deleteTrip(Integer id) {
        tripRepository.deleteById(id);
    }

    public boolean existsById(Integer id) {
        return tripRepository.existsById(id);
    }

    public List<Trip> findTripsByCustomer(Integer customerId) {
        return tripRepository.findByCustomer_CustomerId(customerId);
    }

    public List<Trip> findTripsByDriver(Integer driverId) {
        return tripRepository.findByDriver_DriverId(driverId);
    }
}