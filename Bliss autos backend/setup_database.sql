-- ============================================
-- Bliss Autos - Full Database Setup Script
-- ============================================

-- Create the database
CREATE DATABASE IF NOT EXISTS bliss_autos;
USE bliss_autos;

-- ============================================
-- 1. Car table
-- ============================================
CREATE TABLE IF NOT EXISTS car (
    id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    price VARCHAR(50) NOT NULL,
    image VARCHAR(255)
);

-- Seed car data
INSERT INTO car (make, model, year, price, image) VALUES
('Honda', 'Civic', 2019, 'Ksh 2,340,000', 'images/Honda Civic.jpg'),
('Chevrolet', 'Camaro', 2020, 'Ksh 3,640,000', 'images/Chevrolet Camaro.jpg'),
('BMW', '3 Series', 2018, 'Ksh 3,250,000', 'images/BMW 3 Series.jpg'),
('Toyota', 'Corolla', 2020, 'Ksh 2,600,000', 'images/Toyota Corolla.jpg'),
('Audi', 'A4', 2019, 'Ksh 3,510,000', 'images/Audi A4.jpg'),
('Mercedes-Benz', 'C-Class', 2020, 'Ksh 4,550,000', 'images/Mercedes-Benz C-Class.jpg'),
('Hyundai', 'Elantra', 2021, 'Ksh 2,470,000', 'images/Hyundai Elantra.jpg'),
('Nissan', 'Altima', 2020, 'Ksh 2,860,000', 'images/Nissan Altima.jpg'),
('Subaru', 'Outback', 2019, 'Ksh 3,120,000', 'images/Subaru Outback.jpg'),
('Volkswagen', 'Passat', 2020, 'Ksh 3,380,000', 'images/Volkswagen Passat.jpg'),
('Ford', 'Mustang', 2021, 'Ksh 3,900,000', 'images/Ford Mustang.jpg'),
('Kia', 'Optima', 2021, 'Ksh 2,730,000', 'images/Kia Optima.jpg'),
('Honda', 'Accord', 2018, 'Ksh 2,665,000', 'images/Honda Accord.jpg'),
('Ford', 'Fusion', 2019, 'Ksh 2,990,000', 'images/Ford Fusion.jpg'),
('Chevrolet', 'Malibu', 2020, 'Ksh 2,925,000', 'images/Chevrolet Malibu.jpg'),
('Toyota', 'Camry', 2021, 'Ksh 3,185,000', 'images/Toyota Camry.jpg'),
('Hyundai', 'Sonata', 2020, 'Ksh 3,055,000', 'images/Hyundai Sonata.jpg'),
('Nissan', 'Maxima', 2019, 'Ksh 3,705,000', 'images/Nissan Maxima.jpg');

-- ============================================
-- 2. Customer table
--    (Matches backend register endpoint: name, email, password)
-- ============================================
CREATE TABLE IF NOT EXISTS customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- ============================================
-- 3. Orders table
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT,
    customer_id INT,
    order_date DATE,
    order_status VARCHAR(50),
    FOREIGN KEY (car_id) REFERENCES car(id),
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);

-- ============================================
-- 4. Financing table
-- ============================================
CREATE TABLE IF NOT EXISTS financing (
    financing_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    financing_type VARCHAR(100),
    financing_terms VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- ============================================
-- 5. Inventory Manager table
-- ============================================
CREATE TABLE IF NOT EXISTS inventorymanager (
    manager_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

-- ============================================
-- 6. Inquiries table (auto-created by backend.js, but included for completeness)
-- ============================================
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. Chat Sessions table (auto-created by backend.js, but included for completeness)
-- ============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    chat_history JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Seed inventory managers
-- ============================================
INSERT INTO inventorymanager (manager_id, name, email) VALUES
(1011, 'Floyd James', 'floyd22@gmail.com'),
(1012, 'Essy Jerome', 'jessy@gmail.com');

SELECT 'Database setup complete!' AS status;
