// Unit tests — Review controllers (logicModels/Review/*). Mock the models; no database.
// Pattern: build req/res mocks (see test/unit/middleware/roles.test.js) and assert status + json.

describe('review controller', () => {
  test.todo('GET /api/reviews — returns the documented status code and body');
  test.todo('GET /api/reviews — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/reviews/:id — returns the documented status code and body');
  test.todo('GET /api/reviews/:id — rejects invalid input / wrong role / foreign ownership');
  test.todo('POST /api/reviews — returns the documented status code and body');
  test.todo('POST /api/reviews — rejects invalid input / wrong role / foreign ownership');
  test.todo('PATCH /api/reviews/:id — returns the documented status code and body');
  test.todo('PATCH /api/reviews/:id — rejects invalid input / wrong role / foreign ownership');
  test.todo('DELETE /api/reviews/:id — returns the documented status code and body');
  test.todo('DELETE /api/reviews/:id — rejects invalid input / wrong role / foreign ownership');
  test.todo('GET /api/public/portfolios/:portfolioId/reviews — returns the documented status code and body');
  test.todo('GET /api/public/portfolios/:portfolioId/reviews — rejects invalid input / wrong role / foreign ownership');
});
