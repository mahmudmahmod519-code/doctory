// ==========================================
// MODULE: PATIENT
// Mounted in routes/index.js as:
//   app.use('/', require('./patient/index.js'))
// Internal mounting:
//   router.use('/api/patient', require('./patient.apis.js'));
//   router.use('/patient',     require('./patient.render.js'));
// Authentication: auth middleware (JWT via 'session_token' cookie) + roles('patient')
// Status: the RENDER routes are live (patient.render.js); the JSON API routes below are still documentation only.
// ==========================================

// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /patient/dashboard
// Render patient dashboard page.
// Shows: upcoming appointment card (doctor, specialty, date, time, queue number, status),
// today's queue position, counts of completed / pending / cancelled bookings.
// Includes quick action shortcuts: book new appointment, view medical history, open notifications.
// Requires authentication (patient role). Redirects to /auth/login when not logged in.

// GET /patient/waiting-queue
// Render waiting queue page.
// Shows: the patient's queue number, the number currently being served, how many patients are ahead,
// the estimated wait in minutes, and a progress bar of the patient's position in the queue.
// The list of patients ahead is shown with queue numbers only (no medical data).
// Requires authentication (patient role) and ownership of the booking item.

// GET /patient/turn-notification
// Render turn notification page.
// Shows: "your turn is now" message with doctor name, clinic, appointment date/time and queue number.
// Includes two actions: confirm presence and decline the turn (decline shows the remaining attempts).
// Requires authentication (patient role) and ownership of the booking item.

// GET /patient/decline-warning
// Render first decline warning page.
// Shows: the first decline notice, how many decline attempts remain before the booking is cancelled,
// and the two allowed actions: confirm the appointment or reschedule it.
// Requires authentication (patient role) and ownership of the booking item.

// GET /patient/appointment-cancelled
// Render appointment cancelled notice page.
// Shows: cancellation message with the reason (doctor rejection, system cancellation, or patient decline limit),
// the cancelled appointment details, and actions to book a new appointment or contact the clinic.
// Requires authentication (patient role).

// GET /patient/medical-history
// Render medical history page.
// Shows: chronic diseases, allergies, current medications and past medical history of the patient.
// Includes add / edit / remove controls for each section and a save button.
// Requires authentication (patient role). Data is private to the patient and the treating doctor.

// GET /patient/medical-report
// Render medical report page.
// Shows: doctor information, visit date, symptoms, diagnosis, prescription and doctor notes.
// Includes a print / download button for the report.
// Requires authentication (patient role) and ownership of the report.
// Medical report content is never exposed to the admin role (count only).

// GET /patient/bookings
// Render my bookings page.
// Shows: all bookings of the patient grouped by upcoming / past / cancelled,
// with doctor, specialty, date, time, queue number and status for every booking.
// Includes filters (status, date range) and pagination.
// Requires authentication (patient role).

// GET /patient/settings
// Render patient settings page.
// Allows editing personal data (name, email, phone, address, birth date), changing the password,
// enabling / disabling two-factor authentication, uploading a profile image,
// and requesting permanent deletion of the account data.
// Requires authentication (patient role).
// Note: the same view is currently also served by /user/settings in routes/User/index.js.

// GET /patient/notifications
// Render notifications center page.
// Lists the in-app notifications of the patient with read / unread state and the notification type.
// Includes "mark all as read" and "delete notification" actions.
// Requires authentication (patient role).
// Note: the canonical path of this page is /notifications (see routes/Notification/index.js).


// ==========================================
// API ROUTES (JSON)
// ==========================================

// GET /api/patient/dashboard
// Dashboard summary for the logged-in patient.
// Query: none.
// Returns: upcoming booking (doctor, specialty, date, time, queue number, status),
// today's queue position, counts (upcoming, completed, pending, cancelled) and recent notifications.
// Requires authentication (patient role). Only the authenticated patient's own data is returned.

