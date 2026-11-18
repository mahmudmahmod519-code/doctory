const jwt = require('jsonwebtoken');

const ACCESS_COOKIE = 'session_token';
const REFRESH_COOKIE = 'refresh_token';
const TWO_FACTOR_COOKIE = 'twofa_token';

// The refresh cookie is only sent to the auth API, never to the rest of the app
const REFRESH_COOKIE_PATH = '/api/auth';

const baseOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
});

const maxAgeOf = (token) => {
  const { exp } = jwt.decode(token);
  return Math.max(exp * 1000 - Date.now(), 0);
};

const setAccessCookie = (res, token) => {
  res.cookie(ACCESS_COOKIE, token, { ...baseOptions(), path: '/', maxAge: maxAgeOf(token) });
};

const setSessionCookies = (res, { accessToken, refreshToken }) => {
  setAccessCookie(res, accessToken);
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...baseOptions(),
    path: REFRESH_COOKIE_PATH,
    maxAge: maxAgeOf(refreshToken)
  });
};

const setTwoFactorCookie = (res, token) => {
  res.cookie(TWO_FACTOR_COOKIE, token, { ...baseOptions(), path: '/', maxAge: maxAgeOf(token) });
};

const clearTwoFactorCookie = (res) => {
  res.clearCookie(TWO_FACTOR_COOKIE, { ...baseOptions(), path: '/' });
};

const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_COOKIE, { ...baseOptions(), path: '/' });
  res.clearCookie(REFRESH_COOKIE, { ...baseOptions(), path: REFRESH_COOKIE_PATH });
  clearTwoFactorCookie(res);
};

// Uses req.cookies (cookie-parser) and falls back to parsing the header itself
const getCookie = (req, name) => {
  if (req.cookies && req.cookies[name]) return req.cookies[name];
  const raw = req.headers && req.headers.cookie;
  if (!raw) return undefined;
  for (const part of raw.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return undefined;
};

module.exports = {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  TWO_FACTOR_COOKIE,
  setAccessCookie,
  setSessionCookies,
  setTwoFactorCookie,
  clearTwoFactorCookie,
  clearAuthCookies,
  getCookie
};
