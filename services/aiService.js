const crypto = require('crypto');
const config = require('../config/env-config');

class AIServiceError extends Error {
  constructor(type, message, cause) {
    super(message);
    this.name = 'AIServiceError';
    this.type = type; // AI_UNAVAILABLE | AI_INVALID_RESPONSE | AI_TIMEOUT | AI_STALE_MODEL
    this.cause = cause;
  }
}

/**
 * Call the Python prediction service to get consultation duration + no-show probability.
 * This is the ONLY Node.js boundary for the Python service. Routes/controllers must not call Python directly.
 *
 * @param {Object} features - Feature payload matching the training schema
 * @returns {Promise<Object>} Prediction result { predicted_duration_minutes, no_show_probability, risk_level, ... }
 */
async function predictBooking(features) {
  const predictionConfig = config.prediction;
  const correlationId = `pred-${crypto.randomUUID()}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), predictionConfig.timeoutMs);

  try {
    const res = await fetch(`${predictionConfig.serviceUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(predictionConfig.apiKey ? { 'X-API-Key': predictionConfig.apiKey } : {})
      },
      body: JSON.stringify({
        feature_schema_version: predictionConfig.featureSchemaVersion,
        model_version: predictionConfig.modelVersion,
        correlation_id: correlationId,
        features
      }),
      signal: controller.signal
    });

    if (!res.ok) {
      throw new AIServiceError(
        'AI_INVALID_RESPONSE',
        `Python service returned HTTP ${res.status}`,
        new Error(await res.text().catch(() => ''))
      );
    }

    const data = await res.json();

    // Validate response shape
    if (
      typeof data.predicted_duration_minutes !== 'number' ||
      typeof data.no_show_probability !== 'number' ||
      !data.model_version ||
      !data.feature_schema_version
    ) {
      throw new AIServiceError(
        'AI_INVALID_RESPONSE',
        'Python service returned malformed prediction response',
        new Error(JSON.stringify(data))
      );
    }

    // Clamp impossible outputs
    const clamped = {
      predicted_duration_minutes: Math.max(0, Math.min(480, data.predicted_duration_minutes)),
      no_show_probability: Math.max(0, Math.min(1, data.no_show_probability)),
      risk_level: data.risk_level || 'normal',
      model_version: data.model_version,
      feature_schema_version: data.feature_schema_version,
      predicted_at: data.predicted_at || new Date().toISOString(),
      correlation_id: data.correlation_id || correlationId,
      warnings: Array.isArray(data.warnings) ? data.warnings : [],
      data_quality: data.data_quality || { used_fallback_features: false, missing_optional_fields: [] }
    };

    return clamped;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new AIServiceError('AI_TIMEOUT', `Python service timeout after ${predictionConfig.timeoutMs}ms`, err);
    }
    if (err instanceof AIServiceError) {
      throw err;
    }
    throw new AIServiceError('AI_UNAVAILABLE', `Python service unavailable: ${err.message}`, err);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Health check for the Python prediction service.
 * @returns {Promise<{ healthy: boolean, versions?: string[], error?: string }>}
 */
async function healthCheck() {
  const predictionConfig = config.prediction;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), predictionConfig.timeoutMs);
    const res = await fetch(`${predictionConfig.serviceUrl}/health`, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      return { healthy: false, error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return { healthy: true, versions: data.loaded_model_versions };
  } catch (err) {
    return { healthy: false, error: err.message };
  }
}

module.exports = { predictBooking, healthCheck, AIServiceError };
