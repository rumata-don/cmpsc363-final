package com.taxi.company.repository;

import com.taxi.company.model.Customer;
import org.springframework.data.repository.CrudRepository;
import java.util.List;
public interface CustomerRepository extends CrudRepository<Customer, Integer> {
    Customer findByName(String name);
    Customer findByPhoneNumber(String phoneNumber);
    Customer findByEmail(String email);
    <T extends Customer> List<T> findByClass(Class<T> type);
}
