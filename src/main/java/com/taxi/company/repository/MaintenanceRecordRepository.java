package com.taxi.company.repository;

import com.taxi.company.model.MaintenanceRecord;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface MaintenanceRecordRepository extends CrudRepository<MaintenanceRecord, Integer> {
    MaintenanceRecord findByRecordId(Integer recordId);
    List<MaintenanceRecord> findByVehicleVehicleId(Integer vehicleId);
    MaintenanceRecord findByServiceDate(LocalDate serviceDate);
    MaintenanceRecord findByNextServiceDate(LocalDate nextServiceDate);
}
