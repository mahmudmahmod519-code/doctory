// Integration tests — DoctorPortfolio API (supertest + the test database from test/helpers/db.js).
// Use test/helpers/auth.js to create users and authenticated requests, test/helpers/factories.js for data.

describe('doctor-portfolio API', () => {
  describe('GET /api/public/doctors', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/public/doctors/:id', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/public/specialties', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/public/portfolios/:portfolioId/services', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/doctor-portfolios', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/doctor-portfolios/:id', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('POST /api/doctor-portfolios', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('PATCH /api/doctor-portfolios/:id', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('DELETE /api/doctor-portfolios/:id', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
});
