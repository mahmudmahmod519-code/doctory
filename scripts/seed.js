// scripts/seed.js
// Database seed script for Doctory.
// Creates sample data for development/testing.
// Idempotent: skips seeding if users already exist.
// Run with: npm run seed

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../config/env-config');

// Build MongoDB URI (same logic as config/database.js)
function buildMongoUri() {
  if (config.database_mongo.uri) {
    return config.database_mongo.uri;
  }
  const { host, port, user, pass, name } = config.database_mongo;
  const credentials = user
    ? `${encodeURIComponent(user)}:${encodeURIComponent(pass || '')}@`
    : '';
  return `mongodb://${credentials}${host}:${port}/${name}`;
}

async function seed() {
  const uri = buildMongoUri();

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  });

  console.log('✅ Connected to MongoDB');

  const User = require('../models/User.entity.js');
  const DoctorPortfolio = require('../models/DoctorPortfolio.entity.js');
  const DoctorWork = require('../models/DoctorWork.entity.js');
  const Booking = require('../models/Booking.entity.js');
  const BookingItem = require('../models/BookingItem.entity.js');
  const Review = require('../models/Review.entity.js');
  const Report = require('../models/Report.entity.js');
  const Notification = require('../models/Notification.entity.js');

  // Idempotency check: if users already exist, skip seeding
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    console.log(`⚠️  Database already contains ${existingUsers} users. Skipping seed.`);
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    return;
  }

  const saltRounds = config.auth.bcrypt.salt || 12;

  // ── 1. Admin user ─────────────────────────────────────────────────────
  const adminPassword = (config.admin && config.admin.password) || 'Admin123456!';
  const adminEmail = (config.admin && config.admin.email) || 'admin@doctory.com';
  const adminName = (config.admin && config.admin.username) || 'SuperAdmin';
  const adminPhone = (config.admin && config.admin.phone) || '+200000000000';

  const adminUser = await User.create({
    user_id: crypto.randomUUID(),
    role: 'admin',
    status: 'active',
    name: adminName,
    email: adminEmail,
    password_hash: await bcrypt.hash(adminPassword, saltRounds),
    phone: adminPhone,
    email_verified: true,
    enable_2fa: true,
  });
  console.log(`✅ Admin created: ${adminUser.email} / ${adminPassword}`);

  // ── 2. Doctor 1: Dr. Ahmed (Cardiology) ───────────────────────────────
  const doctor1Password = 'Doctor123456!';
  const doctor1User = await User.create({
    user_id: crypto.randomUUID(),
    role: 'doctor',
    status: 'active',
    name: 'Dr. Ahmed Mohamed',
    email: 'dr.ahmed@doctory.com',
    password_hash: await bcrypt.hash(doctor1Password, saltRounds),
    phone: '+201000000001',
    email_verified: true,
    enable_2fa: true,
  });
  const doctor1Portfolio = await DoctorPortfolio.create({
    portfolio_id: crypto.randomUUID(),
    user_id: doctor1User._id,
    doctor_name: 'Dr. Ahmed Mohamed',
    specialty: 'Cardiology',
    title: 'Cardiologist',
    phone_number: '+201000000001',
    working_hours: 'Sat-Thu 09:00-14:00',
  });
  await DoctorWork.create({
    work_id: crypto.randomUUID(),
    portfolio_id: doctor1Portfolio._id,
    status: 'active',
    title: 'Cardiology Consultation',
    price: 300,
    description: 'Heart and cardiovascular consultation',
    duration_session: 30,
    working_time: '09:00',
  });
  await DoctorWork.create({
    work_id: crypto.randomUUID(),
    portfolio_id: doctor1Portfolio._id,
    status: 'active',
    title: 'ECG Test',
    price: 150,
    description: 'Electrocardiogram test',
    duration_session: 15,
    working_time: '10:00',
  });
  console.log(`✅ Doctor 1 created: ${doctor1User.email} / ${doctor1Password} (Cardiology)`);

  // ── 3. Doctor 2: Dr. Sara (Pediatrics) ────────────────────────────────
  const doctor2Password = 'Doctor123456!';
  const doctor2User = await User.create({
    user_id: crypto.randomUUID(),
    role: 'doctor',
    status: 'active',
    name: 'Dr. Sara Ali',
    email: 'dr.sara@doctory.com',
    password_hash: await bcrypt.hash(doctor2Password, saltRounds),
    phone: '+201000000002',
    email_verified: true,
    enable_2fa: true,
  });
  const doctor2Portfolio = await DoctorPortfolio.create({
    portfolio_id: crypto.randomUUID(),
    user_id: doctor2User._id,
    doctor_name: 'Dr. Sara Ali',
    specialty: 'Pediatrics',
    title: 'Pediatrician',
    phone_number: '+201000000002',
    working_hours: 'Sun-Wed 10:00-15:00',
  });
  await DoctorWork.create({
    work_id: crypto.randomUUID(),
    portfolio_id: doctor2Portfolio._id,
    status: 'active',
    title: 'Pediatric Consultation',
    price: 250,
    description: 'Children health consultation',
    duration_session: 20,
    working_time: '10:00',
  });
  console.log(`✅ Doctor 2 created: ${doctor2User.email} / ${doctor2Password} (Pediatrics)`);

  // ── 4. Patient 1: Mohamed ─────────────────────────────────────────────
  const patient1Password = 'Patient123456!';
  const patient1User = await User.create({
    user_id: crypto.randomUUID(),
    role: 'patient',
    status: 'active',
    name: 'Mohamed Hassan',
    email: 'mohamed@doctory.com',
    password_hash: await bcrypt.hash(patient1Password, saltRounds),
    phone: '+201000000101',
    email_verified: true,
    enable_2fa: false,
  });
  console.log(`✅ Patient 1 created: ${patient1User.email} / ${patient1Password}`);

  // ── 5. Patient 2: Sara ────────────────────────────────────────────────
  const patient2Password = 'Patient123456!';
  const patient2User = await User.create({
    user_id: crypto.randomUUID(),
    role: 'patient',
    status: 'active',
    name: 'Sara Ibrahim',
    email: 'sara@doctory.com',
    password_hash: await bcrypt.hash(patient2Password, saltRounds),
    phone: '+201000000102',
    email_verified: true,
    enable_2fa: false,
  });
  console.log(`✅ Patient 2 created: ${patient2User.email} / ${patient2Password}`);

  // ── 6. Bookings & Booking Items ───────────────────────────────────────
  const today = new Date();
  today.setHours(10, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Booking 1: Dr. Ahmed Cardiology - today
  const booking1 = await Booking.create({
    portfolio_id: doctor1Portfolio._id,
    type: 'booking',
    total_patients: 10,
    status: 'active',
    appointment_date: today,
    appointment_time: '10:00',
  });
  const bookingItem1 = await BookingItem.create({
    booking_id: booking1._id,
    user_id: patient1User._id,
    queue_number: 1,
    patient_name: 'Mohamed Hassan',
    patient_phone: '+201000000101',
    patient_age: 35,
    patient_address: 'Cairo, Egypt',
    status: 'accepted',
    type: 'booking',
  });
  console.log(`✅ Booking 1 created: Mohamed Hassan -> Dr. Ahmed (queue #1)`);

  // Booking 2: Dr. Sara Pediatrics - tomorrow
  const booking2 = await Booking.create({
    portfolio_id: doctor2Portfolio._id,
    type: 'consulting',
    total_patients: 8,
    status: 'pending',
    appointment_date: tomorrow,
    appointment_time: '11:00',
  });
  const bookingItem2 = await BookingItem.create({
    booking_id: booking2._id,
    user_id: patient2User._id,
    queue_number: 1,
    patient_name: 'Sara Ibrahim',
    patient_phone: '+201000000102',
    patient_age: 28,
    patient_address: 'Giza, Egypt',
    status: 'pending',
    type: 'consulting',
  });
  console.log(`✅ Booking 2 created: Sara Ibrahim -> Dr. Sara (queue #1, pending)`);

  // ── 7. Reviews ────────────────────────────────────────────────────────
  await Review.create({
    user_id: patient1User._id,
    portfolio_id: doctor1Portfolio._id,
    feedback: 'Excellent doctor, very professional and caring.',
    rating: 5,
  });
  await Review.create({
    user_id: patient2User._id,
    portfolio_id: doctor2Portfolio._id,
    feedback: 'Great experience with the pediatrician.',
    rating: 4,
  });
  console.log('✅ Reviews created (2)');

  // ── 8. Reports ────────────────────────────────────────────────────────
  await Report.create({
    user_id: patient1User._id,
    portfolio_id: doctor1Portfolio._id,
    description: 'Patient diagnosed with mild hypertension. Prescribed lifestyle changes and follow-up in 1 month.',
    medicines: ['amlodipine-5mg', 'atorvastatin-10mg'],
  });
  console.log('✅ Medical report created (1)');

  // ── 9. Notifications ──────────────────────────────────────────────────
  await Notification.create({
    notification_id: crypto.randomUUID(),
    user_id: patient1User._id,
    type: 'booking_accepted',
    title: 'Booking Accepted',
    message: 'Dr. Ahmed Mohamed has accepted your booking for today at 10:00.',
    is_read: false,
    related_entity_type: 'booking_item',
    related_entity_id: bookingItem1._id.toString(),
  });
  await Notification.create({
    notification_id: crypto.randomUUID(),
    user_id: patient2User._id,
    type: 'turn_warning',
    title: 'Your Turn is Approaching',
    message: 'You are next in line for Dr. Sara Ali. Please prepare for your consultation.',
    is_read: false,
    related_entity_type: 'booking_item',
    related_entity_id: bookingItem2._id.toString(),
  });
  console.log('✅ Notifications created (2)');

  console.log('\n✅ Seed completed successfully!');
  console.log('\n🔑 Test Credentials:');
  console.log(`   Admin:   ${adminEmail} / ${adminPassword}`);
  console.log(`   Doctor 1: dr.ahmed@doctory.com / ${doctor1Password}`);
  console.log(`   Doctor 2: dr.sara@doctory.com / ${doctor2Password}`);
  console.log(`   Patient 1: mohamed@doctory.com / ${patient1Password}`);
  console.log(`   Patient 2: sara@doctory.com / ${patient2Password}`);

  await mongoose.disconnect();
  console.log('✅ Disconnected from MongoDB');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
