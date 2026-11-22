// Unit tests — doctor controllers (logicModels/doctor/*). Mock the models; no database.
// Pattern: build req/res mocks (see test/unit/middleware/roles.test.js) and assert status + json.

describe('doctor controller', () => {
  test.todo('GET /api/doctor/dashboard — returns the documented status code and body');
  test.todo('GET /api/doctor/dashboard — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/doctor/bookings — returns the documented status code and body');
  test.todo('GET /api/doctor/bookings — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/doctor/bookings/:bookingId — returns the documented status code and body');
  test.todo('GET /api/doctor/bookings/:bookingId — rejects invalid input / wrong role / foreign ownership');
  test.todo('PATCH /api/doctor/bookings/:bookingId/accept — returns the documented status code and body');
  test.todo('PATCH /api/doctor/bookings/:bookingId/accept — rejects invalid input / wrong role / foreign ownership');
  test.todo('PATCH /api/doctor/bookings/:bookingId/reject — returns the documented status code and body');
  test.todo('PATCH /api/doctor/bookings/:bookingId/reject — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/doctor/waiting-list — returns the documented status code and body');
  test.todo('GET /api/doctor/waiting-list — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/doctor/waiting-list/call-next — returns the documented status code and body');
  test.todo('POST /api/doctor/waiting-list/call-next — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/doctor/visits/:visitId/clinical-summary — returns the documented status code and body');
  test.todo('GET /api/doctor/visits/:visitId/clinical-summary — rejects invalid input / wrong role / foreign ownership');
  test.todo('PUT /api/doctor/visits/:visitId/diagnosis — returns the documented status code and body');
  test.todo('PUT /api/doctor/visits/:visitId/diagnosis — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/doctor/visits/:visitId/prescriptions — returns the documented status code and body');
  test.todo('POST /api/doctor/visits/:visitId/prescriptions — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/doctor/visits/:visitId/prescriptions — returns the documented status code and body');
  test.todo('GET /api/doctor/visits/:visitId/prescriptions — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/doctor/profile/verification-status — returns the documented status code and body');
  test.todo('GET /api/doctor/profile/verification-status — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/doctor/portfolio — returns the documented status code and body');
  test.todo('GET /api/doctor/portfolio — rejects invalid input / wrong role / foreign ownership');
  test.todo('PATCH /api/doctor/portfolio — returns the documented status code and body');
  test.todo('PATCH /api/doctor/portfolio — rejects invalid input / wrong role / foreign ownership');
});
