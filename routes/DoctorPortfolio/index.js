// ==========================================
// MODULE: DOCTOR PORTFOLIO
// Mounted in routes/index.js as:
//   app.use('/', require('./DoctorPortfolio/index.js'))
// Internal mounting:
//   router.use('/api/doctor-portfolios', require('./DoctorPortfolio.apis.js'));
//   router.use('/doctors',              require('./DoctorPortfolio.render.js'));
// Authentication: auth middleware (JWT via 'session_token' cookie)
// Public pages: the /doctors listing and the /doctors/:id profile are guest accessible.
// Status: the RENDER routes are live (DoctorPortfolio.render.js); the JSON API routes below are still documentation only.
// ==========================================

// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /doctors
// Render the doctor search / listing page.
// Shows: a search bar (name, specialty, city), filter chips (specialty, availability, rating)
// and a grid of doctor cards (photo, name, specialty, years of experience, rating, fee, working hours)
// with a "book appointment" button per card.
// Includes pagination and an empty state when no doctor matches the filters.
// Guest accessible — no authentication required.
// View file: views/patient/doctors/search.ejs.

// GET /doctors/:id/book
// Render the book appointment page for one doctor (service → day → time slot → confirm).
// Requires authentication (patient role) — a guest is redirected to /auth/login?next=/doctors/:id/book.
// Reads: GET /api/public/doctors/:id, GET /api/bookings/slots, then POST /api/patient/bookings.
// After a successful booking the patient is redirected to /patient/waiting-queue?booking=<booking_item_id>.
// View file: views/patient/doctors/book-appointment.ejs.
// Note: routes/Booking/index.js documents the same page as GET /book/:portfolioId — the live path is this one.

// GET /doctors/:id
// Render the public doctor profile page.
// Shows: cover image, profile photo, name, specialty, title, years of experience and rating,
// the services with price and duration, the weekly working hours and the patient reviews.
// Includes a prominent "book appointment" call to action.
// Guest accessible — no authentication required.
// View file: views/patient/doctors/profile.ejs.


// ==========================================
// API ROUTES (JSON)
// ==========================================

// GET /api/public/doctors
// Public doctor listing used by the search page and the doctor listing.
// Query: q (name search), specialty, city, available (true|false), min_rating, page, limit, sort, order.
// Returns: { items, page, limit, total } where each item holds portfolio_id, doctor_name, specialty, title,
// profile_image, average_rating, sessions_count and the minimum active service price.
// Only doctors with an active user status and an active portfolio are returned.
// No authentication required — this is the public replacement for the admin-only doctors list.

// GET /api/public/doctors/:id
// Public doctor profile used by the public profile page.
// Params: id (portfolio ObjectId).
// Returns: { status: 'success', data: { doctor, services, working_hours, reviews, rating } }.
// The response contains public data only — no email, no phone, no patient data.
// 404 when the doctor does not exist or is not publicly visible.
// No authentication required.

// GET /api/public/specialties
// Public list of the specialties and cities that have at least one active doctor.
// Used to fill the filter chips of the /doctors search page instead of hard coding them in the view.
// Returns: { status: 'success', data: { specialties: [{ key, label, doctors_count }], cities: [{ name, doctors_count }] } }.
// Only doctors with an active user status and an active portfolio are counted.
// No authentication required.

// GET /api/public/portfolios/:portfolioId/services
// Public services list of a doctor.
// Params: portfolioId (portfolio_id string).
// Query: status (optional — defaults to active only).
// Returns: { status: 'success', data: { services } } with title, description, price,
// duration_session and working_time.
// No authentication required.

// GET /api/doctor-portfolios
// List doctor portfolios.
// Query: q, specialty, status (user status), include_deleted, page, limit, sort, order.
// Returns: { items, page, limit, total } with portfolio_id, user_id, doctor_name, specialty, title,
// email, user status, sessions_count and patients_count.
// Requires authentication (admin).

// GET /api/doctor-portfolios/:id
// Get one doctor portfolio with its statistics.
// Params: id (portfolio ObjectId).
// Returns: { status: 'success', data: { portfolio, user, working_hours, stats } }
// where stats holds sessions_count, patients_count and average_rating.
// Requires authentication (doctor|admin) with ownership or admin role.

// POST /api/doctor-portfolios
// Create a doctor portfolio.
// Body: { doctor_name (required), specialty (required), title, phone_number, working_hours,
//         background_image, profile_image }.
// Returns: { status: 'success', message, data: { portfolio } }.
// Business rules:
// - The portfolio is linked to the authenticated doctor (user_id is taken from the session, never from the body).
// - portfolio_id is generated automatically (unique string).
// - A patient cannot create a portfolio — only doctors and admins.
// 400 on validation failure, 409 when the doctor already owns a portfolio.
// Requires authentication (doctor|admin).

// PATCH /api/doctor-portfolios/:id
// Update a doctor portfolio.
// Params: id (portfolio ObjectId).
// Body: { doctor_name, specialty, title, phone_number, working_hours, background_image, profile_image }
// (all optional, at least one field required).
// Returns: { status: 'success', message, data: { portfolio } }.
// Business rules: only the owning doctor or an admin can edit the portfolio;
// every change is written to the audit log.
// 404 when the portfolio does not exist, 403 when the caller is not the owner.
// Requires authentication (doctor|admin) with ownership or admin role.

// DELETE /api/doctor-portfolios/:id
// Soft delete a doctor portfolio.
// Params: id (portfolio ObjectId).
// Returns: { status: 'success', message, data: { portfolio } }.
// Business rules: deleted_at is set, the doctor disappears from the public listing
// and the historical bookings and reports are preserved.
// Requires authentication (admin).

// ==========================================
// MOUNTING (live)
// ==========================================
const router = require('express').Router();
router.use('/doctors', require('./DoctorPortfolio.render.js'));
// router.use('/api/public', ...); router.use('/api/doctor-portfolios', require('./DoctorPortfolio.apis.js'));
module.exports = router;
