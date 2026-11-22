const router = require('express').Router();
const catchError = require('../../utils/catchError');
const c = require('../../logicModels/auth/auth.render');

router.get('/signup-options', catchError(c.getSignupOptionsRender));
router.get('/login', catchError(c.getLoginRender));
router.get('/register/patient', catchError(c.getRegisterPatientRender));
router.get('/register/doctor', catchError(c.getRegisterDoctorRender));
router.get('/forgot-password', catchError(c.getForgotPasswordRender));
router.get('/reset-password/:token', catchError(c.getResetPasswordRender));
router.get('/verify-email/:token', catchError(c.getEmailVerificationRender));
router.get('/2fa/verify', catchError(c.get2faVerifyRender));

module.exports = router;
