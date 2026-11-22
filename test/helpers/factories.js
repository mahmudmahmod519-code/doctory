// Data factories — build the documents needed by the integration and e2e suites.

const crypto = require('crypto');
const { createUser } = require('./auth');
const DoctorPortfolio = require('../../models/DoctorPortfolio.entity');
const DoctorWork = require('../../models/DoctorWork.entity');
const Booking = require('../../models/Booking.entity');
const BookingItem = require('../../models/BookingItem.entity');

async function createDoctor(overrides = {}) {
  const user = await createUser({ role: 'doctor', ...overrides });
  const portfolio = await DoctorPortfolio.create({
    portfolio_id: overrides.portfolio_id || crypto.randomUUID(),
    user_id: user._id,
    doctor_name: overrides.doctor_name || user.name,
    specialty: overrides.specialty || 'cardiology',
    title: overrides.title || 'استشاري',
    phone_number: overrides.phone_number || user.phone,
    working_hours: overrides.working_hours || 'السبت إلى الأربعاء (٤م - ٩م)'
  });
  return { user, portfolio };
}

async function createService(portfolio, overrides = {}) {
  return DoctorWork.create({
    work_id: overrides.work_id || crypto.randomUUID(),
    portfolio_id: portfolio._id,
    status: overrides.status || 'active',
    title: overrides.title || 'كشف استشاري',
    price: overrides.price ?? 300,
    description: overrides.description || 'خدمة استشارية عامة',
    duration_session: overrides.duration_session ?? 20,
    working_time: overrides.working_time || '16:00'
  });
}

async function createBooking(portfolio, overrides = {}) {
  return Booking.create({
    portfolio_id: portfolio._id,
    total_patients: overrides.total_patients ?? 10,
    status: overrides.status || 'active',
    appointment_date: overrides.appointment_date || new Date(),
    appointment_time: overrides.appointment_time || '16:00'
  });
}

async function createBookingItem(booking, user, overrides = {}) {
  return BookingItem.create({
    booking_id: booking._id,
    user_id: user._id,
    queue_number: overrides.queue_number ?? 1,
    status: overrides.status || 'pending',
    type: overrides.type || 'booking',
    patient_name: overrides.patient_name || user.name,
    patient_phone: overrides.patient_phone || user.phone,
    patient_age: overrides.patient_age ?? 30,
    ...overrides
  });
}

module.exports = { createDoctor, createService, createBooking, createBookingItem };
