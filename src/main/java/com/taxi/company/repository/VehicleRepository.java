package com.taxi.company.repository;

import com.taxi.company.model.Vehicle;
import org.springframework.data.repository.CrudRepository;

public interface VehicleRepository extends CrudRepository<Vehicle, Integer> {
    Vehicle findByVehicleId(Integer vehicleId);
    Vehicle findByPlateNumber(String plateNumber);
}
