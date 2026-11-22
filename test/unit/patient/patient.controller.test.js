// Unit tests — patient controllers (logicModels/patient/*). Mock the models; no database.
// Pattern: build req/res mocks (see test/unit/middleware/roles.test.js) and assert status + json.

describe('patient controller', () => {
  test.todo('GET /api/patient/dashboard — returns the documented status code and body');
  test.todo('GET /api/patient/dashboard — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/patient/bookings — returns the documented status code and body');
  test.todo('GET /api/patient/bookings — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/patient/bookings/:id — returns the documented status code and body');
  test.todo('GET /api/patient/bookings/:id — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/patient/bookings — returns the documented status code and body');
  test.todo('POST /api/patient/bookings — rejects invalid input / wrong role / foreign ownership');
  test.todo('PATCH /api/patient/bookings/:id/cancel — returns the documented status code and body');
  test.todo('PATCH /api/patient/bookings/:id/cancel — rejects invalid input / wrong role / foreign ownership');
  test.todo('PATCH /api/patient/bookings/:id/reschedule — returns the documented status code and body');
  test.todo('PATCH /api/patient/bookings/:id/reschedule — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/patient/medical-history — returns the documented status code and body');
  test.todo('GET /api/patient/medical-history — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/patient/reports — returns the documented status code and body');
  test.todo('GET /api/patient/reports — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/patient/reports/:id — returns the documented status code and body');
  test.todo('GET /api/patient/reports/:id — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/patient/reviews — returns the documented status code and body');
  test.todo('GET /api/patient/reviews — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/patient/reviews — returns the documented status code and body');
  test.todo('POST /api/patient/reviews — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/patient/queue/:bookingItemId — returns the documented status code and body');
  test.todo('GET /api/patient/queue/:bookingItemId — rejects invalid input / wrong role / foreign ownership');
  test.todo('PATCH /api/patient/queue/:bookingItemId/confirm — returns the documented status code and body');
  test.todo('PATCH /api/patient/queue/:bookingItemId/confirm — rejects invalid input / wrong role / foreign ownership');
  test.todo('PATCH /api/patient/queue/:bookingItemId/decline — returns the documented status code and body');
  test.todo('PATCH /api/patient/queue/:bookingItemId/decline — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/patient/queue/current — returns the documented status code and body');
  test.todo('GET /api/patient/queue/current — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/patient/medical-history/:section — returns the documented status code and body');
  test.todo('POST /api/patient/medical-history/:section — rejects invalid input / wrong role / foreign ownership');
  test.todo('PATCH /api/patient/medical-history/:section/:entryId — returns the documented status code and body');
  test.todo('PATCH /api/patient/medical-history/:section/:entryId — rejects invalid input / wrong role / foreign ownership');
  test.todo('DELETE /api/patient/medical-history/:section/:entryId — returns the documented status code and body');
  test.todo('DELETE /api/patient/medical-history/:section/:entryId — rejects invalid input / wrong role / foreign ownership');
});
