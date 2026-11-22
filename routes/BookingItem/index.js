// ==========================================
// MODULE: BOOKING ITEM
// Mounted in routes/index.js as:
//   app.use('/', require('./BookingItem/index.js'))
// Internal mounting:
//   router.use('/api/booking-items', require('./BookingItem.apis.js'));
// Authentication: auth middleware (JWT via 'session_token' cookie)
// Roles: patient for confirm / decline, doctor for the clinical actions, admin for the full control.
// Note: this file currently contains documentation only — the routers are not mounted yet.
// ==========================================

// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /patient/queue/:bookingItemId
// Render the live queue page of one booking item.
// Shows: the queue number of the patient, the number currently being served, the number of patients ahead,
// the estimated wait in minutes and a progress bar of the position in the queue.
// The page polls the queue API to refresh automatically and never calls the prediction model again.
// Requires authentication (patient role) and ownership of the booking item.
// View file: views/patient/waiting-queue.ejs (shared with routes/patient/index.js).


// ==========================================
// API ROUTES (JSON)
// ==========================================

// GET /api/booking-items
// List booking items.
// Query: booking_id (optional filter), user_id (admin only), status
// (pending|accepted|rejected|completed|cancelled), doctor_id, date_from, date_to, page, limit, sort, order.
// Returns: { items, page, limit, total } where each item holds booking_item_id, booking_id, queue_number,
// patient name, phone, age, status, type and the AI prediction snapshot.
// Patients only receive their own items; doctors only receive the items of their own sessions.
// Requires authentication (patient|doctor|admin).

// GET /api/booking-items/:id
// Get one booking item with its prediction snapshot and outcome fields.
// Params: id (booking item ObjectId).
// Returns: { status: 'success', data: { booking_item } }.
// 404 when the item does not exist or is not visible to the caller.
// Requires authentication (patient|doctor|admin) with ownership or admin role.

// POST /api/booking-items
// Add a patient to a booking session (create a queue entry).
// Body: { booking_id (required), user_id (required — admin only, optional for the patient himself),
//         queue_number (required), patient_name, patient_phone, patient_age, patient_address,
//         type: 'booking'|'consulting' (required),
//         problem_description (optional), visit_reason_category (optional), chronic_conditions (optional),
//         consent (required when the AI prediction is enabled) }.
// Returns: { status: 'success', message, data: { booking_item, prediction } }.
// Business rules:
// - The session must be active and must not be full (total_patients limit).
// - queue_number must be unique inside the session — duplicates are rejected with 409.
// - The AI prediction service is called through services/aiService.js; on failure the item is created
//   with prediction.status = 'fallback' and the default service duration.
// - The AI result never bypasses the capacity, duplicate-booking or queue validations.
// 400 on validation failure, 409 when the session is full or the queue number is taken.
// Requires authentication (patient|doctor|admin).

// PATCH /api/booking-items/:id
// Update a patient entry inside a booking session.
// Params: id (booking item ObjectId).
// Body: { status (optional), queue_number (optional) }.
// status: pending | accepted | rejected | completed | cancelled.
// Returns: { status: 'success', message, data: { booking_item } }.
// Business rules:
// - queue_number must stay unique inside the session.
// - When status becomes 'completed' the completed_at timestamp and the actual duration are recorded
//   (the actual duration feeds the retraining labels of the AI model).
// - When status becomes 'accepted' the patient is notified in-app and by critical email.
// 404 when the item does not exist, 409 when the queue number is taken.
// Requires authentication (doctor|admin) with ownership or admin role.

// PATCH /api/booking-items/:id/complete
// Complete a consultation and record the real outcome.
// Params: id (booking item ObjectId).
// Body: { actual_started_at (optional ISO), actual_ended_at (optional ISO),
//         actual_duration_minutes (optional number — computed from the timestamps when missing),
//         no_show (optional boolean, default false) }.
// Returns: { status: 'success', message, data: { booking_item } }.
// Business rules:
// - Only accepted items can be completed.
// - The actual duration and the no-show flag are the training labels used later to retrain the model.
// - A report record is created or updated from the visit data.
// - The patient receives an in-app notification (turn completed).
// 404 when the item does not exist, 409 when the item is not in the accepted state.
// Requires authentication (doctor|admin) with ownership or admin role.

// PATCH /api/booking-items/:id/no-show
// Mark a patient as a no-show.
// Params: id (booking item ObjectId).
// Body: { reason (optional, max 500 chars) }.
// Returns: { status: 'success', message, data: { booking_item } }.
// Business rules:
// - The item becomes 'cancelled' with no_show = true and the reason is stored.
// - The slot is freed and the next patient is notified.
// - The no-show flag is a training label for the AI no-show model.
// Requires authentication (doctor|admin) with ownership or admin role.

// DELETE /api/booking-items/:id
// Soft delete a patient entry from a booking session.
// Params: id (booking item ObjectId).
// Returns: { status: 'success', message, data: { booking_item } }.
// Business rules: deleted_at is set; the patient moves to the "removed" group of the waiting list
// and disappears from the queue without losing the historical record.
// Requires authentication (admin).

// PATCH /api/booking-items/:id/restore
// Restore a soft-deleted booking item.
// Params: id (booking item ObjectId).
// Returns: { status: 'success', message, data: { booking_item } }.
// Business rules:
// - 409 when the parent session is cancelled or already full.
// - The queue number is checked against the other active items of the session.
// Requires authentication (admin).
