// Unit tests — middleware/validate.js
const validate = require('../../middleware/validate');
const Joi = require('joi');

describe('middleware/validate', () => {
  let req, res, next;

  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required()
  });

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('calls next when the payload is valid', () => {
    req.body = { name: 'Ahmed', email: 'ahmed@doctory.test' };
    validate(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 with all the errors when the payload is invalid', () => {
    req.body = { email: 'not-an-email' };
    validate(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'بيانات غير صالحة',
        errors: expect.arrayContaining([expect.any(String)])
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('merges the body, the params and the query before validating', () => {
    req.params = { id: 'abc' };
    req.query = { email: 'a@b.com' };
    const mixed = Joi.object({ id: Joi.string().required(), email: Joi.string().email().required() });
    validate(mixed)(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
