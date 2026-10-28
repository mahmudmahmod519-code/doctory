const router = require('express').Router();

const auth = require('../../middleware/auth');
const roles = require('../../middleware/roles');
const validate = require('../../middleware/validate');
const upload = require('../../middleware/upload');
const catchError = require('../../utils/catchError');
const controller = require('../../logicModels/User/User.controller');
const { updateProfileSchema } = require('../../utils/validation');

// PATCH /api/user/profile
// Update user profile data: name, email, phone, address, birth_date.
// Requires authentication (patient role).
// Body is validated against updateProfileSchema before reaching the controller.
// Returns updated user data (excluding password_hash).
router.patch('/profile', auth, roles('patient'), validate(updateProfileSchema), catchError(controller.updateProfile));

// DELETE /api/user/account
// Soft delete the user's own account.
// Sets deleted_at and deleted_by fields — data is preserved but hidden from lists.
// Requires authentication (patient role).
router.delete('/account', auth, roles('patient'), catchError(controller.deleteAccount));

// POST /api/user/upload-image
// Upload a profile image (multipart/form-data, field name: 'image').
// Max size: 5MB. Allowed types: jpg, png, webp, pdf (enforced by upload middleware).
// Stores the image and updates the image_profile field on the user.
// Requires authentication.
router.post('/upload-image', auth, upload.single('image'), catchError(controller.uploadImage));

// POST /api/user/2fa/enable
// Enable Two-Factor Authentication (TOTP).
// Generates a secure_key and sets enable_2fa = true.
// Returns QR code setup information for the authenticator app.
// Requires authentication.
router.post('/2fa/enable', auth, catchError(controller.enable2fa));

// POST /api/user/2fa/disable
// Disable Two-Factor Authentication.
// Sets enable_2fa = false and clears the secure_key.
// Note: Doctor and Admin roles cannot disable 2FA (enforced in the controller).
// Requires authentication.
router.post('/2fa/disable', auth, catchError(controller.disable2fa));

// POST /api/user/change-role
// Request a role change from patient to doctor.
// Requires an Egyptian Medical Syndicate ID image upload (field name: 'medical_id').
// Creates a pending doctor registration request for admin review.
// Returns pending status until the admin approves or rejects.
// Requires authentication (patient role).
router.post('/change-role', auth, roles('patient'), upload.single('medical_id'), catchError(controller.changeRole));

module.exports = router;
