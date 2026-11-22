// Unit tests — middleware/auth.js
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const config = require('../../config/env-config');
const User = require('../../models/User.entity');

jest.mock('../../models/User.entity');

describe('middleware/auth', () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {}, headers: {}, path: '/api/user/profile' };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), redirect: jest.fn() };
    next = jest.fn();
    User.findOne.mockReset();
  });

  it('rejects an API request without a token with 401', async () => {
    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', message: 'غير مصرح - يجب تسجيل الدخول' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('redirects a page request without a token to /auth/login', async () => {
    req.path = '/patient/dashboard';
    await auth(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith('/auth/login');
    expect(next).not.toHaveBeenCalled();
  });

  it('accepts the token from the session_token cookie', async () => {
    const token = jwt.sign({ user_id: 'u1', role: 'patient' }, config.auth.jwt.secret);
    req.cookies.session_token = token;
    User.findOne.mockReturnValue({ lean: () => Promise.resolve({ user_id: 'u1', role: 'patient' }) });

    await auth(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ user_id: 'u1' });
    expect(req.user).toEqual({ user_id: 'u1', role: 'patient' });
    expect(next).toHaveBeenCalled();
  });

  it('accepts the token from the Authorization Bearer header', async () => {
    const token = jwt.sign({ user_id: 'u2', role: 'doctor' }, config.auth.jwt.secret);
    req.headers.authorization = `Bearer ${token}`;
    User.findOne.mockReturnValue({ lean: () => Promise.resolve({ user_id: 'u2', role: 'doctor' }) });

    await auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.role).toBe('doctor');
  });

  it('rejects an invalid token with 401 on an API path', async () => {
    req.cookies.session_token = 'not-a-real-token';
    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects an expired token with 401 on an API path', async () => {
    const token = jwt.sign({ user_id: 'u1' }, config.auth.jwt.secret, { expiresIn: '-1h' });
    req.cookies.session_token = token;
    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when the user of a valid token no longer exists', async () => {
    const token = jwt.sign({ user_id: 'ghost' }, config.auth.jwt.secret);
    req.cookies.session_token = token;
    User.findOne.mockReturnValue({ lean: () => Promise.resolve(null) });

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'المستخدم غير موجود' })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
