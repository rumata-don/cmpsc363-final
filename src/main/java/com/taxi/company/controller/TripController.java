package com.taxi.company.controller;

import com.taxi.company.model.Trip;
import com.taxi.company.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Integer id) {
        return tripService.getTripById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Trip createTrip(@RequestBody Trip trip) {
        return tripService.saveTrip(trip);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Integer id, @RequestBody Trip trip) {
        if (!tripService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        trip.setTripId(id);
        return ResponseEntity.ok(tripService.saveTrip(trip));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Integer id) {
        if (!tripService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tripService.deleteTrip(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/driver/{driverId}")
    public List<Trip> getTripsByDriver(@PathVariable Integer driverId) {
        return tripService.findTripsByDriver(driverId);
    }

    @GetMapping("/customer/{customerId}")
    public List<Trip> getTripsByCustomer(@PathVariable Integer customerId) {
        return tripService.findTripsByCustomer(customerId);
    }
} 