const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');

const User = require('../models/User.entity');
const TokenBlacklist = require('../models/TokenBlacklist');
const RefreshToken = require('../models/RefreshToken');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');

const SALT_ROUNDS = 12;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const JWT_ALGORITHM = 'HS256';
const TWO_FACTOR_TOKEN_TTL = '5m';
const TWO_FACTOR_REQUIRED_ROLES = ['doctor', 'admin'];

// Used to keep login timing similar when the email does not exist
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', SALT_ROUNDS);

// ---------- helpers ----------

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const hashToken = sha256;

const getJwtConfig = () => {
  const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
  if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined in environment variables');
  }
  return {
    accessSecret: JWT_SECRET,
    accessExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  };
};

// Base URL of the frontend app (Angular/React). Email links point to its routes.
const getFrontendUrl = () =>
  (process.env.FRONTEND_URL || 'http://localhost:4200').replace(/\/$/, '');

const sanitizeUser = (user) => {
  const obj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete obj.password_hash;
  delete obj.token;
  delete obj.secure_key;
  delete obj.password_reset_token;
  delete obj.password_reset_expires;
  delete obj.email_verification_token;
  delete obj.email_verification_expires;
  delete obj.__v;
  return obj;
};

const isTwoFactorRequired = (user) =>
  user.enable_2fa === true || TWO_FACTOR_REQUIRED_ROLES.includes(user.role);

const passwordChangedAfter = (user, iat) =>
  Boolean(user.password_changed_at) &&
  Math.floor(user.password_changed_at.getTime() / 1000) > iat;

// ---------- tokens ----------

const signToken = (userId, type, secret, expiresIn) =>
  jwt.sign({ id: String(userId), type, jti: crypto.randomUUID() }, secret, {
    expiresIn,
    algorithm: JWT_ALGORITHM
  });

// Access token (short-lived)
const generateToken = (userId) => {
  const { accessSecret, accessExpiresIn } = getJwtConfig();
  return signToken(userId, 'access', accessSecret, accessExpiresIn);
};

const generateRefreshToken = (userId) => {
  const { refreshSecret, refreshExpiresIn } = getJwtConfig();
  return signToken(userId, 'refresh', refreshSecret, refreshExpiresIn);
};

// Short-lived token proving the password step passed; only usable on the 2FA endpoints
const generateTwoFactorToken = (userId) => {
  const { accessSecret } = getJwtConfig();
  return signToken(userId, '2fa', accessSecret, TWO_FACTOR_TOKEN_TTL);
};

// type: 'access' | 'refresh' | '2fa'. Tokens of one type can never be used as another.
const verifyToken = (token, type = 'access') => {
  const { accessSecret, refreshSecret } = getJwtConfig();
  const decoded = jwt.verify(token, type === 'refresh' ? refreshSecret : accessSecret, {
    algorithms: [JWT_ALGORITHM]
  });
  if (decoded.type !== type) {
    throw new ApiError('Invalid token, please login again', 401);
  }
  return decoded;
};

const isTokenBlacklisted = async (token) => {
  const found = await TokenBlacklist.exists({ token_hash: hashToken(token) });
  return Boolean(found);
};

const blacklistToken = async (token, expSeconds) => {
  try {
    await TokenBlacklist.create({
      token_hash: hashToken(token),
      expires_at: new Date(expSeconds * 1000)
    });
  } catch (err) {
    // Already blacklisted: not an error
    if (err.code !== 11000) throw err;
  }
};

// Creates an access + refresh token pair and stores the refresh token
const issueSession = async (user) => {
  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  const { exp } = jwt.decode(refreshToken);

  await RefreshToken.create({
    user: user._id,
    token_hash: hashToken(refreshToken),
    expires_at: new Date(exp * 1000)
  });

  return { accessToken, refreshToken };
};

const touchLastLogin = (userId) =>
  User.updateOne({ _id: userId }, { last_login: new Date() });

// ---------- email links ----------

const sendVerificationEmail = (email, rawToken) =>
  sendEmail({
    to: email,
    subject: 'Verify your email address',
    text: `Please verify your email by opening this link: ${getFrontendUrl()}/auth/verify-email/${rawToken}\nThe link expires in 24 hours.`
  }).catch((err) => console.error('Failed to send verification email:', err.message));

