// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /auth/login
// Render the login page for guests.
// Shows email/password fields and links to register or forgot password.
// Redirects to / if user is already logged in.

// GET /auth/register/patient
// Render the patient registration form (guest only).
// Fields: name, email, password, phone.
// Redirects to / if user is already logged in.

// GET /auth/register/doctor
// Render the doctor registration form (guest only).
// Fields: name, email, password, phone, specialty, working hours.
// Requires Medical ID image upload (image_profile required).
// Redirects to / if user is already logged in.

// GET /auth/forgot-password
// Render the forgot password page (guest only).
// Field: email. Sends reset link to email on submit.

// GET /auth/reset-password/:token
// Render the reset password page (guest only).
// Requires valid reset token from email link.
// Fields: new password, confirm password.

// GET /auth/verify-email/:token
// Render email verification page (guest only).
// Requires valid verification token from email link.

// GET /auth/2fa/verify
// Render the 2FA verification page (guest/login flow).
// Requires authenticator app code entry.
// Shown when 2FA is required for the user role (doctor/admin mandatory).


// ==========================================
// API ROUTES (JSON)
// ==========================================

// POST /api/auth/register/patient
// Register a new patient account.
// Body: { name, email, password, phone }
// Creates user with role='patient', status='active'.
// Returns JWT Access + Refresh tokens in HTTP-Only Cookies.

// POST /api/auth/register/doctor
// Register a new doctor account.
// Body: { name, email, password, phone, specialty, working_hours, medical_id_image }
// Creates user with role='doctor', status='pending'.
// Requires admin verification of Medical ID before protected features unlock.
// Returns JWT Access + Refresh tokens in HTTP-Only Cookies.

// POST /api/auth/login
// Authenticate user and issue JWT tokens.
// Body: { email, password }
// On success: sets session_token (Access JWT) and refresh_token cookies.
// Returns user data: { user_id, name, email, role }.
// Redirects or returns 401/403 on failure.

// POST /api/auth/2fa/verify
// Verify TOTP code from authenticator app.
// Body: { token }
// Required for Doctor and Admin roles (mandatory), optional for Patient.
// Returns success if code is valid.

// POST /api/auth/refresh
// Issue a new Access Token using valid Refresh Token.
// Body: { refresh_token } or read from HTTP-Only Cookie.
// Returns new Access Token in cookie.

// GET /api/auth/me
// Get current authenticated user information.
// Requires valid JWT cookie.
// Returns: { user_id, name, email, role, status, email_verified, enable_2fa }

// POST /api/auth/logout
// Revoke Refresh Token and clear HTTP-Only cookies.
// Requires authentication.
// Returns success message.

// POST /api/auth/forgot-password
// Start password reset flow.
// Body: { email }
// Sends reset link to email if account exists.
// Always returns success (does not reveal if email exists).

// POST /api/auth/reset-password
// Set new password using reset token.
// Body: { token, new_password }
// Token must be valid and not expired (1 hour expiry).
// Updates password_hash and clears token.

// POST /api/auth/change-password
// Change password from Settings (authenticated only).
// Body: { current_password, new_password }
// Verifies current password before updating.
// Requires JWT authentication.

// POST /api/auth/verify-email
// Confirm account email address.
// Body: { token }
// Verifies email_verified flag on user account.