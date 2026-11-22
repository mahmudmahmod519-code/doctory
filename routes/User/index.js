// ==========================================
// MODULE: USER
// Mounted in routes/index.js as:
//   app.use('/', require('./User/index.js'))
// Internal mounting:
//   router.use('/api/user', require('./User.apis.js'));
//   router.use('/user',     require('./User.render.js'));
// Authentication: auth middleware (JWT via 'session_token' cookie)
// Roles: patient for the profile and account actions, any role for the settings page.
// Status: this module is IMPLEMENTED — User.apis.js and User.render.js contain working routes.
// ==========================================

// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /user/profile
// Render the patient profile page.
// Shows the account details: name, email, phone, address, birth date, role and status.
// Requires authentication (patient role). Redirects to /auth/login when not logged in.
// View file: views/patient/settings.ejs (rendered with pageTitle = 'الملف الشخصي').

// GET /user/settings
// Render the user settings page.
// Allows editing the personal data, changing the password and enabling / disabling the 2FA.
// Requires authentication (any role).
// View file: views/patient/settings.ejs (rendered with pageTitle = 'الإعدادات').


// ==========================================
// API ROUTES (JSON)
// ==========================================

// PATCH /api/user/profile
// Update the user profile data: name, email, phone, address, birth_date.
// Body: { name, email, phone, address, birth_date } (all optional, at least one field required).
// Returns 200: { status: 'success', message, data: { user } } without the password_hash.
// Business rules:
// - Only the fields of the allowed list are applied; every other field is ignored.
// - The email is lowercased and must stay unique — an existing email returns 409.
// - The validation is applied through the Joi schema updateProfileSchema before the controller.
// 400 when no field is provided or the validation fails, 409 when the email is taken.
// Requires authentication (patient role).

// DELETE /api/user/account
// Soft delete the account of the authenticated user.
// Body: none.
// Returns 200: { status: 'success', message }.
// Business rules:
// - deleted_at and deleted_by are set — the data is preserved but hidden from every list.
// - The session cookie is cleared and the refresh tokens are revoked.
// Requires authentication (patient role).

// POST /api/user/upload-image
// Upload the profile image.
// Body: multipart/form-data with one file field named 'image'.
// Max size: 5MB. Allowed types: jpg, png, webp, pdf (enforced by the upload middleware).
// Returns 200: { status: 'success', message, data: { image_profile } } with the public path /uploads/<filename>.
// Business rules: the file is stored in public/uploads and the image_profile field is updated on the user.
// 400 when no file is sent.
// Requires authentication (any role).

// POST /api/user/2fa/enable
// Enable the two-factor authentication (TOTP).
// Body: none.
// Returns 200: { status: 'success', message, data: { secret, otpauth_url } }.
// Business rules:
// - A TOTP secret is generated with speakeasy and stored in secure_key, and enable_2fa is set to true.
// - The otpauth_url is used by the frontend to render the QR code of the authenticator app.
// - The doctor and admin roles cannot disable the 2FA afterwards.
// 400 when the 2FA is already enabled.
// Requires authentication (any role).

// POST /api/user/2fa/disable
// Disable the two-factor authentication.
// Body: none.
// Returns 200: { status: 'success', message }.
// Business rules: enable_2fa is set to false and secure_key is cleared;
// the doctor and admin roles are rejected with 403 because the 2FA is mandatory for them.
// 403 for the doctor and admin roles.
// Requires authentication (any role).

// POST /api/user/change-role
// Request a role change from patient to doctor.
// Body: multipart/form-data with the Egyptian Medical Syndicate ID file (field name: 'medical_id').
// Returns 200: { status: 'success', message, data: { request } }.
// Business rules:
// - A doctor registration request is created with the pending verification status.
// - The admin reviews the Medical ID and approves or rejects the request.
// - The status stays pending until the admin decision.
// Status: the controller currently returns 501 Not Implemented — the doctor-verification design is pending.
// Requires authentication (patient role).
