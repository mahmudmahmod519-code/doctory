// API routes (JSON). Mount at /api/auth.
const express = require('express');

const controller = require('../../controllers/auth.controller');
const { protect, twoFactorContext } = require('../../middleware/auth');
const {
  registerSchema,
  loginSchema,
  twoFactorSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
  validate
} = require('../../utils/validators/auth.validator');

const router = express.Router();

router.post('/register/patient', validate(registerSchema), controller.registerPatient);
router.post('/register/doctor', validate(registerSchema), controller.registerDoctor);
router.post('/login', validate(loginSchema), controller.login);

router.post('/2fa/setup', twoFactorContext, controller.setupTwoFactor);
router.post('/2fa/verify', validate(twoFactorSchema), twoFactorContext, controller.verifyTwoFactor);

router.post('/refresh', validate(refreshSchema), controller.refresh);
router.get('/me', protect, controller.me);
router.post('/logout', protect, controller.logout);

router.post('/forgot-password', validate(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), controller.resetPassword);
router.post('/change-password', protect, validate(changePasswordSchema), controller.changePassword);
router.post('/verify-email', validate(verifyEmailSchema), controller.verifyEmail);

module.exports = router;
