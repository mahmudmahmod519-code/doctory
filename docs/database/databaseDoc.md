# ONBOARDING 


# HOW WORD

1. get all changes in main repo
```bash
git pull origin main
```

2. create branch

```bash
git checkout name_branch
git switch namebranch
```
3. and work on it

`note`
*name branches is*
```bash
/fix/namebranch   <- debugging 
/dev/namebranch   <- write codeing and make your task
```

# HOW RUN IT

1. run local
```bash
git clone https://github.com/mahmudmahmod519-code/doctory.git
cd doctory
npm i
npm start
```

2. run docker 
```bash

```

---

# DATABASE DOCUMENTATION

## Overview

This document describes the database schema for the Doctor Appointment System. The database uses **MySQL** and contains 7 main tables to manage users, doctors, bookings, reviews, and reports.

## Entity Relationship Diagram (ERD)

```
users (1) ───< (N) doctor_portfolios (1) ───< (N) doctor_works
  │                    │
  │                    └───< (N) bookings (1) ───< (N) booking_items
  │
  ├───< (N) reviews
  │
  └───< (N) reports
```

## Tables

### 1. users

Stores all system users (admins, doctors, patients).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each user |
| user_id | VARCHAR(36) | UNIQUE, NOT NULL | UUID for external reference (security) |
| role | VARCHAR(20) | NOT NULL | User role: `admin`, `doctor`, `patient` |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | Account status: `active`, `pending`, `suspended` |
| name | VARCHAR(100) | NOT NULL | Full name of the user |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address (used for login) |
| email_verified | BOOLEAN | DEFAULT FALSE | Whether email is verified |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| phone | VARCHAR(20) | | Phone number |
| address | TEXT | | Physical address |
| birth_date | DATE | | Date of birth (calculate age dynamically) |
| image_profile | VARCHAR(255) | | URL to profile image |
| enable_2fa | BOOLEAN | DEFAULT FALSE | Two-factor authentication enabled |
| token | VARCHAR(255) | | Session token |
| secure_key | VARCHAR(255) | | 2FA secret key |
| last_login | DATETIME | | Last login timestamp |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | DATETIME | ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_users_user_id` on `user_id`
- `idx_users_email` on `email`
- `idx_users_role` on `role`
- `idx_users_status` on `status`

---

### 2. doctor_portfolios

Stores doctor profile information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| portfolio_id | VARCHAR(36) | UNIQUE, NOT NULL | UUID for external reference |
| user_id | INT | FOREIGN KEY → users.id, NOT NULL | Reference to user account |
| doctor_name | VARCHAR(100) | NOT NULL | Doctor's full name |
| specialty | VARCHAR(100) | NOT NULL | Medical specialty (e.g., 'Orthopedic', 'Cardiology') |
| title | VARCHAR(100) | | Professional title (e.g., 'Orthopedic Surgeon') |
| background_image | VARCHAR(255) | | URL to background image |
| profile_image | VARCHAR(255) | | URL to profile image |
| phone_number | VARCHAR(20) | | Contact phone (defaults to user phone) |
| working_hours | TEXT | | Working hours schedule (text format) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | DATETIME | ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_portfolios_user_id` on `user_id`
- `idx_portfolios_portfolio_id` on `portfolio_id`
- `idx_portfolios_specialty` on `specialty`

---

### 3. doctor_works