// ---------- registration ----------

// role is fixed by the route: patients are active, doctors wait as pending
const register = async (role, { name, email, password, phone }) => {
  if (await User.exists({ email })) {
    throw new ApiError('Email is already registered', 409);
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const rawVerifyToken = crypto.randomBytes(32).toString('hex');

  let user;
  try {
    user = await User.create({
      user_id: crypto.randomUUID(),
      role,
      status: role === 'doctor' ? 'pending' : 'active',
      name,
      email,
      password_hash,
      phone,
      email_verification_token: hashToken(rawVerifyToken),
      email_verification_expires: new Date(Date.now() + VERIFY_TOKEN_TTL_MS)
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError('Email is already registered', 409);
    }
    throw err;
  }

  // Not awaited: a slow mail server should not delay registration
  sendVerificationEmail(user.email, rawVerifyToken);

  const tokens = await issueSession(user);
  await touchLastLogin(user._id);
  return { user: sanitizeUser(user), tokens };
};

// ---------- login ----------

const login = async ({ email, password }) => {
  const user = await User.findOne({ email, deleted_at: null });

  const passwordMatches = await bcrypt.compare(
    password,
    user ? user.password_hash : DUMMY_HASH
  );

  if (!user || !passwordMatches) {
    throw new ApiError('Incorrect email or password', 401);
  }

  if (user.status === 'suspended') {
    throw new ApiError('Your account has been suspended', 403);
  }

  if (isTwoFactorRequired(user)) {
    return {
      user: sanitizeUser(user),
      requiresTwoFactor: true,
      // The user still has to scan a secret first if 2FA was never enabled
      requiresTwoFactorSetup: !user.enable_2fa,
      twoFactorToken: generateTwoFactorToken(user._id)
    };
  }

  const tokens = await issueSession(user);
  await touchLastLogin(user._id);
  return { user: sanitizeUser(user), tokens };
};

// ---------- two-factor (TOTP) ----------

// Generates a secret and stores it. 2FA only turns on after the first valid code.
const setupTwoFactor = async (user) => {
  if (user.enable_2fa) {
    throw new ApiError('Two-factor authentication is already enabled', 400);
  }

  const secret = speakeasy.generateSecret({ length: 20 });
  await User.updateOne({ _id: user._id }, { secure_key: secret.base32 });

  return {
    secret: secret.base32,
    otpauth_url: speakeasy.otpauthURL({
      secret: secret.base32,
      label: user.email,
      issuer: 'Doctory',
      encoding: 'base32'
    })
  };
};

// Validates a 6-digit code. Turns 2FA on the first time it succeeds.
const verifyTwoFactorCode = async (user, code) => {
  if (!user.secure_key) {
    throw new ApiError('Two-factor authentication is not set up for this account', 400);
  }

  const valid = speakeasy.totp.verify({
    secret: user.secure_key,
    encoding: 'base32',
    token: code,
    window: 1
  });
  if (!valid) {
    throw new ApiError('Invalid authentication code', 401);
  }

  if (!user.enable_2fa) {
    await User.updateOne({ _id: user._id }, { enable_2fa: true });
  }
};

// Called after a valid code during login: starts the real session
const completeTwoFactorLogin = async (user) => {
  const tokens = await issueSession(user);
  await touchLastLogin(user._id);
  return tokens;
};

// ---------- refresh / logout ----------

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError('Refresh token is required', 401);
  }

  const decoded = verifyToken(refreshToken, 'refresh');
  const stored = await RefreshToken.findOne({ token_hash: hashToken(refreshToken) });
  if (!stored) {
    throw new ApiError('Refresh token is no longer valid, please login again', 401);
  }

  const user = await User.findOne({ _id: decoded.id, deleted_at: null });
  if (!user || passwordChangedAfter(user, decoded.iat)) {
    await RefreshToken.deleteOne({ token_hash: hashToken(refreshToken) });
    throw new ApiError('Refresh token is no longer valid, please login again', 401);
  }
  if (user.status === 'suspended') {
    throw new ApiError('Your account has been suspended', 403);
  }

  return generateToken(user._id);
};

