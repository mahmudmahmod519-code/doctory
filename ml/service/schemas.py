from pydantic import BaseModel, Field, validator
from typing import Dict, List, Optional, Any
from datetime import datetime


class FeaturePayload(BaseModel):
    doctor_id: Optional[str] = None
    specialty: Optional[str] = None
    service_type: Optional[str] = None
    configured_service_duration: Optional[int] = Field(default=20, ge=1, le=480)
    appointment_time: Optional[str] = None
    day_of_week: Optional[str] = None
    time_period: Optional[str] = None
    queue_position: Optional[int] = Field(default=1, ge=1, le=1000)
    booking_lead_time_hours: Optional[float] = Field(default=0, ge=0)
    is_rescheduled: Optional[bool] = False
    patient_age: Optional[int] = Field(default=None, ge=0, le=120)
    prior_visit_count: Optional[int] = Field(default=0, ge=0)
    prior_completed_count: Optional[int] = Field(default=0, ge=0)
    prior_cancelled_count: Optional[int] = Field(default=0, ge=0)
    prior_no_show_count: Optional[int] = Field(default=0, ge=0)
    attendance_rate: Optional[float] = Field(default=1.0, ge=0, le=1)
    avg_previous_duration: Optional[float] = Field(default=None, ge=0, le=480)
    chronic_conditions: Optional[Dict[str, bool]] = Field(default_factory=dict)
    visit_reason_category: Optional[str] = None
    problem_description: Optional[str] = Field(default="", max_length=1000)


class PredictionRequest(BaseModel):
    feature_schema_version: str
    model_version: str
    correlation_id: str
    features: FeaturePayload


class DataQuality(BaseModel):
    used_fallback_features: bool = False
    missing_optional_fields: List[str] = []


class PredictionResponse(BaseModel):
    predicted_duration_minutes: float
    no_show_probability: float = Field(ge=0, le=1)
    risk_level: str
    model_version: str
    feature_schema_version: str
    predicted_at: str
    correlation_id: str
    warnings: List[str] = []
    data_quality: DataQuality