Stores services/works offered by doctors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| work_id | VARCHAR(36) | UNIQUE, NOT NULL | UUID for external reference |
| portfolio_id | INT | FOREIGN KEY → doctor_portfolios.id, NOT NULL | Reference to doctor portfolio |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | Status: `pending`, `active`, `rejected` |
| title | VARCHAR(200) | NOT NULL | Service title |
| image | VARCHAR(255) | | URL to service image |
| price | DECIMAL(10,2) | | Service price |
| description | TEXT | | Service description |
| duration_session | INT | | Duration in minutes |
| working_time | TIME | | Time of day when service is available |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | DATETIME | ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_works_portfolio_id` on `portfolio_id`
- `idx_works_status` on `status`

---

### 4. bookings

Stores appointment sessions created by doctors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| portfolio_id | INT | FOREIGN KEY → doctor_portfolios.id, NOT NULL | Reference to doctor portfolio |
| type | VARCHAR(20) | NOT NULL | Booking type: `booking`, `consulting` |
| total_patients | INT | NOT NULL, DEFAULT 50 | Maximum number of patients |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | Status: `pending`, `active`, `expired`, `cancelled` |
| appointment_date | DATE | NOT NULL | Date of the appointment |
| appointment_time | TIME | NOT NULL | Time of the appointment |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Indexes:**
- `idx_bookings_portfolio_id` on `portfolio_id`
- `idx_bookings_status` on `status`
- `idx_bookings_date` on `appointment_date`
- `idx_bookings_portfolio_date` on `(portfolio_id, appointment_date)`

---

### 5. booking_items

Stores individual patient bookings within a booking session.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| booking_id | INT | FOREIGN KEY → bookings.id, NOT NULL | Reference to booking session |
| user_id | INT | FOREIGN KEY → users.id, NOT NULL | Reference to patient user |
| queue_number | INT | NOT NULL | Patient's position in queue |
| patient_name | VARCHAR(100) | | Patient name (snapshot at booking time) |
| patient_phone | VARCHAR(20) | | Patient phone (snapshot at booking time) |
| patient_age | INT | | Patient age (snapshot at booking time) |
| patient_address | TEXT | | Patient address (snapshot at booking time) |
| status | VARCHAR(20) | DEFAULT 'pending' | Status: `pending`, `accepted`, `rejected`, `completed` |
| qr_code | VARCHAR(255) | | QR code for check-in |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Indexes:**
- `idx_booking_items_booking_id` on `booking_id`
- `idx_booking_items_user_id` on `user_id`
- `idx_booking_items_status` on `status`

**Unique Constraint:**
- `(booking_id, user_id)` — prevents duplicate bookings

---

### 6. reviews

Stores patient reviews and ratings for doctors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| user_id | INT | FOREIGN KEY → users.id, NOT NULL | Reference to patient |
| portfolio_id | INT | FOREIGN KEY → doctor_portfolios.id, NOT NULL | Reference to doctor |
| feedback | TEXT | | Review text |
| rating | INT | CHECK (1-5) | Rating from 1 to 5 stars |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Indexes:**
- `idx_reviews_user_id` on `user_id`
- `idx_reviews_portfolio_id` on `portfolio_id`

---

### 7. reports

Stores medical reports created by doctors for patients.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| user_id | INT | FOREIGN KEY → users.id, NOT NULL | Reference to patient |
| portfolio_id | INT | FOREIGN KEY → doctor_portfolios.id, NOT NULL | Reference to doctor |
| description | TEXT | | Medical report description |
| medicines | TEXT | | JSON array of medicine IDs: `["mid1", "mid2", "mid3"]` |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Indexes:**
- `idx_reports_user_id` on `user_id`
- `idx_reports_portfolio_id` on `portfolio_id`

---

## MySQL Schema Code

```mysql
-- ============================================
-- Graduation Project - Database Schema
-- Project: Doctor Appointment System
-- Database: MySQL
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS doctory_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE doctory_db;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(36) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    birth_date DATE,
    image_profile VARCHAR(255),
    enable_2fa BOOLEAN DEFAULT FALSE,
    token VARCHAR(255),
    secure_key VARCHAR(255),
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_role CHECK (role IN ('admin', 'doctor', 'patient')),
    CONSTRAINT chk_status CHECK (status IN ('active', 'pending', 'suspended'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for users
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- ============================================
-- 2. DOCTOR PORTFOLIOS TABLE
-- ============================================
CREATE TABLE doctor_portfolios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    portfolio_id VARCHAR(36) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    doctor_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    background_image VARCHAR(255),
    profile_image VARCHAR(255),
    phone_number VARCHAR(20),
    working_hours TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for doctor_portfolios
CREATE INDEX idx_portfolios_user_id ON doctor_portfolios(user_id);
CREATE INDEX idx_portfolios_portfolio_id ON doctor_portfolios(portfolio_id);
CREATE INDEX idx_portfolios_specialty ON doctor_portfolios(specialty);

-- ============================================
-- 3. DOCTOR WORKS TABLE
-- ============================================
CREATE TABLE doctor_works (
    id INT PRIMARY KEY AUTO_INCREMENT,
    work_id VARCHAR(36) UNIQUE NOT NULL,
    portfolio_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    title VARCHAR(200) NOT NULL,
    image VARCHAR(255),
    price DECIMAL(10, 2),
    description TEXT,
    duration_session INT COMMENT 'Duration in minutes',
    working_time TIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES doctor_portfolios(id) ON DELETE CASCADE,
    CONSTRAINT chk_work_status CHECK (status IN ('pending', 'active', 'rejected'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for doctor_works
CREATE INDEX idx_works_portfolio_id ON doctor_works(portfolio_id);
CREATE INDEX idx_works_status ON doctor_works(status);

-- ============================================
-- 4. BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    portfolio_id INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    total_patients INT NOT NULL DEFAULT 50,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES doctor_portfolios(id) ON DELETE CASCADE,
    CONSTRAINT chk_booking_type CHECK (type IN ('booking', 'consulting')),
    CONSTRAINT chk_booking_status CHECK (status IN ('pending', 'active', 'expired', 'cancelled'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for bookings
CREATE INDEX idx_bookings_portfolio_id ON bookings(portfolio_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(appointment_date);
CREATE INDEX idx_bookings_portfolio_date ON bookings(portfolio_id, appointment_date);

-- ============================================
-- 5. BOOKING ITEMS TABLE
-- ============================================
CREATE TABLE booking_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    queue_number INT NOT NULL,
    patient_name VARCHAR(100),
    patient_phone VARCHAR(20),
    patient_age INT,
    patient_address TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    qr_code VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_booking_user (booking_id, user_id),
    CONSTRAINT chk_item_status CHECK (status IN ('pending', 'accepted', 'rejected', 'completed'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for booking_items
CREATE INDEX idx_booking_items_booking_id ON booking_items(booking_id);
CREATE INDEX idx_booking_items_user_id ON booking_items(user_id);
CREATE INDEX idx_booking_items_status ON booking_items(status);

-- ============================================
-- 6. REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    portfolio_id INT NOT NULL,
    feedback TEXT,
    rating INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (portfolio_id) REFERENCES doctor_portfolios(id) ON DELETE CASCADE,
    CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for reviews
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_portfolio_id ON reviews(portfolio_id);

-- ============================================
-- 7. REPORTS TABLE
-- ============================================
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    portfolio_id INT NOT NULL,
    description TEXT,
    medicines TEXT COMMENT 'JSON array format: ["mid1", "mid2", "mid3"]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (portfolio_id) REFERENCES doctor_portfolios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for reports
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_portfolio_id ON reports(portfolio_id);

-- ============================================
-- VIEWS
-- ============================================

-- View: Doctor with user details
CREATE VIEW doctor_details AS
SELECT
    dp.id,
    dp.portfolio_id,
    dp.doctor_name,
    dp.specialty,
    dp.title,
    dp.phone_number,
    dp.working_hours,
    u.email,
    u.status AS user_status
FROM doctor_portfolios dp
JOIN users u ON dp.user_id = u.id;

-- View: Booking with doctor and patient count
CREATE VIEW booking_summary AS
SELECT
    b.id,
    b.appointment_date,
    b.appointment_time,
    b.type,
    b.status,
    b.total_patients,
    dp.doctor_name,
    dp.specialty,
    COUNT(bi.id) AS booked_patients
FROM bookings b
JOIN doctor_portfolios dp ON b.portfolio_id = dp.id
LEFT JOIN booking_items bi ON b.id = bi.booking_id AND bi.status = 'accepted'
GROUP BY b.id, dp.doctor_name, dp.specialty;

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER //

-- Procedure: Calculate age from birth_date
CREATE PROCEDURE calculate_age(IN birth_date DATE, OUT age INT)
BEGIN
    SET age = TIMESTAMPDIFF(YEAR, birth_date, CURDATE());
END //

-- Procedure: Get doctor schedule
CREATE PROCEDURE get_doctor_schedule(IN p_portfolio_id INT)
BEGIN
    SELECT
        b.id,
        b.appointment_date,
        b.appointment_time,
        b.type,
        b.status,
        b.total_patients,
        COUNT(bi.id) AS booked_count
    FROM bookings b
    LEFT JOIN booking_items bi ON b.id = bi.booking_id AND bi.status = 'accepted'
    WHERE b.portfolio_id = p_portfolio_id
    GROUP BY b.id
    ORDER BY b.appointment_date, b.appointment_time;
END //

DELIMITER ;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample admin
INSERT INTO users (user_id, role, status, name, email, password_hash, email_verified)
VALUES (UUID(), 'admin', 'active', 'Admin User', 'admin@example.com', 'hashed_password', TRUE);

-- Insert sample doctor
INSERT INTO users (user_id, role, status, name, email, password_hash, email_verified, phone, birth_date)
VALUES (UUID(), 'doctor', 'active', 'Dr. Ahmed', 'ahmed@example.com', 'hashed_password', TRUE, '01001234567', '1985-05-15');

-- Insert sample patient
INSERT INTO users (user_id, role, status, name, email, password_hash, email_verified, phone, birth_date)
VALUES (UUID(), 'patient', 'active', 'Mohamed', 'mohamed@example.com', 'hashed_password', TRUE, '01009876543', '1995-08-20');

-- Insert sample portfolio
INSERT INTO doctor_portfolios (portfolio_id, user_id, doctor_name, specialty, title, phone_number)
VALUES (UUID(), 2, 'Dr. Ahmed', 'Orthopedic', 'Orthopedic Surgeon', '01001234567');

-- Insert sample booking
INSERT INTO bookings (portfolio_id, type, total_patients, status, appointment_date, appointment_time)
VALUES (1, 'booking', 50, 'active', '2026-10-15', '20:30:00');

-- Insert sample booking item
INSERT INTO booking_items (booking_id, user_id, queue_number, patient_name, patient_phone, status)
VALUES (1, 3, 1, 'Mohamed', '01009876543', 'pending');
```

---

## How to Use

### 1. Create Database and Tables

```bash
# Connect to MySQL
mysql -u your_username -p

# Run the schema
source database_schema.sql
```

### 2. Verify Tables

```mysql
USE doctory_db;
SHOW TABLES;
```

### 3. Test Sample Data

```mysql
-- View all users
SELECT * FROM users;

-- View doctor details
SELECT * FROM doctor_details;

-- View booking summary
SELECT * FROM booking_summary;
```

---

## Notes

- **UUID Generation**: MySQL uses `UUID()` function instead of `uuid_generate_v4()`
- **Auto Timestamps**: `created_at` and `updated_at` are automatically managed
- **Foreign Keys**: All relationships use `ON DELETE CASCADE` for data integrity
- **Character Set**: Using `utf8mb4` to support Arabic text and emojis
- **Storage Engine**: Using `InnoDB` for transaction support and foreign keys
