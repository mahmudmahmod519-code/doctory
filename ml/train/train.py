"""
Training pipeline for Doctory AI Scheduling Prediction.
Run: python ml/train/train.py
"""

import os
import sys
import json
import logging
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, roc_auc_score, classification_report

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("train")

DATA_PATH = os.environ.get("SYNTHETIC_DATA_PATH", os.path.join(os.path.dirname(__file__), "..", "data", "synthetic.csv"))
ARTIFACT_DIR = os.environ.get("MODEL_ARTIFACT_DIR", os.path.join(os.path.dirname(__file__), "..", "artifacts"))
MODEL_VERSION = os.environ.get("MODEL_VERSION", "duration-v1.0.0-no-show-v1.0.0")
FEATURE_SCHEMA_VERSION = os.environ.get("FEATURE_SCHEMA_VERSION", "booking-features-v1")

os.makedirs(ARTIFACT_DIR, exist_ok=True)

# ---- Feature columns ----
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
# chronic_conditions handled as individual boolean columns in preprocessing


def load_data(path):
    if not os.path.exists(path):
        logger.error(f"Training data not found: {path}")
        sys.exit(1)
    df = pd.read_csv(path)
    logger.info(f"Loaded {len(df)} rows from {path}")
    return df


def preprocess(df):
    """Split into X and y, returning feature names for the ColumnTransformer."""
    # Fill missing values
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

    # Expand chronic_conditions dict into boolean columns
    chronic_cols = ["chronic_diabetes", "chronic_hypertension", "chronic_asthma", "chronic_heart", "chronic_kidney"]
    for col in chronic_cols:
        if col not in df.columns:
            df[col] = False
        df[col] = df[col].fillna(False).astype(bool)

    X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES + TEXT_FEATURES + BOOLEAN_FEATURES + chronic_cols].copy()
    y_duration = df["actual_duration_minutes"] if "actual_duration_minutes" in df.columns else None
    y_no_show = df["no_show"] if "no_show" in df.columns else None

    return X, y_duration, y_no_show, chronic_cols


def build_pipelines(chronic_cols):
    """Build preprocessing + estimator pipelines for duration and no-show."""

    # Preprocessor: numeric -> scale, categorical -> one-hot, text -> TF-IDF char n-grams, booleans -> passthrough
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERIC_FEATURES),
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
            ("text", TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), max_features=200, min_df=2), "problem_description"),
            ("bool", "passthrough", BOOLEAN_FEATURES + chronic_cols),
        ],
        remainder="drop"
    )

    duration_pipeline = Pipeline([
        ("preprocess", preprocessor),
        ("regressor", Ridge(alpha=1.0, random_state=42))
    ])

    no_show_pipeline = Pipeline([
        ("preprocess", preprocessor),
        ("classifier", LogisticRegression(max_iter=1000, random_state=42, class_weight="balanced"))
    ])

    return duration_pipeline, no_show_pipeline


def train():
    df = load_data(DATA_PATH)
    X, y_duration, y_no_show, chronic_cols = preprocess(df)

    # Train/test split (no leakage)
    X_train, X_test, y_dur_train, y_dur_test, y_ns_train, y_ns_test = train_test_split(
        X, y_duration, y_no_show, test_size=0.2, random_state=42, stratify=y_no_show
    )

    duration_pipe, no_show_pipe = build_pipelines(chronic_cols)

    logger.info("Training duration model...")
    duration_pipe.fit(X_train, y_dur_train)
    dur_pred = duration_pipe.predict(X_test)
    dur_mae = mean_absolute_error(y_dur_test, dur_pred)
    dur_rmse = mean_squared_error(y_dur_test, dur_pred, squared=False)
    logger.info(f"Duration — MAE: {dur_mae:.2f}, RMSE: {dur_rmse:.2f}")

    logger.info("Training no-show model...")
    no_show_pipe.fit(X_train, y_ns_train)
    ns_pred = no_show_pipe.predict(X_test)
    ns_proba = no_show_pipe.predict_proba(X_test)[:, 1]
    ns_auc = roc_auc_score(y_ns_test, ns_proba)
    logger.info(f"No-show — ROC-AUC: {ns_auc:.3f}")
    logger.info(f"No-show report:\n{classification_report(y_ns_test, ns_pred)}")

    # Save artifacts
    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    dur_path = os.path.join(ARTIFACT_DIR, f"duration_{MODEL_VERSION}.joblib")
    ns_path = os.path.join(ARTIFACT_DIR, f"no_show_{MODEL_VERSION}.joblib")

    joblib.dump(duration_pipe, dur_path)
    joblib.dump(no_show_pipe, ns_path)

    # Save metadata
    metadata = {
        "model_version": MODEL_VERSION,
        "feature_schema_version": FEATURE_SCHEMA_VERSION,
        "trained_at": datetime.utcnow().isoformat() + "Z",
        "dataset_path": DATA_PATH,
        "dataset_rows": len(df),
        "features": {
            "numeric": NUMERIC_FEATURES,
            "categorical": CATEGORICAL_FEATURES,
            "text": TEXT_FEATURES,
            "boolean": BOOLEAN_FEATURES,
            "chronic": chronic_cols
        },
        "metrics": {
            "duration_mae": round(dur_mae, 2),
            "duration_rmse": round(dur_rmse, 2),
            "no_show_roc_auc": round(ns_auc, 3)
        },
        "data_warning": "SYNTHETIC DATA — not production accuracy"
    }

    meta_path = os.path.join(ARTIFACT_DIR, f"metadata_{MODEL_VERSION}.json")
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    logger.info(f"Artifacts saved: {dur_path}, {ns_path}, {meta_path}")
    return metadata


if __name__ == "__main__":
    train()
