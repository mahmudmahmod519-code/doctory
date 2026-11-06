"""
Evaluation script for Doctory AI Scheduling Prediction.
Run: python ml/train/evaluate.py
"""

import os
import sys
import json
import logging
import joblib
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, roc_auc_score, classification_report, confusion_matrix

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("evaluate")

DATA_PATH = os.environ.get("SYNTHETIC_DATA_PATH", os.path.join(os.path.dirname(__file__), "..", "data", "synthetic.csv"))
ARTIFACT_DIR = os.environ.get("MODEL_ARTIFACT_DIR", os.path.join(os.path.dirname(__file__), "..", "artifacts"))
MODEL_VERSION = os.environ.get("MODEL_VERSION", "duration-v1.0.0-no-show-v1.0.0")


def evaluate():
    if not os.path.exists(DATA_PATH):
        logger.error(f"Data not found: {DATA_PATH}")
        sys.exit(1)

    df = pd.read_csv(DATA_PATH)

    # Preprocess (same as train)
    NUMERIC_FEATURES = [
        "patient_age", "queue_position", "booking_lead_time_hours",
        "prior_visit_count", "prior_completed_count", "prior_cancelled_count",
        "prior_no_show_count", "attendance_rate", "avg_previous_duration",
        "configured_service_duration"
    ]
    CATEGORICAL_FEATURES = [
        "specialty", "service_type", "day_of_week", "time_period",
        "visit_reason_category"
    ]
    TEXT_FEATURES = ["problem_description"]
    BOOLEAN_FEATURES = ["is_rescheduled"]
    chronic_cols = ["chronic_diabetes", "chronic_hypertension", "chronic_asthma", "chronic_heart", "chronic_kidney"]

    for col in NUMERIC_FEATURES:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)
    for col in CATEGORICAL_FEATURES:
        if col in df.columns:
            df[col] = df[col].fillna("unknown").astype(str)
    for col in TEXT_FEATURES:
        if col in df.columns:
            df[col] = df[col].fillna("").astype(str)
    for col in BOOLEAN_FEATURES:
        if col in df.columns:
            df[col] = df[col].fillna(False).astype(bool)
    for col in chronic_cols:
        if col not in df.columns:
            df[col] = False
        df[col] = df[col].fillna(False).astype(bool)

    X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES + TEXT_FEATURES + BOOLEAN_FEATURES + chronic_cols]
    y_duration = df["actual_duration_minutes"]
    y_no_show = df["no_show"]

    dur_path = os.path.join(ARTIFACT_DIR, f"duration_{MODEL_VERSION}.joblib")
    ns_path = os.path.join(ARTIFACT_DIR, f"no_show_{MODEL_VERSION}.joblib")

    if not os.path.exists(dur_path) or not os.path.exists(ns_path):
        logger.error("Model artifacts not found. Run train.py first.")
        sys.exit(1)

    duration_pipe = joblib.load(dur_path)
    no_show_pipe = joblib.load(ns_path)

    # Duration metrics
    dur_pred = duration_pipe.predict(X)
    dur_mae = mean_absolute_error(y_duration, dur_pred)
    dur_rmse = mean_squared_error(y_duration, dur_pred, squared=False)

    # No-show metrics
    ns_pred = no_show_pipe.predict(X)
    ns_proba = no_show_pipe.predict_proba(X)[:, 1]
    ns_auc = roc_auc_score(y_no_show, ns_proba)

    report = {
        "model_version": MODEL_VERSION,
        "evaluated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "dataset_rows": len(df),
        "duration": {
            "mae": round(dur_mae, 2),
            "rmse": round(dur_rmse, 2)
        },
        "no_show": {
            "roc_auc": round(ns_auc, 3),
            "classification_report": classification_report(y_no_show, ns_pred, output_dict=True),
            "confusion_matrix": confusion_matrix(y_no_show, ns_pred).tolist()
        },
        "data_warning": "SYNTHETIC DATA — not production accuracy"
    }

    out_path = os.path.join(ARTIFACT_DIR, f"evaluation_{MODEL_VERSION}.json")
    with open(out_path, "w") as f:
        json.dump(report, f, indent=2)

    logger.info(f"Evaluation saved to {out_path}")
    logger.info(f"Duration MAE: {dur_mae:.2f}, RMSE: {dur_rmse:.2f}")
    logger.info(f"No-show ROC-AUC: {ns_auc:.3f}")
    return report


if __name__ == "__main__":
    evaluate()
