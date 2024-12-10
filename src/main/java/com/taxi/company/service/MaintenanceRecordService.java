package com.taxi.company.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxi.company.model.MaintenanceRecord;
import com.taxi.company.repository.MaintenanceRecordRepository;

import java.util.Optional;
import java.util.List;

@Service
@Transactional
public class MaintenanceRecordService {
    
    @Autowired
    private MaintenanceRecordRepository maintenanceRecordRepository;

    public Iterable<MaintenanceRecord> getAllMaintenanceRecords() {
        return maintenanceRecordRepository.findAll();
    }

    public Optional<MaintenanceRecord> getMaintenanceRecordById(Integer id) {
        return maintenanceRecordRepository.findById(id);
    }

    public MaintenanceRecord saveMaintenanceRecord(MaintenanceRecord maintenanceRecord) {
        return maintenanceRecordRepository.save(maintenanceRecord);
    }

    public void deleteMaintenanceRecord(Integer id) {
        maintenanceRecordRepository.deleteById(id);
    }

    public boolean existsById(Integer id) {
        return maintenanceRecordRepository.existsById(id);
    }

    public List<MaintenanceRecord> findMaintenanceRecordsByVehicleId(Integer vehicleId) {
        return maintenanceRecordRepository.findByVehicleVehicleId(vehicleId);
    }
}