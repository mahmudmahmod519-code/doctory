// Integration tests — patient API (supertest + the test database from test/helpers/db.js).
// Use test/helpers/auth.js to create users and authenticated requests, test/helpers/factories.js for data.

describe('patient API', () => {
  describe('GET /api/patient/dashboard', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/patient/bookings', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/patient/bookings/:id', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('POST /api/patient/bookings', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('PATCH /api/patient/bookings/:id/cancel', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('PATCH /api/patient/bookings/:id/reschedule', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/patient/medical-history', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/patient/reports', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/patient/reports/:id', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/patient/reviews', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('POST /api/patient/reviews', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/patient/queue/:bookingItemId', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('PATCH /api/patient/queue/:bookingItemId/confirm', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('PATCH /api/patient/queue/:bookingItemId/decline', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/patient/queue/current', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('POST /api/patient/medical-history/:section', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('PATCH /api/patient/medical-history/:section/:entryId', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('DELETE /api/patient/medical-history/:section/:entryId', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
});
