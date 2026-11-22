// ==========================================
// MODULE: REPORT
// Mounted in routes/index.js as:
//   app.use('/', require('./Report/index.js'))
// Internal mounting:
//   router.use('/api/reports',              require('./Report.apis.js'));
//   router.use('/patient/medical-report',   require('./Report.render.js'));
// Authentication: auth middleware (JWT via 'session_token' cookie)
// Privacy: the medical report content is never exposed to the admin role (count only).
// Note: this file currently contains documentation only — the routers are not mounted yet.
// ==========================================

// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /patient/medical-report/:id
// Render the medical report page.
// Shows: the doctor information (name, specialty), the visit date, the symptoms,
// the diagnosis, the prescription (medicines with dosage and instructions) and the doctor notes.
// Includes a print / download button and the clinic header.
// Requires authentication (patient role) and ownership of the report.
// View file: views/patient/medical-report.ejs.

// GET /doctor/reports/:id
// Render the medical report page for the treating doctor.
// Shows the same content as the patient view with the edit controls for the diagnosis,
// the prescription and the doctor notes.
// Requires authentication (doctor role) and the doctor must be the treating doctor of that report.
// Note: this view is not created yet — the page is documented for completeness.


// ==========================================
// API ROUTES (JSON)
// ==========================================

// GET /api/reports
// List medical reports.
// Query: user_id (patient — always forced to the authenticated user), portfolio_id (doctor),
// date_from, date_to, page, limit, sort, order.
// Returns: { items, page, limit, total } where each item holds report_id, doctor, specialty,
// visit_date and a summary — the full medical content is never included in the list.
// The admin role receives the reports count only, never the content.
// Requires authentication (patient|doctor|admin).

// GET /api/reports/:id
// Get one medical report with its full content.
// Params: id (report ObjectId).
// Returns: { status: 'success', data: { report } } with description, medicines[], doctor information
// and the visit date.
// 404 when the report does not exist, 403 when the caller is not the patient, the treating doctor or an admin.
// Requires authentication (patient|doctor|admin) with ownership or admin role.

// POST /api/reports
// Create a medical report for a visit.
// Body: { user_id (required — the patient), portfolio_id (required — the doctor),
//         description (optional, max 2000), medicines: [{ name, dosage, frequency, duration, instructions }]
//         (optional, max 50 items) }.
// Returns: { status: 'success', message, data: { report } }.
// Business rules:
// - Only the treating doctor can create the report of his own visit.
// - The report becomes visible to the patient and the patient is notified in-app.
// - The same record is used as the source of the medical history shown to the next doctor.
// 400 on validation failure, 403 when the caller is not the treating doctor.
// Requires authentication (doctor).

// PATCH /api/reports/:id
// Update a medical report.
// Params: id (report ObjectId).
// Body: { description (optional, max 2000), medicines (optional, max 50 items) }.
// Returns: { status: 'success', message, data: { report } }.
// Business rules: only the treating doctor can update the report;
// the patient is notified.
// 404 when the report does not exist, 403 when the caller is not the treating doctor.
// Requires authentication (doctor) with ownership or admin role.

// DELETE /api/reports/:id
// Soft delete a medical report.
// Params: id (report ObjectId).
// Returns: { status: 'success', message }.
// Business rules: only an admin can delete a medical report — this is the medical record of the patient
// and the doctor cannot remove it.
// Requires authentication (admin).

// GET /api/reports/:id/download
// Download the medical report as a PDF or a printable document.
// Params: id (report ObjectId).
// Returns: the report file (application/pdf) or the printable HTML version.
// 404 when the report does not exist, 403 when the caller is not allowed to read the medical content.
// Requires authentication (patient|doctor) with ownership.
