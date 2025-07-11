-- Insert sample data for testing

USE poultry_farm_db;

-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role, first_name, last_name, phone) VALUES
('admin', 'admin@poultrymanager.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'admin', 'System', 'Administrator', '+1234567890');

-- Insert sample farmer (password: farmer123)
INSERT INTO users (username, email, password_hash, role, first_name, last_name, phone) VALUES
('farmer1', 'farmer@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'farmer', 'John', 'Smith', '+1234567891');

-- Insert sample farm
INSERT INTO farms (name, location, owner_id, established_date, total_capacity) VALUES
('Green Valley Poultry Farm', '123 Farm Road, Rural County', 2, '2020-01-15', 5000);

-- Insert sample poultry inventory
INSERT INTO poultry_inventory (farm_id, bird_type, breed, current_count, age_weeks, purchase_date, purchase_price) VALUES
(1, 'Chicken', 'Rhode Island Red', 500, 12, '2024-01-15', 2500.00),
(1, 'Chicken', 'Leghorn', 300, 8, '2024-02-01', 1800.00);

-- Insert sample feed inventory
INSERT INTO feed_inventory (farm_id, feed_type, quantity_kg, unit_price, supplier, purchase_date, expiry_date) VALUES
(1, 'Layer Feed', 1000.00, 0.50, 'Farm Supply Co', '2024-01-01', '2024-06-01'),
(1, 'Starter Feed', 500.00, 0.60, 'Farm Supply Co', '2024-01-01', '2024-06-01');

-- Insert sample employees
INSERT INTO employees (farm_id, employee_name, position, phone, hire_date, salary, payment_frequency) VALUES
(1, 'Mike Johnson', 'Farm Worker', '+1234567892', '2024-01-01', 2000.00, 'monthly'),
(1, 'Sarah Wilson', 'Veterinary Assistant', '+1234567893', '2024-01-15', 2500.00, 'monthly');

-- Insert sample clients
INSERT INTO clients (farm_id, client_name, contact_person, phone, email, client_type, credit_limit) VALUES
(1, 'Local Grocery Store', 'Manager', '+1234567894', 'manager@grocery.com', 'business', 5000.00),
(1, 'Restaurant Chain', 'Purchasing Manager', '+1234567895', 'purchasing@restaurant.com', 'business', 10000.00);
