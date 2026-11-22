// ==========================================
// MODULE: REVIEW
// Mounted in routes/index.js as:
//   app.use('/', require('./Review/index.js'))
// Internal mounting:
//   router.use('/api/reviews',         require('./Review.apis.js'));
//   router.use('/patient/review',      require('./Review.render.js'));
// Authentication: auth middleware (JWT via 'session_token' cookie)
// Roles: patient creates a review after a completed visit, doctor reads his own reviews,
//        admin moderates any review.
// Note: this file currently contains documentation only — the routers are not mounted yet.
// ==========================================

// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /patient/review/:bookingItemId
// Render the submit review page for a completed visit.
// Shows: the doctor name and the visit info, an interactive 5 stars rating widget,
// a comment textarea ("share your experience with the doctor") and the submit button.
// Includes the previous reviews of the doctor as a reference.
// Requires authentication (patient role) and ownership of the completed booking item.
// View file: views/patient/submit-review.ejs.

// GET /doctor/reviews
// Render the reviews received by the authenticated doctor.
// Shows the list of the patient reviews (rating, feedback, date) with the average rating summary
// and filters by rating value and date range.
// Requires authentication (doctor role).
// Note: this view is not created yet — the page is documented for completeness.


// ==========================================
// API ROUTES (JSON)
// ==========================================

// GET /api/reviews
// List reviews.
// Query: portfolio_id (filter by doctor), user_id (admin only), min_rating, max_rating,
// date_from, date_to, page, limit, sort, order.
// Returns: { items, page, limit, total } where each item holds review_id, portfolio_id, doctor_name,
// rating, feedback and created_at.
// The patient name is masked unless the caller is the author or an admin.
// Requires authentication (patient|doctor|admin).

// GET /api/reviews/:id
// Get one review.
// Params: id (review ObjectId).
// Returns: { status: 'success', data: { review } }.
// 404 when the review does not exist.
// Requires authentication (patient|doctor|admin).

// POST /api/reviews
// Create a review for a completed visit.
// Body: { portfolio_id (required), booking_item_id (required), rating (required, integer 1-5),
//         feedback (optional, max 1000 chars) }.
// Returns: { status: 'success', message, data: { review } }.
// Business rules:
// - A review can only be created for a completed booking item belonging to the authenticated patient.
// - One review per booking item — a duplicate is rejected with 409.
// - The doctor average rating is recalculated after the insert.
// - The doctor receives an in-app notification (system type).
// 400 on validation failure, 409 when a review already exists for that visit.
// Requires authentication (patient).

// PATCH /api/reviews/:id
// Update a review.
// Params: id (review ObjectId).
// Body: { rating (optional, 1-5), feedback (optional, max 1000) }.
// Returns: { status: 'success', message, data: { review } }.
// Business rules: only the author of the review or an admin can edit it;
// the doctor average rating is recalculated.
// 404 when the review does not exist, 403 when the caller is not the author.
// Requires authentication (patient|admin).

// DELETE /api/reviews/:id
// Soft delete a review.
// Params: id (review ObjectId).
// Returns: { status: 'success', message }.
// Business rules: the author or an admin can delete the review; the doctor average rating is recalculated.
// Requires authentication (patient|admin).

// GET /api/public/portfolios/:portfolioId/reviews
// Public reviews list of a doctor.
// Params: portfolioId (portfolio_id string).
// Query: page, limit, min_rating.
// Returns: { status: 'success', data: { items, page, limit, total, average_rating } }.
// The patient names are masked — only the first letter of the first name is kept.
// No authentication required.
