package com.taxi.company.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "driver_license")
public class DriverLicense {
    @Id
    @Column(name = "driver_id")
    private Integer driverId;

    @JsonBackReference
    @OneToOne
    @MapsId
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Column(name = "license_expiry", nullable = false)
    private LocalDate licenseExpiry;

    @Column(name = "license_class", nullable = false, length = 10)
    private String licenseClass;

    @Column(name = "medical_certificate_expiry", nullable = false)
    private LocalDate medicalCertificateExpiry;

    // Default constructor
    public DriverLicense() {}

    // Getters and Setters
    public Integer getDriverId() {
        return driverId;
    }

    public void setDriverId(Integer driverId) {
        this.driverId = driverId;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public LocalDate getLicenseExpiry() {
        return licenseExpiry;
    }

    public void setLicenseExpiry(LocalDate licenseExpiry) {
        this.licenseExpiry = licenseExpiry;
    }

    public String getLicenseClass() {
        return licenseClass;
    }

    public void setLicenseClass(String licenseClass) {
        this.licenseClass = licenseClass;
    }

    public LocalDate getMedicalCertificateExpiry() {
        return medicalCertificateExpiry;
    }

    public void setMedicalCertificateExpiry(LocalDate medicalCertificateExpiry) {
        this.medicalCertificateExpiry = medicalCertificateExpiry;
    }
} 