const logout = async ({ accessToken, accessExp, refreshToken }) => {
  await blacklistToken(accessToken, accessExp);
  if (refreshToken) {
    await RefreshToken.deleteOne({ token_hash: hashToken(refreshToken) });
  }
};

// ---------- password reset (emailed link) ----------

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email, deleted_at: null });
  // Same response whether or not the account exists
  if (!user) return;

  const rawToken = crypto.randomBytes(32).toString('hex');
  await User.updateOne(
    { _id: user._id },
    {
      password_reset_token: hashToken(rawToken),
      password_reset_expires: new Date(Date.now() + RESET_TOKEN_TTL_MS)
    }
  );

  // Not awaited on purpose, so response time does not reveal whether the account exists
  sendEmail({
    to: user.email,
    subject: 'Reset your password',
    text: `Reset your password by opening this link: ${getFrontendUrl()}/auth/reset-password/${rawToken}\nThe link expires in 1 hour. If you did not ask for this, ignore this email.`
  }).catch(async (err) => {
    console.error('Failed to send password reset email:', err.message);
    await User.updateOne(
      { _id: user._id },
      { $unset: { password_reset_token: 1, password_reset_expires: 1 } }
    ).catch(() => {});
  });
};

const findUserByResetToken = (rawToken) =>
  User.findOne({
    password_reset_token: hashToken(rawToken),
    password_reset_expires: { $gt: new Date() },
    deleted_at: null
  }).select('+password_reset_token +password_reset_expires');

// Used by the reset page to check the link before showing the form
const isResetTokenValid = async (rawToken) => Boolean(await findUserByResetToken(rawToken));

const resetPassword = async ({ token, new_password }) => {
  const user = await findUserByResetToken(token);
  if (!user) {
    throw new ApiError('Reset link is invalid or has expired', 400);
  }

  user.password_hash = await bcrypt.hash(new_password, SALT_ROUNDS);
  user.password_changed_at = new Date();
  user.password_reset_token = undefined;
  user.password_reset_expires = undefined;
  await user.save({ validateModifiedOnly: true });

  // Sign the user out everywhere
  await RefreshToken.deleteMany({ user: user._id });
};

// ---------- change password (authenticated) ----------

const changePassword = async (reqUser, { current_password, new_password }, accessToken, accessExp) => {
  // req.user was loaded without the hash, so fetch it here
  const user = await User.findById(reqUser._id);
  if (!user) {
    throw new ApiError('User no longer exists', 401);
  }

  if (!(await bcrypt.compare(current_password, user.password_hash))) {
    throw new ApiError('Current password is incorrect', 400);
  }
  if (current_password === new_password) {
    throw new ApiError('New password must be different from the current password', 400);
  }

  user.password_hash = await bcrypt.hash(new_password, SALT_ROUNDS);
  user.password_changed_at = new Date();
  await user.save({ validateModifiedOnly: true });

  // End every other session, then start a fresh one for this device
  await RefreshToken.deleteMany({ user: user._id });
  await blacklistToken(accessToken, accessExp);
  return issueSession(user);
};

// ---------- email verification ----------

const verifyEmail = async ({ token }) => {
  const user = await User.findOne({
    email_verification_token: hashToken(token),
    email_verification_expires: { $gt: new Date() },
    deleted_at: null
  }).select('+email_verification_token +email_verification_expires');

  if (!user) {
    throw new ApiError('Verification link is invalid or has expired', 400);
  }

  await User.updateOne(
    { _id: user._id },
    {
      email_verified: true,
      $unset: { email_verification_token: 1, email_verification_expires: 1 }
    }
  );
};

module.exports = {
  register,
  login,
  setupTwoFactor,
  verifyTwoFactorCode,
  completeTwoFactorLogin,
  refresh,
  logout,
  forgotPassword,
  isResetTokenValid,
  resetPassword,
  changePassword,
  verifyEmail,
  generateToken,
  generateRefreshToken,
  verifyToken,
  isTokenBlacklisted,
  blacklistToken,
  passwordChangedAfter,
  sanitizeUser
};
