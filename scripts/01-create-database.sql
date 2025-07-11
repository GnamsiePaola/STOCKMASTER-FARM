-- Create database and tables for Poultry Farm Management System

CREATE DATABASE IF NOT EXISTS poultry_farm_db;
USE poultry_farm_db;

-- Users table for authentication and role management
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'farmer', 'veterinarian', 'staff') NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Farms table
CREATE TABLE farms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    owner_id INT,
    established_date DATE,
    total_capacity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Birds/Poultry inventory
CREATE TABLE poultry_inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    farm_id INT NOT NULL,
    bird_type VARCHAR(50) NOT NULL,
    breed VARCHAR(50),
    current_count INT NOT NULL DEFAULT 0,
    age_weeks INT,
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    mortality_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id)
);

-- Feed management
CREATE TABLE feed_inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    farm_id INT NOT NULL,
    feed_type VARCHAR(100) NOT NULL,
    quantity_kg DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2),
    supplier VARCHAR(100),
    purchase_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id)
);

-- Daily feed consumption
CREATE TABLE feed_consumption (
    id INT PRIMARY KEY AUTO_INCREMENT,
    farm_id INT NOT NULL,
    feed_id INT NOT NULL,
    consumption_date DATE NOT NULL,
    quantity_used DECIMAL(10,2) NOT NULL,
    recorded_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id),
    FOREIGN KEY (feed_id) REFERENCES feed_inventory(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Health records
CREATE TABLE health_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    farm_id INT NOT NULL,
    poultry_batch_id INT,
    treatment_type ENUM('vaccination', 'medication', 'checkup', 'treatment') NOT NULL,
    treatment_name VARCHAR(100) NOT NULL,
    treatment_date DATE NOT NULL,
    next_due_date DATE,
    administered_by INT,
    notes TEXT,
    cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id),
    FOREIGN KEY (poultry_batch_id) REFERENCES poultry_inventory(id),
    FOREIGN KEY (administered_by) REFERENCES users(id)
);

-- Egg production tracking
CREATE TABLE egg_production (
    id INT PRIMARY KEY AUTO_INCREMENT,
    farm_id INT NOT NULL,
    production_date DATE NOT NULL,
    eggs_collected INT NOT NULL DEFAULT 0,
    broken_eggs INT DEFAULT 0,
    recorded_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Sales records
CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    farm_id INT NOT NULL,
    sale_date DATE NOT NULL,
    product_type ENUM('eggs', 'birds', 'meat', 'other') NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    customer_name VARCHAR(100),
    customer_contact VARCHAR(50),
    payment_status ENUM('paid', 'pending', 'partial') DEFAULT 'pending',
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Expenses tracking
CREATE TABLE expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    farm_id INT NOT NULL,
    expense_date DATE NOT NULL,
    category ENUM('feed', 'medication', 'equipment', 'utilities', 'labor', 'other') NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    supplier VARCHAR(100),
    recorded_by INT,
    receipt_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Employee management
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    farm_id INT NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    position VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2),
    payment_frequency ENUM('daily', 'weekly', 'monthly') DEFAULT 'monthly',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id)
);

-- Employee payments
CREATE TABLE employee_payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_period_start DATE,
    payment_period_end DATE,
    payment_method ENUM('cash', 'bank_transfer', 'check') DEFAULT 'cash',
    notes TEXT,
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Clients/Customers
CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    farm_id INT NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    client_type ENUM('individual', 'business', 'retailer', 'wholesaler') DEFAULT 'individual',
    credit_limit DECIMAL(10,2) DEFAULT 0,
    outstanding_balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id)
);

-- Reminders and notifications
CREATE TABLE reminders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    farm_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reminder_date DATE NOT NULL,
    reminder_type ENUM('vaccination', 'feeding', 'health_check', 'payment', 'general') NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
