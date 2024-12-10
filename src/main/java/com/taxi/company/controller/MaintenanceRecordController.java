package com.taxi.company.controller;

import com.taxi.company.model.MaintenanceRecord;
import com.taxi.company.service.MaintenanceRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-records")
public class MaintenanceRecordController {

    private final MaintenanceRecordService maintenanceRecordService;

    public MaintenanceRecordController(MaintenanceRecordService maintenanceRecordService) {
        this.maintenanceRecordService = maintenanceRecordService;
    }

    @GetMapping
    public Iterable<MaintenanceRecord> getAllMaintenanceRecords() {
        return maintenanceRecordService.getAllMaintenanceRecords();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRecord> getMaintenanceRecordById(@PathVariable Integer id) {
        return maintenanceRecordService.getMaintenanceRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MaintenanceRecord createMaintenanceRecord(@RequestBody MaintenanceRecord maintenanceRecord) {
        return maintenanceRecordService.saveMaintenanceRecord(maintenanceRecord);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceRecord> updateMaintenanceRecord(
            @PathVariable Integer id,
            @RequestBody MaintenanceRecord maintenanceRecord) {
        if (!maintenanceRecordService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        maintenanceRecord.setRecordId(id);
        return ResponseEntity.ok(maintenanceRecordService.saveMaintenanceRecord(maintenanceRecord));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenanceRecord(@PathVariable Integer id) {
        if (!maintenanceRecordService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        maintenanceRecordService.deleteMaintenanceRecord(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<MaintenanceRecord>> getMaintenanceRecordsByVehicleId(@PathVariable Integer vehicleId) {
        List<MaintenanceRecord> records = maintenanceRecordService.findMaintenanceRecordsByVehicleId(vehicleId);
        return !records.isEmpty() ? ResponseEntity.ok(records) : ResponseEntity.notFound().build();
    }
} 