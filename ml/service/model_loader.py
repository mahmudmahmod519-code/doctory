import os
import joblib
import logging

logger = logging.getLogger("ai_service")

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts")

_model_cache = {}


def load_model(model_version: str):
    """Load a versioned model artifact (preprocessing pipeline + estimator)."""
    if model_version in _model_cache:
        return _model_cache[model_version]

    model_path = os.path.join(MODEL_DIR, f"duration_{model_version}.joblib")
    no_show_path = os.path.join(MODEL_DIR, f"no_show_{model_version}.joblib")

    duration_model = None
    no_show_model = None

    if os.path.exists(model_path):
        duration_model = joblib.load(model_path)
        logger.info(f"Loaded duration model: {model_version}")
    else:
        logger.warning(f"Duration model artifact not found: {model_path}")

    if os.path.exists(no_show_path):
        no_show_model = joblib.load(no_show_path)
        logger.info(f"Loaded no-show model: {model_version}")
    else:
        logger.warning(f"No-show model artifact not found: {no_show_path}")

    _model_cache[model_version] = (duration_model, no_show_model)
    return duration_model, no_show_model


def get_loaded_versions():
    """Return list of loaded model versions."""
    return list(_model_cache.keys())


def is_ready(model_version: str) -> bool:
    """Check if the model artifacts for the given version are loaded."""
    duration_model, no_show_model = load_model(model_version)
    return duration_model is not None and no_show_model is not None
