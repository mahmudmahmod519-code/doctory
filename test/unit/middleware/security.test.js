// Unit tests — middleware/helmet.js and middleware/securityLogger.js
const helmet = require('../../middleware/helmet');
const securityLogger = require('../../middleware/securityLogger');

describe('middleware/helmet', () => {
  it('is exported as a middleware function', () => {
    expect(typeof helmet).toBe('function');
  });
});

describe('middleware/securityLogger', () => {
  let req, res, next;

  beforeEach(() => {
    req = { url: '/api/users', body: {}, headers: { 'user-agent': 'jest' }, ip: '127.0.0.1' };
    res = {};
    next = jest.fn();
  });

  it('calls next for a normal request', () => {
    securityLogger(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('calls next for a suspicious request without throwing', () => {
    req.url = '/api/users?x=<script>alert(1)</script>';
    expect(() => securityLogger(req, res, next)).not.toThrow();
    expect(next).toHaveBeenCalled();
  });
});
