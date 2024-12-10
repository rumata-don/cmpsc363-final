package com.taxi.company.controller;

import com.taxi.company.model.Customer;
import com.taxi.company.model.RegularCustomer;
import com.taxi.company.model.CorporateCustomer;
import com.taxi.company.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Integer id) {
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Customer> searchCustomers(@RequestParam String query) {
        return customerService.searchCustomers(query);
    }

    @PostMapping("/regular")
    public RegularCustomer createRegularCustomer(@RequestBody RegularCustomer customer) {
        customer.setRegistrationDate(LocalDate.now());
        return (RegularCustomer) customerService.saveCustomer(customer);
    }

    @PostMapping("/corporate")
    public CorporateCustomer createCorporateCustomer(@RequestBody CorporateCustomer customer) {
        customer.setRegistrationDate(LocalDate.now());
        return (CorporateCustomer) customerService.saveCustomer(customer);
    }

    @PutMapping("/regular/{id}")
    public ResponseEntity<Customer> updateRegularCustomer(@PathVariable Integer id, @RequestBody RegularCustomer customerData) {
        Optional<Customer> existingCustomerOpt = customerService.getCustomerById(id);
        if (existingCustomerOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Customer existingCustomer = existingCustomerOpt.get();
        if (!(existingCustomer instanceof RegularCustomer)) {
            return ResponseEntity.badRequest().build();
        }

        RegularCustomer existing = (RegularCustomer) existingCustomer;
        existing.setName(customerData.getName());
        existing.setPhoneNumber(customerData.getPhoneNumber());
        existing.setEmail(customerData.getEmail());
        existing.setMembershipLevel(customerData.getMembershipLevel());
        existing.setLoyaltyPoints(customerData.getLoyaltyPoints());

        return ResponseEntity.ok(customerService.saveCustomer(existing));
    }

    @PutMapping("/corporate/{id}")
    public ResponseEntity<Customer> updateCorporateCustomer(@PathVariable Integer id, @RequestBody CorporateCustomer customerData) {
        Optional<Customer> existingCustomerOpt = customerService.getCustomerById(id);
        if (existingCustomerOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Customer existingCustomer = existingCustomerOpt.get();
        if (!(existingCustomer instanceof CorporateCustomer)) {
            return ResponseEntity.badRequest().build();
        }

        CorporateCustomer existing = (CorporateCustomer) existingCustomer;
        existing.setName(customerData.getName());
        existing.setPhoneNumber(customerData.getPhoneNumber());
        existing.setEmail(customerData.getEmail());
        existing.setCompanyName(customerData.getCompanyName());
        existing.setBillingAddress(customerData.getBillingAddress());
        existing.setCreditLimit(customerData.getCreditLimit());

        return ResponseEntity.ok(customerService.saveCustomer(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        if (!customerService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/regular")
    public List<RegularCustomer> getAllRegularCustomers() {
        return customerService.findAllRegularCustomers();
    }

    @GetMapping("/corporate")
    public List<CorporateCustomer> getAllCorporateCustomers() {
        return customerService.findAllCorporateCustomers();
    }
} 