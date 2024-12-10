# Schema

-- Strong Entity Sets
Driver (
    driver_id PRIMARY KEY,
    name,
    license_number UNIQUE,
    phone_number,
    hire_date,
    rating
)

Vehicle (
    vehicle_id PRIMARY KEY,
    plate_number UNIQUE,
    model,
    year,
    status
)

Customer (
    customer_id PRIMARY KEY,
    name,
    phone_number,
    email,
    registration_date
)

Zone (
    zone_id PRIMARY KEY,
    name,
    city,
    base_fare
)

-- Weak Entity Set (depends on Trip)
Payment (
    payment_id,
    trip_id FOREIGN KEY REFERENCES Trip,
    amount,
    payment_method,
    payment_date,
    PRIMARY KEY (payment_id, trip_id)
)

-- Many-to-Many Relationship
Trip (
    trip_id PRIMARY KEY,
    driver_id FOREIGN KEY REFERENCES Driver,
    vehicle_id FOREIGN KEY REFERENCES Vehicle,
    customer_id FOREIGN KEY REFERENCES Customer,
    pickup_zone_id FOREIGN KEY REFERENCES Zone,
    dropoff_zone_id FOREIGN KEY REFERENCES Zone,
    start_time,
    end_time,
    distance,
    status
)

-- One-to-One Relationship
DriverLicense (
    driver_id PRIMARY KEY FOREIGN KEY REFERENCES Driver,
    license_expiry,
    license_class,
    medical_certificate_expiry
)

-- ISA Relationship (Specialization)
RegularCustomer (
    customer_id PRIMARY KEY FOREIGN KEY REFERENCES Customer,
    loyalty_points,
    membership_level
)

CorporateCustomer (
    customer_id PRIMARY KEY FOREIGN KEY REFERENCES Customer,
    company_name,
    billing_address,
    credit_limit
)

-- Many-to-One Relationship
MaintenanceRecord (
    record_id PRIMARY KEY,
    vehicle_id FOREIGN KEY REFERENCES Vehicle,
    service_date,
    description,
    cost,
    next_service_date
)
