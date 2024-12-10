package com.taxi.company.repository;

import com.taxi.company.model.DriverLicense;
import org.springframework.data.repository.CrudRepository;
import java.time.LocalDate;

public interface DriverLicenseRepository extends CrudRepository<DriverLicense, Integer> {
    DriverLicense findByDriverId(Integer driverId);
    DriverLicense findByLicenseExpiry(LocalDate licenseExpiry);
    DriverLicense findByLicenseClass(String licenseClass);
    DriverLicense findByMedicalCertificateExpiry(LocalDate medicalCertificateExpiry);
}
