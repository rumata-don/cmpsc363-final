package com.taxi.company.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxi.company.model.DriverLicense;
import com.taxi.company.repository.DriverLicenseRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DriverLicenseService {
    
    @Autowired
    private DriverLicenseRepository driverLicenseRepository;

    public List<DriverLicense> getAllDriverLicenses() {
        return (List<DriverLicense>) driverLicenseRepository.findAll();
    }

    public Optional<DriverLicense> getDriverLicenseById(Integer id) {
        return driverLicenseRepository.findById(id);
    }

    public DriverLicense saveDriverLicense(DriverLicense driverLicense) {
        return driverLicenseRepository.save(driverLicense);
    }

    public void deleteDriverLicense(Integer id) {
        driverLicenseRepository.deleteById(id);
    }

    public boolean existsById(Integer id) {
        return driverLicenseRepository.existsById(id);
    }

    public DriverLicense findByDriverId(Integer driverId) {
        return driverLicenseRepository.findByDriverId(driverId);
    }
}