// Unit tests — DeletionRequest controllers (logicModels/DeletionRequest/*). Mock the models; no database.
// Pattern: build req/res mocks (see test/unit/middleware/roles.test.js) and assert status + json.

describe('deletion-request controller', () => {
  test.todo('POST /api/deletion-requests — returns the documented status code and body');
  test.todo('POST /api/deletion-requests — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/deletion-requests — returns the documented status code and body');
  test.todo('GET /api/deletion-requests — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/deletion-requests/:id — returns the documented status code and body');
  test.todo('GET /api/deletion-requests/:id — rejects invalid input / wrong role / foreign ownership');
  test.todo('PATCH /api/deletion-requests/:id/cancel — returns the documented status code and body');
  test.todo('PATCH /api/deletion-requests/:id/cancel — rejects invalid input / wrong role / foreign ownership');
});
