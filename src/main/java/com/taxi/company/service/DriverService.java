package com.taxi.company.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxi.company.model.Driver;
import com.taxi.company.model.DriverLicense;
import com.taxi.company.repository.DriverRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DriverService {
    
    @Autowired
    private DriverRepository driverRepository;

    public List<Driver> getAllDrivers() {
        return (List<Driver>) driverRepository.findAll();
    }

    public Optional<Driver> getDriverById(Integer id) {
        return driverRepository.findById(id);
    }

    public Driver saveDriver(Driver driver) {
        // If this is an update operation
        if (driver.getDriverId() != null) {
            Optional<Driver> existingDriverOpt = driverRepository.findById(driver.getDriverId());
            if (existingDriverOpt.isPresent()) {
                Driver existingDriver = existingDriverOpt.get();
                
                // Update driver fields
                existingDriver.setName(driver.getName());
                existingDriver.setLicenseNumber(driver.getLicenseNumber());
                existingDriver.setPhoneNumber(driver.getPhoneNumber());
                existingDriver.setRating(driver.getRating());
                existingDriver.setHireDate(driver.getHireDate());

                // Handle license update
                if (driver.getDriverLicense() != null) {
                    DriverLicense newLicense = driver.getDriverLicense();
                    if (existingDriver.getDriverLicense() != null) {
                        // Update existing license
                        DriverLicense existingLicense = existingDriver.getDriverLicense();
                        existingLicense.setLicenseExpiry(newLicense.getLicenseExpiry());
                        existingLicense.setLicenseClass(newLicense.getLicenseClass());
                        existingLicense.setMedicalCertificateExpiry(newLicense.getMedicalCertificateExpiry());
                    } else {
                        // Create new license
                        newLicense.setDriver(existingDriver);
                        existingDriver.setDriverLicense(newLicense);
                    }
                }
                return driverRepository.save(existingDriver);
            }
        }
        
        // For new driver creation
        if (driver.getDriverLicense() != null) {
            driver.getDriverLicense().setDriver(driver);
        }
        return driverRepository.save(driver);
    }

    public void deleteDriver(Integer id) {
        driverRepository.deleteById(id);
    }

    public boolean existsById(Integer id) {
        return driverRepository.existsById(id);
    }
}