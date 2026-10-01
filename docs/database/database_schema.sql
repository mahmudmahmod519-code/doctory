-- ============================================
-- Graduation Project - Database Schema
-- Project: Doctor Appointment System
-- Database: PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'doctor', 'patient')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended')),
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
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for users
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- ============================================
-- 2. DOCTOR PORTFOLIOS TABLE
-- ============================================
CREATE TABLE doctor_portfolios (
    id SERIAL PRIMARY KEY,
    portfolio_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    background_image VARCHAR(255),
    profile_image VARCHAR(255),
    phone_number VARCHAR(20),
    working_hours TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for doctor_portfolios
CREATE INDEX idx_portfolios_user_id ON doctor_portfolios(user_id);
CREATE INDEX idx_portfolios_portfolio_id ON doctor_portfolios(portfolio_id);
CREATE INDEX idx_portfolios_specialty ON doctor_portfolios(specialty);

-- ============================================
-- 3. DOCTOR WORKS TABLE
-- ============================================
CREATE TABLE doctor_works (
    id SERIAL PRIMARY KEY,
    work_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    portfolio_id INTEGER NOT NULL REFERENCES doctor_portfolios(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
    title VARCHAR(200) NOT NULL,
    image VARCHAR(255),
    price DECIMAL(10, 2),
    description TEXT,
    duration_session INTEGER COMMENT 'Duration in minutes',
    working_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for doctor_works
CREATE INDEX idx_works_portfolio_id ON doctor_works(portfolio_id);
CREATE INDEX idx_works_status ON doctor_works(status);

-- ============================================
-- 4. BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER NOT NULL REFERENCES doctor_portfolios(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('booking', 'consulting')),
    total_patients INTEGER NOT NULL DEFAULT 50,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for bookings
CREATE INDEX idx_bookings_portfolio_id ON bookings(portfolio_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(appointment_date);
CREATE INDEX idx_bookings_portfolio_date ON bookings(portfolio_id, appointment_date);

-- ============================================
-- 5. BOOKING ITEMS TABLE
-- ============================================
CREATE TABLE booking_items (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    queue_number INTEGER NOT NULL,
    patient_name VARCHAR(100),
    patient_phone VARCHAR(20),
    patient_age INTEGER,
    patient_address TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    qr_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(booking_id, user_id)
);

-- Indexes for booking_items
CREATE INDEX idx_booking_items_booking_id ON booking_items(booking_id);
CREATE INDEX idx_booking_items_user_id ON booking_items(user_id);
CREATE INDEX idx_booking_items_status ON booking_items(status);

-- ============================================
-- 6. REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    portfolio_id INTEGER NOT NULL REFERENCES doctor_portfolios(id) ON DELETE CASCADE,
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for reviews
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_portfolio_id ON reviews(portfolio_id);

-- ============================================
-- 7. REPORTS TABLE
-- ============================================
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    portfolio_id INTEGER NOT NULL REFERENCES doctor_portfolios(id) ON DELETE CASCADE,
    description TEXT,
    medicines TEXT COMMENT 'JSON array format: ["mid1", "mid2", "mid3"]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
-- FUNCTIONS
-- ============================================

-- Function: Calculate age from birth_date
CREATE OR REPLACE FUNCTION calculate_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(CURRENT_DATE, birth_date))::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON doctor_portfolios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_works_updated_at
    BEFORE UPDATE ON doctor_works
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample admin
INSERT INTO users (user_id, role, status, name, email, password_hash, email_verified)
VALUES (uuid_generate_v4(), 'admin', 'active', 'Admin User', 'admin@example.com', 'hashed_password', TRUE);

-- Insert sample doctor
INSERT INTO users (user_id, role, status, name, email, password_hash, email_verified, phone, birth_date)
VALUES (uuid_generate_v4(), 'doctor', 'active', 'Dr. Ahmed', 'ahmed@example.com', 'hashed_password', TRUE, '01001234567', '1985-05-15');

-- Insert sample patient
INSERT INTO users (user_id, role, status, name, email, password_hash, email_verified, phone, birth_date)
VALUES (uuid_generate_v4(), 'patient', 'active', 'Mohamed', 'mohamed@example.com', 'hashed_password', TRUE, '01009876543', '1995-08-20');

-- Insert sample portfolio
INSERT INTO doctor_portfolios (portfolio_id, user_id, doctor_name, specialty, title, phone_number)
VALUES (uuid_generate_v4(), 2, 'Dr. Ahmed', 'Orthopedic', 'Orthopedic Surgeon', '01001234567');

-- Insert sample booking
INSERT INTO bookings (portfolio_id, type, total_patients, status, appointment_date, appointment_time)
VALUES (1, 'booking', 50, 'active', '2026-10-15', '20:30:00');

-- Insert sample booking item
INSERT INTO booking_items (booking_id, user_id, queue_number, patient_name, patient_phone, status)
VALUES (1, 3, 1, 'Mohamed', '01009876543', 'pending');
