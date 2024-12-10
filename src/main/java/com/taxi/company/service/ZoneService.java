package com.taxi.company.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxi.company.model.Zone;
import com.taxi.company.repository.ZoneRepository;

import java.util.Optional;

@Service
@Transactional
public class ZoneService {
    
    @Autowired
    private ZoneRepository zoneRepository;

    public Iterable<Zone> getAllZones() {
        return zoneRepository.findAll();
    }

    public Optional<Zone> getZoneById(Integer id) {
        return zoneRepository.findById(id);
    }

    public Zone saveZone(Zone zone) {
        return zoneRepository.save(zone);
    }

    public void deleteZone(Integer id) {
        zoneRepository.deleteById(id);
    }

    public boolean existsById(Integer id) {
        return zoneRepository.existsById(id);
    }
}