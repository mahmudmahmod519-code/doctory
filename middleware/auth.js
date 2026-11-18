const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User.entity');
const authService = require('../services/auth.service');
const { ACCESS_COOKIE, TWO_FACTOR_COOKIE, getCookie } = require('../controllers/auth.cookies');

// Reads the access token from the HTTP-only cookie, or from a Bearer header (API clients)
const getAccessToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }
  return getCookie(req, ACCESS_COOKIE);
};

// Verifies the access token and attaches the user to req.user
const protect = asyncHandler(async (req, res, next) => {
  const token = getAccessToken(req);
  if (!token) {
    throw new ApiError('You are not logged in, please login to get access', 401);
  }

  // Throws JsonWebTokenError / TokenExpiredError, which the global handler maps to 401
  const decoded = authService.verifyToken(token, 'access');

  if (await authService.isTokenBlacklisted(token)) {
    throw new ApiError('Token is no longer valid, please login again', 401);
  }

  const user = await User.findOne({ _id: decoded.id, deleted_at: null }).select('-password_hash');
  if (!user) {
    throw new ApiError('The user belonging to this token no longer exists', 401);
  }

  if (authService.passwordChangedAfter(user, decoded.iat)) {
    throw new ApiError('Password was changed recently, please login again', 401);
  }

  if (user.status === 'suspended') {
    throw new ApiError('Your account has been suspended', 403);
  }

  req.user = user;
  req.token = token;
  req.tokenExp = decoded.exp;
  next();
});

// For the 2FA endpoints: accepts the short-lived cookie set after the password step,
// otherwise falls back to a normal logged-in session (e.g. a patient turning 2FA on).
const twoFactorContext = asyncHandler(async (req, res, next) => {
  const pending = getCookie(req, TWO_FACTOR_COOKIE);

  if (pending) {
    try {
      const decoded = authService.verifyToken(pending, '2fa');
      const user = await User.findOne({ _id: decoded.id, deleted_at: null }).select(
        '-password_hash'
      );
      if (user && user.status !== 'suspended') {
        req.user = user;
        req.twoFactorPending = true;
        return next();
      }
    } catch (err) {
      // Invalid or expired pending token: try a normal session below
    }
  }

  return protect(req, res, next);
});

// Reserved for future approval logic. Intentionally empty for now: do not apply to routes yet.
const requireApproved = (req, res, next) => {};

// Restricts access to the given roles
const allowedTo =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError('You are not allowed to access this route', 403));
    }
    return next();
  };

module.exports = {
  protect,
  twoFactorContext,
  requireApproved,
  allowedTo,
  getAccessToken
};