// GET /api/patient/bookings
// List the bookings of the logged-in patient.
// Query: status (pending|accepted|rejected|completed|cancelled), date_from, date_to, page, limit, sort, order.
// Returns: { items, page, limit, total } where each item holds booking_id, doctor, specialty,
// date, time, queue_number, type and status.
// Soft-deleted items are excluded unless include_deleted=true is passed.
// Requires authentication (patient role).

// GET /api/patient/bookings/:id
// Get one booking of the logged-in patient with its items.
// Params: id (booking ObjectId).
// Returns: session details (doctor, date, time, capacity, status) and the booking items
// ordered by queue_number, each with its status.
// 404 when the booking does not exist or does not belong to the authenticated patient.
// Requires authentication (patient role) and ownership of the booking.

// POST /api/patient/bookings
// Create a new booking for the logged-in patient.
// Body: { portfolio_id (required), type: 'booking'|'consulting' (required),
//         appointment_date (required), appointment_time (required) }.
// Returns: { status: 'success', message, data: { booking } }.
// Business rules:
// - The slot must be available and the session must not be full (total_patients limit).
// - Duplicate booking for the same session and patient is rejected (unique index on booking_id + user_id).
// 400 on validation failure, 409 when the slot is full or a duplicate booking exists.
// Requires authentication (patient role).

// PATCH /api/patient/bookings/:id/cancel
// Cancel an upcoming booking of the logged-in patient.
// Params: id (booking ObjectId).
// Body: { reason (optional, max 500 chars) }.
// Returns: { status: 'success', message, data: { booking } }.
// Business rules: only bookings with status pending or accepted can be cancelled by the patient.
// The related booking items are cancelled and the queue slot is released.
// An in-app notification is created for the doctor.
// 409 when the booking is already completed or cancelled.
// Requires authentication (patient role) and ownership of the booking.

// PATCH /api/patient/bookings/:id/reschedule
// Reschedule an upcoming booking of the logged-in patient.
// Params: id (booking ObjectId).
// Body: { appointment_date, appointment_time (both required) }.
// Returns: { status: 'success', message, data: { booking } }.
// Business rules:
// - The old booking item is replaced by a new one for the new slot.
// - The previous booking item is soft deleted and the queue position is recalculated.
// - The doctor and the other patients of the old session are notified.
// 409 when the new slot is full or the booking is already completed.
// Requires authentication (patient role) and ownership of the booking.

// GET /api/patient/medical-history
// Get the medical history of the logged-in patient.
// Query: none.
// Returns: { status: 'success', data: { chronic_diseases, allergies, medications, past_history, visits } }.
// Only the authenticated patient and the treating doctor can read this data.
// Requires authentication (patient role).

// GET /api/patient/reports
// List the medical reports of the logged-in patient.
// Query: page, limit, date_from, date_to.
// Returns: { items, page, limit, total } where each item holds report_id, doctor, specialty,
// visit_date, rating-safe summary fields and a download link.
// Requires authentication (patient role).

// GET /api/patient/reports/:id
// Get one medical report of the logged-in patient.
// Params: id (report ObjectId).
// Returns: { status: 'success', data: { report } } with description, medicines and doctor information.
// 404 when the report does not exist or does not belong to the authenticated patient.
// Requires authentication (patient role) and ownership of the report.

// GET /api/patient/reviews
// List the reviews written by the logged-in patient.
// Query: page, limit.
// Returns: { items, page, limit, total } where each item holds doctor, specialty, rating, feedback and date.
// Requires authentication (patient role).

// POST /api/patient/reviews
// Create a review for a completed visit.
// Body: { portfolio_id (required), booking_item_id (required), rating (1-5, required), feedback (optional, max 1000) }.
// Returns: { status: 'success', message, data: { review } }.
// Business rules:
// - A review can only be created for a completed booking item belonging to the authenticated patient.
// - One review per booking item (duplicate is rejected with 409).
// - The doctor average rating is recalculated after the insert.
// Requires authentication (patient role).

