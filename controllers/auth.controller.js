const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const cookies = require('../controllers/auth.cookies');

const publicUser = (user) => ({
  user_id: user.user_id,
  name: user.name,
  email: user.email,
  role: user.role
});

// POST /register/patient
const registerPatient = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.register('patient', req.body);
  cookies.setSessionCookies(res, tokens);
  res.status(201).json({ status: 'success', data: { user: publicUser(user) } });
});

// POST /register/doctor
const registerDoctor = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.register('doctor', req.body);
  cookies.setSessionCookies(res, tokens);
  res.status(201).json({ status: 'success', data: { user: publicUser(user) } });
});

// POST /login
const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  if (result.requiresTwoFactor) {
    cookies.setTwoFactorCookie(res, result.twoFactorToken);
    return res.status(200).json({
      status: 'success',
      requires_2fa: true,
      requires_2fa_setup: result.requiresTwoFactorSetup
    });
  }

  cookies.setSessionCookies(res, result.tokens);
  return res.status(200).json({ status: 'success', data: { user: publicUser(result.user) } });
});

// POST /2fa/setup
const setupTwoFactor = asyncHandler(async (req, res) => {
  const data = await authService.setupTwoFactor(req.user);
  res.status(200).json({ status: 'success', data });
});

// POST /2fa/verify
const verifyTwoFactor = asyncHandler(async (req, res) => {
  await authService.verifyTwoFactorCode(req.user, req.body.token);

  // Login flow: the code was the second step, so start the session now
  if (req.twoFactorPending) {
    const tokens = await authService.completeTwoFactorLogin(req.user);
    cookies.clearTwoFactorCookie(res);
    cookies.setSessionCookies(res, tokens);
    return res.status(200).json({ status: 'success', data: { user: publicUser(req.user) } });
  }

  return res.status(200).json({ status: 'success', message: 'Two-factor code verified' });
});

// POST /refresh
const refresh = asyncHandler(async (req, res) => {
  const refreshToken = cookies.getCookie(req, cookies.REFRESH_COOKIE) || req.body.refresh_token;
  const accessToken = await authService.refresh(refreshToken);
  cookies.setAccessCookie(res, accessToken);
  res.status(200).json({ status: 'success', message: 'Access token refreshed' });
});

// GET /me
const me = (req, res) => {
  const { user_id, name, email, role, status, email_verified, enable_2fa } = req.user;
  res.status(200).json({
    status: 'success',
    data: { user: { user_id, name, email, role, status, email_verified, enable_2fa } }
  });
};

// POST /logout
const logout = asyncHandler(async (req, res) => {
  await authService.logout({
    accessToken: req.token,
    accessExp: req.tokenExp,
    refreshToken: cookies.getCookie(req, cookies.REFRESH_COOKIE)
  });
  cookies.clearAuthCookies(res);
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
});

// POST /forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body);
  res.status(200).json({
    status: 'success',
    message: 'If an account exists for this email, a reset link has been sent'
  });
});

// POST /reset-password
const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  res.status(200).json({
    status: 'success',
    message: 'Password has been reset, please login with your new password'
  });
});

// POST /change-password
const changePassword = asyncHandler(async (req, res) => {
  const tokens = await authService.changePassword(req.user, req.body, req.token, req.tokenExp);
  cookies.setSessionCookies(res, tokens);
  res.status(200).json({ status: 'success', message: 'Password changed successfully' });
});

// POST /verify-email
const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.body);
  res.status(200).json({ status: 'success', message: 'Email verified successfully' });
});

module.exports = {
  registerPatient,
  registerDoctor,
  login,
  setupTwoFactor,
  verifyTwoFactor,
  refresh,
  me,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail
};
