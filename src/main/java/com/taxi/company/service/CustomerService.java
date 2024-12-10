package com.taxi.company.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxi.company.model.Customer;
import com.taxi.company.model.RegularCustomer;
import com.taxi.company.model.CorporateCustomer;
import com.taxi.company.repository.CustomerRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Transactional
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return StreamSupport.stream(customerRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    public Optional<Customer> getCustomerById(Integer id) {
        return customerRepository.findById(id);
    }

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Integer id) {
        customerRepository.deleteById(id);
    }

    public boolean existsById(Integer id) {
        return customerRepository.existsById(id);
    }

    public List<RegularCustomer> findAllRegularCustomers() {
        return customerRepository.findByClass(RegularCustomer.class);
    }

    public List<CorporateCustomer> findAllCorporateCustomers() {
        return customerRepository.findByClass(CorporateCustomer.class);
    }

    public List<Customer> searchCustomers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllCustomers();
        }

        String searchTerm = query.toLowerCase().trim();
        
        // If the search term is numeric, try to find by ID first
        try {
            Integer id = Integer.parseInt(searchTerm);
            Optional<Customer> customerById = getCustomerById(id);
            if (customerById.isPresent()) {
                return List.of(customerById.get());
            }
            // If ID doesn't exist, return empty list
            if (searchTerm.matches("\\d+")) {
                return List.of();
            }
        } catch (NumberFormatException ignored) {
            // Not a number, continue with text search
        }

        // Text-based search
        return StreamSupport.stream(customerRepository.findAll().spliterator(), false)
                .filter(customer -> 
                    customer.getName().toLowerCase().contains(searchTerm) ||
                    customer.getEmail().toLowerCase().contains(searchTerm) ||
                    customer.getPhoneNumber().contains(searchTerm))
                .collect(Collectors.toList());
    }
}