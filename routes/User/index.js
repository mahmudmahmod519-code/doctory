const router = require('express').Router();

router.use('/api/user', require('./User.apis.js'));
router.use('/user', require('./User.render.js'));

module.exports = router;
// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /user/profile
// Render the patient profile page.
// Shows user account details: name, email, phone, address, birth date, role, status.
// Requires authentication (patient role).
// Redirects to /auth/login if not logged in.

// GET /user/settings
// Render the user settings page.
// Allows editing personal data, changing password, enabling/disabling 2FA.
// Requires authentication.


// ==========================================
// API ROUTES (JSON)
// ==========================================

// PATCH /api/user/profile
// Update user profile data.
// Body: { name, email, phone, address, birth_date }
// Requires authentication (patient role).
// Returns updated user data (excluding password_hash).

// DELETE /api/user/account
// Soft delete user account.
// Sets deleted_at and deleted_by fields.
// Requires authentication (patient role).
// User data is preserved but hidden from lists.

// POST /api/user/upload-image
// Upload profile image.
// Body: multipart/form-data with image file.
// Image size limit: 5 MB. Allowed types: jpg, png, webp, pdf.
// Stores image and updates image_profile field on user.

// POST /api/user/2fa/enable
// Enable Two-Factor Authentication.
// Generates secure_key (TOTP secret) and sets enable_2fa = true.
// Returns QR code setup information for authenticator app.
// Requires authentication.

// POST /api/user/2fa/disable
// Disable Two-Factor Authentication.
// Sets enable_2fa = false and clears secure_key.
// Requires authentication.
// (Doctor and Admin roles require 2FA; cannot disable if role requires it.)

// POST /api/user/change-role
// Request role change from patient to doctor.
// Creates doctor registration request with pending verification status.
// Requires Egyptian Medical Syndicate ID upload.
// Admin reviews and approves/rejects the request.
// Returns pending status until admin approval.