-- Create database
CREATE DATABASE IF NOT EXISTS taxi_company;
USE taxi_company;

-- Strong Entity Sets
CREATE TABLE Driver (
    driver_id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(20) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    hire_date DATE NOT NULL,
    rating DECIMAL(3,2),
    PRIMARY KEY (driver_id)
) ENGINE=InnoDB;

CREATE TABLE Vehicle (
    vehicle_id INT AUTO_INCREMENT,
    plate_number VARCHAR(20) NOT NULL UNIQUE,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    status ENUM('ACTIVE', 'MAINTENANCE', 'RETIRED') NOT NULL,
    PRIMARY KEY (vehicle_id)
) ENGINE=InnoDB;

CREATE TABLE Customer (
    customer_id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    registration_date DATE NOT NULL,
    PRIMARY KEY (customer_id)
) ENGINE=InnoDB;

CREATE TABLE Trip (
    trip_id INT AUTO_INCREMENT,
    driver_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    customer_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    distance DECIMAL(10,2),
    status ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL,
    PRIMARY KEY (trip_id),
    FOREIGN KEY (driver_id) REFERENCES Driver(driver_id),
    FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
) ENGINE=InnoDB;

-- Weak Entity Set
CREATE TABLE Payment (
    payment_id INT,
    trip_id INT,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'DIGITAL_WALLET') NOT NULL,
    payment_date DATETIME NOT NULL,
    PRIMARY KEY (payment_id, trip_id),
    FOREIGN KEY (trip_id) REFERENCES Trip(trip_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- One-to-One Relationship
CREATE TABLE DriverLicense (
    driver_id INT,
    license_expiry DATE NOT NULL,
    license_class VARCHAR(10) NOT NULL,
    medical_certificate_expiry DATE NOT NULL,
    PRIMARY KEY (driver_id),
    FOREIGN KEY (driver_id) REFERENCES Driver(driver_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ISA Relationship Tables
CREATE TABLE RegularCustomer (
    customer_id INT,
    loyalty_points INT DEFAULT 0,
    membership_level ENUM('BRONZE', 'SILVER', 'GOLD', 'PLATINUM') DEFAULT 'BRONZE',
    PRIMARY KEY (customer_id),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE CorporateCustomer (
    customer_id INT,
    company_name VARCHAR(100) NOT NULL,
    billing_address TEXT NOT NULL,
    credit_limit DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (customer_id),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Many-to-One Relationship
CREATE TABLE MaintenanceRecord (
    record_id INT AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    service_date DATE NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    next_service_date DATE NOT NULL,
    PRIMARY KEY (record_id),
    FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id)
) ENGINE=InnoDB;