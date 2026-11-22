// Auth helpers — creates users, signs JWT cookies and builds the authenticated requests.

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/env-config');
const User = require('../../models/User.entity');

/** Creates a user document directly in the database. */
async function createUser(overrides = {}) {
  const passwordHash = await bcrypt.hash(overrides.password || 'Test123456!', 4);
  const user = await User.create({
    user_id: overrides.user_id || crypto.randomUUID(),
    name: overrides.name || 'Test User',
    email: (overrides.email || `test${Date.now()}@doctory.test`).toLowerCase(),
    password_hash: passwordHash,
    role: overrides.role || 'patient',
    status: overrides.status || 'active',
    phone: overrides.phone || '+201001234567',
    address: overrides.address,
    birth_date: overrides.birth_date,
    image_profile: overrides.image_profile,
    email_verified: overrides.email_verified ?? true,
    enable_2fa: overrides.enable_2fa ?? false,
    secure_key: overrides.secure_key,
    deleted_at: overrides.deleted_at,
    deleted_by: overrides.deleted_by
  });
  return user;
}

/** Signs an Access JWT identical to the one issued by the login controller. */
function signAccessToken(user) {
  return jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role },
    config.auth.jwt.secret,
    { expiresIn: config.auth.jwt.expires_in }
  );
}

/** Cookie header value used by the auth middleware. */
function authCookie(user) {
  return `session_token=${signAccessToken(user)}`;
}

/** Full request headers for an authenticated call. */
function authHeaders(user) {
  return { Cookie: authCookie(user), Authorization: `Bearer ${signAccessToken(user)}` };
}

module.exports = { createUser, signAccessToken, authCookie, authHeaders };
