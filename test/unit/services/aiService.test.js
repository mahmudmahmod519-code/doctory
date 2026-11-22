// Unit tests — services/aiService.js
const { predictBooking, healthCheck, AIServiceError } = require('../../services/aiService');

describe('services/aiService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('exports the three public functions', () => {
    expect(typeof predictBooking).toBe('function');
    expect(typeof healthCheck).toBe('function');
    expect(typeof AIServiceError).toBe('function');
  });

  it('sends the schema version, the model version and a correlation id', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        predicted_duration_minutes: 24.5,
        no_show_probability: 0.72,
        risk_level: 'high',
        model_version: 'duration-v1.0.0-no-show-v1.0.0',
        feature_schema_version: 'booking-features-v1'
      })
    }));

    await predictBooking({ patient_age: 30 });

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain('/predict');
    const body = JSON.parse(options.body);
    expect(body.feature_schema_version).toBeDefined();
    expect(body.model_version).toBeDefined();
    expect(body.correlation_id).toMatch(/^pred-/);
  });

  it('clamps an impossible duration and an impossible probability', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        predicted_duration_minutes: -50,
        no_show_probability: 3,
        model_version: 'v1',
        feature_schema_version: 's1'
      })
    }));

    const result = await predictBooking({});
    expect(result.predicted_duration_minutes).toBe(0);
    expect(result.no_show_probability).toBe(1);
  });

  it('throws AI_INVALID_RESPONSE when the payload is malformed', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ unexpected: true })
    }));

    await expect(predictBooking({})).rejects.toMatchObject({ type: 'AI_INVALID_RESPONSE' });
  });

  it('throws AI_INVALID_RESPONSE on a non 2xx answer', async () => {
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 503,
      text: async () => 'service unavailable'
    }));

    await expect(predictBooking({})).rejects.toMatchObject({ type: 'AI_INVALID_RESPONSE' });
  });

  it('throws AI_UNAVAILABLE when the service cannot be reached', async () => {
    global.fetch = jest.fn(async () => {
      throw new Error('ECONNREFUSED');
    });

    await expect(predictBooking({})).rejects.toMatchObject({ type: 'AI_UNAVAILABLE' });
  });

  it('returns the health status of the service', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ status: 'healthy', loaded_model_versions: ['v1'] })
    }));

    const result = await healthCheck();
    expect(result.healthy).toBe(true);
    expect(result.versions).toEqual(['v1']);
  });

  it('returns an unhealthy status when the service is down', async () => {
    global.fetch = jest.fn(async () => {
      throw new Error('ECONNREFUSED');
    });

    const result = await healthCheck();
    expect(result.healthy).toBe(false);
    expect(result.error).toBeDefined();
  });
});
