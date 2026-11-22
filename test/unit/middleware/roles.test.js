// Unit tests — middleware/roles.js
const roles = require('../../middleware/roles');

describe('middleware/roles', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: { role: 'patient' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('returns 401 when there is no authenticated user', async () => {
    req.user = undefined;
    await roles('admin')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when the role is not allowed', async () => {
    await roles('admin')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', message: 'لا تملك صلاحية لهذا' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when the role is allowed', async () => {
    await roles('patient', 'admin')(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('accepts a list of allowed roles', async () => {
    req.user.role = 'admin';
    await roles('admin', 'doctor')(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
