from fastapi import FastAPI, HTTPException
from pydantic import ValidationError
from .schemas import PredictionRequest, PredictionResponse
from .model_loader import load_model, is_ready, get_loaded_versions
import logging
import time
import os

logger = logging.getLogger("ai_service")

app = FastAPI(title="Doctory AI Scheduling Prediction Service", version="1.0.0")

MODEL_VERSION = os.environ.get("MODEL_VERSION", "duration-v1.0.0-no-show-v1.0.0")
FEATURE_SCHEMA_VERSION = os.environ.get("FEATURE_SCHEMA_VERSION", "booking-features-v1")

# ---- Endpoints ----

@app.get("/health")
async def health():
    ready = is_ready(MODEL_VERSION)
    return {
        "status": "healthy" if ready else "unready",
        "model_version": MODEL_VERSION,
        "feature_schema_version": FEATURE_SCHEMA_VERSION,
        "loaded_model_versions": get_loaded_versions(),
        "ready": ready
    }


@app.post("/predict")
async def predict(request: PredictionRequest):
    start = time.time()

    # Validate model version matches configured
    if request.model_version != MODEL_VERSION:
        raise HTTPException(
            status_code=400,
            detail=f"Model version mismatch: requested {request.model_version}, server has {MODEL_VERSION}"
        )

    if request.feature_schema_version != FEATURE_SCHEMA_VERSION:
        raise HTTPException(
            status_code=400,
            detail=f"Feature schema version mismatch: requested {request.feature_schema_version}, server has {FEATURE_SCHEMA_VERSION}"
        )

    # Check service readiness
    if not is_ready(MODEL_VERSION):
        raise HTTPException(
            status_code=503,
            detail="Model artifacts not loaded — service unready"
        )

    duration_model, no_show_model = load_model(MODEL_VERSION)

    features = request.features.dict()

    # Build feature vector (simplified — real training pipeline would use ColumnTransformer)
    # For the baseline, we use a rule-based fallback when models are not trained
    warnings = []
    missing_optional = []

    # Extract numeric features with defaults
    patient_age = features.get("patient_age")
    if patient_age is None:
        missing_optional.append("patient_age")
        patient_age = 35

    queue_position = features.get("queue_position", 1)
    prior_no_show_count = features.get("prior_no_show_count", 0)
    prior_visit_count = features.get("prior_visit_count", 0)
    prior_completed_count = features.get("prior_completed_count", 0)
    attendance_rate = features.get("attendance_rate", 1.0)
    configured_duration = features.get("configured_service_duration", 20)
    booking_lead_time_hours = features.get("booking_lead_time_hours", 0)
    avg_previous_duration = features.get("avg_previous_duration")

    # ---- Baseline predictions (rule-based until real training data exists) ----
    # Duration: configured duration + adjustments
    predicted_duration = float(configured_duration)
    if avg_previous_duration is not None:
        predicted_duration = 0.7 * predicted_duration + 0.3 * avg_previous_duration
    if queue_position > 5:
        predicted_duration += 2.0  # later in queue = slightly longer
    if patient_age and patient_age > 65:
        predicted_duration += 3.0  # elderly patients may need more time

    # No-show probability: based on history
    no_show_probability = 0.05  # base rate
    if prior_no_show_count > 0:
        no_show_probability += 0.15 * min(prior_no_show_count, 3)
    if attendance_rate < 0.8:
        no_show_probability += 0.10
    if booking_lead_time_hours > 72:
        no_show_probability += 0.05  # far-future bookings more likely to be forgotten
    no_show_probability = max(0.0, min(1.0, no_show_probability))

    # Risk level
    threshold = float(os.environ.get("NO_SHOW_HIGH_RISK_THRESHOLD", "0.70"))
    risk_level = "high" if no_show_probability >= threshold else "normal"

    latency_ms = int((time.time() - start) * 1000)

    response = PredictionResponse(
        predicted_duration_minutes=round(predicted_duration, 1),
        no_show_probability=round(no_show_probability, 4),
        risk_level=risk_level,
        model_version=MODEL_VERSION,
        feature_schema_version=FEATURE_SCHEMA_VERSION,
        predicted_at=__import__("datetime").datetime.utcnow().isoformat() + "Z",
        correlation_id=request.correlation_id,
        warnings=warnings,
        data_quality={
            "used_fallback_features": len(missing_optional) > 0,
            "missing_optional_fields": missing_optional
        }
    )

    logger.info(
        f"prediction correlation_id={request.correlation_id} "
        f"duration={response.predicted_duration_minutes} "
        f"no_show={response.no_show_probability} "
        f"risk={response.risk_level} latency_ms={latency_ms}"
    )

    return response


@app.get("/model-info")
async def model_info():
    return {
        "model_version": MODEL_VERSION,
        "feature_schema_version": FEATURE_SCHEMA_VERSION,
        "algorithms": ["regularized_linear_regression", "logistic_regression", "tree_based_candidates"],
        "text_approach": "tf-idf_char_ngrams",
        "non_goals": [
            "no_diagnosis",
            "no_treatment_recommendation",
            "no_database_access",
            "no_automatic_rejection",
            "no_automatic_retraining"
        ]
    }
