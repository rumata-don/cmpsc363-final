package com.taxi.company.repository;

import com.taxi.company.model.Zone;
import org.springframework.data.repository.CrudRepository;

public interface ZoneRepository extends CrudRepository<Zone, Integer> {
    Zone findByZoneId(Integer zoneId);
    Zone findByName(String name);
    Zone findByCity(String city);
}