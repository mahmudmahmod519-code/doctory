// ==========================================
// MODULE: DOCTOR
// Mounted in routes/index.js as:
//   app.use('/', require('./doctor/index.js'))
// Internal mounting:
//   router.use('/api/doctor', require('./doctor.apis.js'));
//   router.use('/doctor',     require('./doctor.render.js'));
// Authentication: auth middleware (JWT via 'session_token' cookie) + roles('doctor')
// Note: this file currently contains documentation only — the routers are not mounted yet.
// ==========================================

// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /doctor/login
// Render doctor login page.
// Shows: email and password fields, a notice that two-factor authentication is mandatory for doctors,
// and links to forgot password and doctor registration.
// Redirects to /doctor/dashboard when the user is already logged in as a doctor.

// GET /doctor/dashboard
// Render doctor dashboard page.
// Shows: pending bookings count, today's patients count, current waiting list count and completed today,
// the list of today's appointments (patient name, time, type, status) and quick action shortcuts.
// Requires authentication (doctor role).

// GET /doctor/bookings/pending
// Render pending bookings page.
// Lists the booking requests waiting for the doctor's decision with the minimum patient data needed
// (name, service type, requested date/time and the visit reason category).
// Includes accept and reject actions per row — rejection requires a reason.
// Requires authentication (doctor role) and ownership of the bookings (the doctor's own portfolio).

// GET /doctor/bookings/:id
// Render booking details page for the doctor.
// Shows: session header (doctor, type, date, time, capacity) and the items table
// (queue number, patient, phone, age, status) with edit dialogs for status and queue number.
// Only the patients booked with this doctor are visible.
// Requires authentication (doctor role) and ownership of the booking.

// GET /doctor/waiting-list
// Render doctor waiting list page.
// Shows the queue of the authenticated doctor for the selected day, split into three groups:
// waiting (queue number, patient, waiting minutes, estimated wait),
// completed (queue number, patient, completed at) and removed (rejected / cancelled / deleted).
// Includes the call-next action and the counters for each group.
// Requires authentication (doctor role).

// GET /doctor/visits/:id/clinical-summary
// Render clinical summary page for one visit.
// Shows the authorized clinical context only: patient basics, age, chronic conditions,
// allergies, current medications, previous visits summary and the reason of the current visit.
// Links to the diagnosis editor and the prescription editor.
// Requires authentication (doctor role) and the doctor must be the treating doctor of that visit.

// GET /doctor/visits/:id/diagnosis
// Render diagnosis editor page.
// Allows the doctor to create or modify the diagnosis of a visit (main diagnosis, optional secondary
// diagnoses and optional diagnosis category). Includes a save button and the visit header.
// Requires authentication (doctor role) and the doctor must be the treating doctor of that visit.

// GET /doctor/visits/:id/prescription
// Render prescription editor page.
// Allows the doctor to write the prescription: a medication list (name, dosage, frequency, duration,
// instructions), general instructions for the patient and a print button.
// Requires authentication (doctor role) and the doctor must be the treating doctor of that visit.

// GET /doctor/verification-status
// Render doctor verification status page.
// Shows the verification state: pending, approved or rejected, the rejection reason when it exists,
// the history of previous Medical ID submissions, and a resubmit area for a new Medical ID file.
// A pending or rejected doctor cannot use the protected doctor features.
// Requires authentication (doctor role).

// GET /doctor/portfolio
// Render doctor portfolio editor page.
// Allows editing the profile (name, specialty, title, cover image, profile image, phone, working hours)
// and managing the services (title, price, duration, description, status) of the doctor.
// Requires authentication (doctor role).


// ==========================================
// API ROUTES (JSON)
// ==========================================

// GET /api/doctor/dashboard
// Dashboard summary for the logged-in doctor.
// Query: date (optional, defaults to today).
// Returns: pending bookings count, today's patients count, waiting count, completed count,
// today's appointments list, verification status and the current waiting list summary.
// Requires authentication (doctor role). Only the authenticated doctor's own data is returned.

// GET /api/doctor/bookings
// List the bookings of the logged-in doctor.
// Query: status (pending|accepted|rejected|completed|cancelled), type, date_from, date_to,
// page, limit, sort, order.
// Returns: { items, page, limit, total } where each item holds booking_id, patient name,
// service title, date, time, queue_number, type, status and the AI prediction snapshot.
// Requires authentication (doctor role) and ownership of the bookings.

// GET /api/doctor/bookings/:bookingId
// Get one booking of the logged-in doctor with its items.
// Params: bookingId (booking ObjectId).
// Returns: { status: 'success', data: { booking, items } } with the items ordered by queue_number.
// The response contains only the patient data needed for the decision (name, phone, age, visit reason).
// 404 when the booking does not exist or belongs to another doctor.
// Requires authentication (doctor role) and ownership of the booking.

