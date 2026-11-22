// Unit tests — utils/catchError.js and utils/checkLogin.js
const catchError = require('../../utils/catchError');
const checkLogin = require('../../utils/checkLogin');

describe('utils/catchError', () => {
  let req, res;

  beforeEach(() => {
    req = { path: '/x', method: 'GET', cookies: {} };
    res = { status: jest.fn().mockReturnThis(), render: jest.fn() };
  });

  it('runs the handler and forwards the response', async () => {
    const handler = jest.fn(async (rq, rs) => rs.json({ ok: true }));
    res.json = jest.fn();
    await catchError(handler)(req, res);
    expect(handler).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('renders the 500 page when the handler throws', async () => {
    const handler = jest.fn(async () => {
      throw new Error('boom');
    });
    await catchError(handler)(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.render).toHaveBeenCalledWith('errors/500', expect.any(Object));
  });
});

describe('utils/checkLogin', () => {
  it('reports a logged out visitor', () => {
    const result = checkLogin({ cookies: {} }, {});
    expect(result.login).toBe(false);
    expect(result.currentUser).toBeUndefined();
    expect(result.status).toBe('success');
  });

  it('reports a logged in visitor and strips the password', () => {
    const result = checkLogin(
      {
        cookies: { session_token: 'abc' },
        user: { user_id: 'u1', name: 'Ahmed', password_hash: 'secret' }
      },
      {}
    );
    expect(result.login).toBe(true);
    expect(result.currentUser.user_id).toBe('u1');
    expect(result.currentUser.password_hash).toBeUndefined();
  });
});
