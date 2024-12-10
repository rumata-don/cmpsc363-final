package com.taxi.company.repository;

import org.springframework.data.repository.CrudRepository;
import com.taxi.company.model.Driver;

public interface DriverRepository extends CrudRepository<Driver, Integer>{
    Driver findByName(String name);
    
}