// PATCH /api/doctor/bookings/:bookingId/accept
// Accept a pending booking request.
// Params: bookingId (booking ObjectId).
// Body: none.
// Returns: { status: 'success', message, data: { booking_item } }.
// Business rules:
// - The booking item status becomes 'accepted' and the patient is added to the waiting queue.
// - The patient receives an in-app notification (booking_accepted) and a critical email.
// - The queue number is assigned inside the session.
// 409 when the booking is not pending or the session is already full.
// Requires authentication (doctor role) and ownership of the booking.

// PATCH /api/doctor/bookings/:bookingId/reject
// Reject a pending booking request.
// Params: bookingId (booking ObjectId).
// Body: { reason (required, min 10 characters, max 500) }.
// Returns: { status: 'success', message, data: { booking_item } }.
// Business rules:
// - The booking item status becomes 'rejected' and the slot is freed.
// - The patient receives an in-app notification (booking_rejected) and a critical email.
// 400 when the reason is missing or too short, 409 when the booking is not pending.
// Requires authentication (doctor role) and ownership of the booking.

// GET /api/doctor/waiting-list
// Get the waiting list of the logged-in doctor.
// Query: date (optional, defaults to today), type (optional: booking|consulting).
// Returns: { status: 'success', data: { waiting, completed, removed, counters } }.
// Every waiting patient holds queue_number, name, waiting_minutes and estimated_wait_minutes.
// The estimate is calculated from the stored prediction snapshots — the model is not called again.
// Requires authentication (doctor role).

// POST /api/doctor/waiting-list/call-next
// Call the next eligible patient in the waiting list.
// Body: { booking_item_id (optional — when omitted the next eligible item is selected automatically) }.
// Returns: { status: 'success', message, data: { called, remaining } }.
// Business rules:
// - Only accepted items of the authenticated doctor are eligible.
// - The patient receives a turn_warning in-app notification.
// 404 when there is no eligible patient left.
// Requires authentication (doctor role).

// GET /api/doctor/visits/:visitId/clinical-summary
// Get the authorized clinical information of one visit.
// Params: visitId (booking item ObjectId).
// Returns: { status: 'success', data: { patient, visit, chronic_diseases, allergies, medications,
// previous_visits, reports } }.
// The doctor must be the treating doctor of the visit — other doctors get 403.
// 404 when the visit does not exist.
// Requires authentication (doctor role) and ownership of the visit.

// PUT /api/doctor/visits/:visitId/diagnosis
// Create or update the diagnosis of a visit.
// Params: visitId (booking item ObjectId).
// Body: { diagnosis (required, max 2000), secondary_diagnosis (optional), diagnosis_category (optional) }.
// Returns: { status: 'success', message, data: { diagnosis } }.
// Business rules:
// - Only the treating doctor can write the diagnosis.
// - Updating an existing diagnosis keeps a single current record.
// 404 when the visit does not exist, 403 when the doctor is not the treating doctor.
// Requires authentication (doctor role) and ownership of the visit.

// POST /api/doctor/visits/:visitId/prescriptions
// Create a prescription for a visit.
// Params: visitId (booking item ObjectId).
// Body: { medicines: [{ name (required), dosage (required), frequency (optional), duration (optional),
// instructions (optional) }] (required, max 50 items), notes (optional, max 2000) }.
// Returns: { status: 'success', message, data: { prescription } }.
// Business rules:
// - The prescription is stored with the visit and becomes visible to the patient.
// - A report record is created or updated from the same visit data.
// - The patient is notified in-app when the prescription is ready.
// 400 on validation failure, 404 when the visit does not exist.
// Requires authentication (doctor role) and ownership of the visit.

// GET /api/doctor/visits/:visitId/prescriptions
// List the prescriptions of a visit.
// Params: visitId (booking item ObjectId).
// Returns: { status: 'success', data: { prescriptions } } with the medicines and the creation date.
// Requires authentication (doctor role) and ownership of the visit.

// GET /api/doctor/profile/verification-status
// Get the verification status of the logged-in doctor.
// Query: none.
// Returns: { status: 'success', data: { verification_status, medical_id_image, submitted_at,
// rejection_reason, reviewed_by, reviewed_at, attempts } }.
// The Medical ID file is served through a protected link, never as a public static path.
// Requires authentication (doctor role).

// GET /api/doctor/portfolio
// Get the portfolio of the logged-in doctor for editing.
// Query: none.
// Returns: { status: 'success', data: { portfolio, services } } with the profile fields,
// the working hours and the list of services with their approval status.
// Requires authentication (doctor role).

// PATCH /api/doctor/portfolio
// Update the profile and working hours of the logged-in doctor.
// Body: { doctor_name, specialty, title, phone_number, working_hours, background_image, profile_image }
// (all optional, at least one field required).
// Returns: { status: 'success', message, data: { portfolio } }.
// Business rules:
// - Only the authenticated doctor can edit their own portfolio.
// - The change is applied immediately.
// 400 when no field is provided or the validation fails.
// Requires authentication (doctor role) and ownership of the portfolio.