// GET /api/patient/queue/:bookingItemId
// Get the live queue information of one booking item.
// Params: bookingItemId (booking item ObjectId).
// Returns: { status: 'success', data: { queue_number, current_number, patients_ahead,
// estimated_wait_minutes, status, doctor, appointment_date, appointment_time } }.
// The estimate is derived from the queue position and the average consultation
// duration of the session — it is a simple calculation, not a model call.
// 404 when the booking item does not exist or does not belong to the authenticated patient.
// Requires authentication (patient role) and ownership of the booking item.

// PATCH /api/patient/queue/:bookingItemId/confirm
// Confirm that the patient is ready for the consultation.
// Params: bookingItemId (booking item ObjectId).
// Body: none.
// Returns: { status: 'success', message, data: { booking_item } }.
// Business rules: records the patient confirmation and notifies the doctor in-app.
// 409 when the patient is not the current queue owner.
// Requires authentication (patient role) and ownership of the booking item.

// PATCH /api/patient/queue/:bookingItemId/decline
// Record a decline attempt for the current turn.
// Params: bookingItemId (booking item ObjectId).
// Body: { reason (optional, max 500 chars) }.
// Returns: { status: 'success', message, data: { attempts_remaining, booking_item } }.
// Business rules:
// - The first decline keeps the booking alive and the patient stays eligible to be called again.
// - From the second decline the queue entry is cancelled, the reason is stored, an audit log entry
//   is written and the next eligible patient is notified.
// - The cancellation reason is shown on /patient/appointment-cancelled.
// Requires authentication (patient role) and ownership of the booking item.

// GET /api/patient/queue/current
// Get the active queue entry of the logged-in patient (used when /patient/waiting-queue is opened without an id).
// Query: none.
// Returns: { status: 'success', data: { booking_item_id } } — booking_item_id is null when no queue entry is active today.
// Business rules: the active entry is the nearest booking item of today with status pending or accepted.
// The page then loads the live numbers from GET /api/patient/queue/:bookingItemId.
// Requires authentication (patient role).

// POST /api/patient/medical-history/:section
// Add one entry to a section of the medical history of the logged-in patient.
// Params: section (chronic_diseases | allergies | medications | past_history).
// Body: depends on the section —
//   chronic_diseases: { name (required), since, status, doctor }
//   allergies:        { name (required), severity (mild|moderate|critical), reaction }
//   medications:      { name (required), dosage, frequency, doctor, since, ongoing }
//   past_history:     { title (required), date, note }
// Returns 201: { status: 'success', message, data: { entry } } with the generated entry_id.
// Business rules: the entry is marked source = 'patient' so the treating doctor can tell it apart from the doctor entries.
// Doctor entries created from a report are read-only for the patient.
// 400 on validation failure, 404 for an unknown section.
// Requires authentication (patient role).

// PATCH /api/patient/medical-history/:section/:entryId
// Edit one patient-owned entry of the medical history.
// Params: section, entryId.
// Body: the same fields as the POST endpoint (all optional, at least one required).
// Returns: { status: 'success', message, data: { entry } }.
// 403 when the entry was created by a doctor, 404 when the entry does not exist.
// Requires authentication (patient role) and ownership of the entry.

// DELETE /api/patient/medical-history/:section/:entryId
// Remove one patient-owned entry of the medical history.
// Params: section, entryId.
// Returns: { status: 'success', message }.
// 403 when the entry was created by a doctor, 404 when the entry does not exist.
// Requires authentication (patient role) and ownership of the entry.

// The data deletion endpoints of the patient are declared once in routes/DeletionRequest/index.js:
//   POST  /api/deletion-requests
//   GET   /api/deletion-requests
//   GET   /api/deletion-requests/:id
//   PATCH /api/deletion-requests/:id/cancel
// The DeletionRequest module owns them — this module only links to them from the settings page.

// ==========================================
// MOUNTING (live)
// ==========================================
const router = require('express').Router();
router.use('/patient', require('./patient.render.js'));
// router.use('/api/patient', require('./patient.apis.js'));   // enable when patient.apis.js is implemented
module.exports = router;
