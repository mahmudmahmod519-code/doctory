// ==========================================
// MODULE: BOOKING
// Mounted in routes/index.js as:
//   app.use('/', require('./Booking/index.js'))
// Internal mounting:
//   router.use('/api/bookings', require('./Booking.apis.js'));
//   router.use('/book',       require('./Booking.render.js'));
// Authentication: auth middleware (JWT via 'session_token' cookie)
// Roles: patient creates and cancels, doctor reads his own sessions, admin manages all sessions.
// Note: this file currently contains documentation only — the routers are not mounted yet.
// ==========================================

// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// Note: the live frontend path of this page is GET /doctors/:id/book (served by the DoctorPortfolio module).
// This /book/:portfolioId path is kept as a documented alias — add a redirect to it when it is needed.

// GET /book/:portfolioId
// Render the book appointment page (select the service and the slot of a doctor).
// Shows: the doctor header (name, specialty, rating), the list of active services with price and duration,
// a calendar to pick the appointment date, the available time slots of the selected date,
// the booking summary (service, date, time, duration, price),
// an optional problem description field with the AI prediction consent checkbox,
// and the confirm booking button.
// Requires authentication (patient role). Guests are redirected to /auth/login.
// View file: views/patient/doctors/book-appointment.ejs.


// ==========================================
// API ROUTES (JSON)
// ==========================================

// GET /api/bookings
// List booking sessions.
// Query: type (booking|consulting), status (pending|active|expired|cancelled), doctor_id,
// date_from, date_to, include_deleted, page, limit, sort, order.
// Returns: { items, page, limit, total } where each item holds booking_id, doctor (portfolio_id, name,
// specialty), type, appointment_date, appointment_time, booked_count, total_patients and status.
// Soft-deleted sessions are excluded unless include_deleted=true is passed.
// Requires authentication (patient|doctor|admin).

// GET /api/bookings/slots
// List the available time slots of a doctor for a given date.
// Query: portfolio_id (required), date (required, YYYY-MM-DD), type (optional: booking|consulting).
// Returns: { status: 'success', data: { slots: [{ appointment_time, remaining, total_patients }] } }.
// A slot is available when the number of booked items is lower than total_patients.
// 400 when portfolio_id or date is missing, 404 when the doctor does not exist.
// Requires authentication (patient|doctor|admin).

// GET /api/bookings/:id
// Get one booking session with its items.
// Params: id (booking ObjectId).
// Returns: { status: 'success', data: { booking, items } } with the items ordered by queue_number,
// each item holding patient name, phone, age, status and the AI prediction snapshot.
// 404 when the session does not exist.
// Requires authentication (patient|doctor|admin) with ownership or admin role.

// GET /api/bookings/:id/items
// List the booking items of one session.
// Params: id (booking ObjectId).
// Query: status (optional filter), page, limit.
// Returns: { items, page, limit, total } with queue_number, patient, status and prediction snapshot.
// Requires authentication (doctor|admin) with ownership or admin role.

// POST /api/bookings
// Create a new booking session.
// Body: { portfolio_id (required), type: 'booking'|'consulting' (required), total_patients (optional, default 50),
//         appointment_date (required, ISO), appointment_time (required, HH:mm) }.
// Returns: { status: 'success', message, data: { booking } }.
// Business rules:
// - The session belongs to the doctor of the portfolio and starts with status 'pending'.
// - total_patients is the capacity of the session and cannot be lower than the accepted items count.
// - The doctor is notified in-app about the new session.
// 400 on validation failure, 409 when a session with the same doctor, date and time already exists.
// Requires authentication (doctor|admin).

// PATCH /api/bookings/:id
// Update a booking session.
// Params: id (booking ObjectId).
// Body: { status, total_patients, appointment_date, appointment_time } (any field optional).
// Returns: { status: 'success', message, data: { booking } }.
// Business rules:
// - total_patients cannot be set below the number of accepted items.
// - When status becomes 'cancelled' all pending and accepted items are cancelled and the patients are notified.
// - Changing the date or the time notifies every patient of the session.
// 404 when the session does not exist, 409 when the capacity rule is broken.
// Requires authentication (doctor|admin) with ownership or admin role.

// DELETE /api/bookings/:id
// Soft delete a booking session.
// Params: id (booking ObjectId).
// Returns: { status: 'success', message, data: { booking } }.
// Business rules:
// - deleted_at is set and the session disappears from every list unless include_deleted=true is passed.
// - 409 when the session still has accepted items — cancel the session first.
// Requires authentication (admin).
