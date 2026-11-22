// ==========================================
// MODULE: STATIC (PUBLIC PAGES)
// Mounted in routes/index.js as:
//   app.use('/', require('./static/index.js'))
// Internal mounting:
//   router.use('/', require('./static.render.js'));
//   router.use('/api', require('./static.apis.js'));   // contact + public stats — not implemented yet
// Authentication: none — every page and endpoint of this module is public (guest accessible).
// Status: the RENDER routes are live; the JSON API routes below are documentation only.
// ==========================================

// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /                 — Home / landing page. Hero with doctor search, how it works, platform stats, call to action.
//                         View file: views/static/home.ejs.
// GET /about-us         — About the platform. View file: views/static/about.ejs.
// GET /contact-us       — Contact form (name, email, message). View file: views/static/contact.ejs.
// GET /faq              — Frequently asked questions (accordion). View file: views/static/faq.ejs.
// GET /privacy          — Privacy policy. View file: views/static/privacy.ejs.
// GET /terms            — Terms and conditions. View file: views/static/terms.ejs.
// GET /refund           — Refund policy. View file: views/static/refund.ejs.
// All pages receive the checkLogin() locals so the navbar shows the login state.

// ==========================================
// API ROUTES (JSON)
// ==========================================

// POST /api/contact
// Send a message from the contact form.
// Body: { name (required, 2-80 chars), email (required), message (required, 10-2000 chars) }.
// Returns 200: { status: 'success', message }.
// Business rules:
// - The message is emailed to the support address (Nodemailer) and never stored with the user's account.
// - Rate limited: 3 messages per hour per IP. The response never exposes the support address.
// - Today the contact page falls back to a mailto: link until this endpoint exists.
// 400 on validation failure, 429 when the limit is hit.
// No authentication required.

// GET /api/public/stats
// Public platform numbers shown on the home page (doctors, completed bookings, average saved waiting minutes).
// Returns: { status: 'success', data: { doctors_count, bookings_count, avg_saved_minutes } }.
// Counts only active doctors and completed bookings; cached for 10 minutes. No personal data.
// No authentication required.

const router = require("express").Router();

router.use('/', require('./static.render.js'));

module.exports = router;