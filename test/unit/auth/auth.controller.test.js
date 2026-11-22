// Unit tests — auth controllers (logicModels/auth/*). Mock the models; no database.
// Pattern: build req/res mocks (see test/unit/middleware/roles.test.js) and assert status + json.

describe('auth controller', () => {
  test.todo('POST /api/auth/register/patient — returns the documented status code and body');
  test.todo('POST /api/auth/register/patient — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/auth/register/doctor — returns the documented status code and body');
  test.todo('POST /api/auth/register/doctor — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/auth/login — returns the documented status code and body');
  test.todo('POST /api/auth/login — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/auth/2fa/verify — returns the documented status code and body');
  test.todo('POST /api/auth/2fa/verify — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/auth/refresh — returns the documented status code and body');
  test.todo('POST /api/auth/refresh — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/auth/me — returns the documented status code and body');
  test.todo('GET /api/auth/me — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/auth/logout — returns the documented status code and body');
  test.todo('POST /api/auth/logout — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/auth/forgot-password — returns the documented status code and body');
  test.todo('POST /api/auth/forgot-password — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/auth/reset-password — returns the documented status code and body');
  test.todo('POST /api/auth/reset-password — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/auth/change-password — returns the documented status code and body');
  test.todo('POST /api/auth/change-password — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/auth/verify-email — returns the documented status code and body');
  test.todo('POST /api/auth/verify-email — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/auth/resend-verification — returns the documented status code and body');
  test.todo('POST /api/auth/resend-verification — rejects invalid input / wrong role / foreign ownership');
});
