// ==========================================
// MODULE: DOCTOR WORK (DOCTOR SERVICES)
// Mounted in routes/index.js as:
//   app.use('/', require('./DoctorWork/index.js'))
// Internal mounting:
//   router.use('/api/doctor-works', require('./DoctorWork.apis.js'));
// Authentication: auth middleware (JWT via 'session_token' cookie)
// Roles: doctor creates and edits his own services, admin approves or rejects them.
// Note: this file currently contains documentation only — the routers are not mounted yet.
// ==========================================

// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /doctor/services
// Render the services management section of the doctor.
// Shows the list of the doctor services (title, description, price, duration, working time, approval status)
// with add, edit and delete actions and a status legend (pending / active / rejected).
// This page is the "services" tab of /doctor/portfolio and reuses the same view file.
// Requires authentication (doctor role).
// View file: views/doctor/portfolio-editor.ejs.


// ==========================================
// API ROUTES (JSON)
// ==========================================

// GET /api/doctor-works
// List doctor services.
// Query: status (pending|active|rejected), doctor_id (portfolio_id), q (title search),
// include_deleted, page, limit, sort, order.
// Returns: { items, page, limit, total } where each item holds work_id, title, description, price,
// duration_session, working_time, status, rejection reason and the doctor name.
// Doctors only receive their own services; admins receive all of them.
// Requires authentication (doctor|admin).

// GET /api/doctor-works/:id
// Get one doctor service.
// Params: id (work ObjectId).
// Returns: { status: 'success', data: { service } } with the full service record and the doctor summary.
// 404 when the service does not exist.
// Requires authentication (doctor|admin) with ownership or admin role.

// POST /api/doctor-works
// Create a new service for the authenticated doctor.
// Body: { title (required, 2-200 chars), price (optional, positive, max 100000),
//         description (optional, max 1000), duration_session (optional, integer minutes, 5-480),
//         working_time (optional, HH:mm) }.
// Returns: { status: 'success', message, data: { service } }.
// Business rules:
// - The service is linked to the portfolio of the authenticated doctor (taken from the session).
// - work_id is generated automatically (unique string).
// - The new service starts with status 'pending' and waits for an admin approval before it is public.
// - The admin is notified in-app about the new pending service.
// 400 on validation failure.
// Requires authentication (doctor).

// PATCH /api/doctor-works/:id
// Update one of the authenticated doctor's services.
// Params: id (work ObjectId).
// Body: { title, price, description, duration_session, working_time } (all optional).
// Returns: { status: 'success', message, data: { service } }.
// Business rules:
// - Only the owning doctor or an admin can edit the service.
// - Editing an active service keeps it active; editing a rejected service sends it back to 'pending'
//   for a new admin review.
// 404 when the service does not exist, 403 when the caller is not the owner.
// Requires authentication (doctor|admin) with ownership or admin role.

// PATCH /api/doctor-works/:id/status
// Change the approval status of a service.
// Params: id (work ObjectId).
// Body: { status: 'active'|'rejected' (required), reason (required when status is rejected, min 10 chars) }.
// Returns: { status: 'success', message, data: { service } }.
// Business rules:
// - Admin only — the doctor cannot approve his own service.
// - On approval the service becomes publicly bookable and the doctor is notified in-app.
// - On rejection the reason is stored, shown to the doctor and the service cannot be booked.
// 400 when the reason is missing, 409 when the service is already in the target status.
// Requires authentication (admin).

// DELETE /api/doctor-works/:id
// Soft delete a doctor service.
// Params: id (work ObjectId).
// Returns: { status: 'success', message, data: { service } }.
// Business rules: deleted_at is set and the service disappears from the public lists
// while the historical bookings keep their reference.
// Requires authentication (doctor|admin) with ownership or admin role.
