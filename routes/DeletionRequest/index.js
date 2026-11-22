// ==========================================
// MODULE: DELETION REQUEST
// Mounted in routes/index.js as:
//   app.use('/', require('./DeletionRequest/index.js'))
// Internal mounting:
//   router.use('/api/deletion-requests', require('./DeletionRequest.apis.js'));
// Authentication: auth middleware (JWT via 'session_token' cookie)
// Legal: Egyptian data protection law 151/2020 — approved requests are the only exception
//         to the soft-delete pattern used everywhere else in the project.
// Note: this file currently contains documentation only — the routers are not mounted yet.
// ==========================================

// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /patient/deletion-requests
// Render the data deletion requests page of the patient.
// Shows: the list of the deletion requests of the authenticated patient with the status
// (pending / approved / rejected), the requested date, the reason and the review date.
// Includes a button to submit a new request and to cancel a pending one.
// Requires authentication (patient role).
// Note: this view is not created yet — the page is documented for completeness.


// ==========================================
// API ROUTES (JSON)
// ==========================================

// POST /api/deletion-requests
// Submit a request to permanently delete the authenticated patient's personal data.
// Body: { reason (optional, max 500 chars) }.
// Returns: { status: 'success', message, data: { deletion_request } }.
// Business rules:
// - Only one open (pending) request is allowed per user — a second request returns 409.
// - The request does not delete anything by itself; it creates a review task for the admin.
// - The patient receives an in-app notification (deletion_request_update) when the request is decided.
// 409 when a pending request already exists.
// Requires authentication (patient).

// GET /api/deletion-requests
// List the deletion requests of the authenticated patient.
// Query: status (pending|approved|rejected), page, limit.
// Returns: { items, page, limit, total } with status, reason, requested_at, reviewed_at and reviewed_by.
// Requires authentication (patient).

// GET /api/deletion-requests/:id
// Get one deletion request of the authenticated patient.
// Params: id (deletion request ObjectId).
// Returns: { status: 'success', data: { deletion_request } }.
// 404 when the request does not exist or belongs to another user.
// Requires authentication (patient) and ownership of the request.

// PATCH /api/deletion-requests/:id/cancel
// Cancel a pending deletion request.
// Params: id (deletion request ObjectId).
// Body: none.
// Returns: { status: 'success', message, data: { deletion_request } }.
// Business rules: only a pending request can be cancelled and only by its owner;
// 409 when the request was already decided.
// Requires authentication (patient) and ownership of the request.

// The admin side of this module (list the requests + approve / reject a request) is declared once
// in routes/admin/index.js:
//   GET   /api/admin/deletion-requests
//   PATCH /api/admin/deletion-requests/:id
// Both modules write to the same collection — the admin endpoints stay in the admin module
// so there is a single canonical declaration per path.
