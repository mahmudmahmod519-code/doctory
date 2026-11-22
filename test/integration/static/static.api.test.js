// Integration tests — static API (supertest + the test database from test/helpers/db.js).
// Use test/helpers/auth.js to create users and authenticated requests, test/helpers/factories.js for data.

describe('static API', () => {
  describe('POST /api/contact', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
  describe('GET /api/public/stats', () => {
    test.todo('succeeds for an allowed role');
    test.todo('returns 401 without a session and 403 for a wrong role');
    test.todo('returns 400 / 404 / 409 according to the documented rules');
  });
});
