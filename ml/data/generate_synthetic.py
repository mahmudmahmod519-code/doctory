"""
Synthetic dataset generator for Doctory AI Scheduling Prediction.
Run: python ml/data/generate_synthetic.py

Output: ml/data/synthetic.csv — reviewed by the team before training.
"""

import os
import random
import logging
import pandas as pd
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("generate_synthetic")

OUTPUT_PATH = os.environ.get("SYNTHETIC_DATA_PATH", os.path.join(os.path.dirname(__file__), "synthetic.csv"))
N_ROWS = int(os.environ.get("SYNTHETIC_ROWS", "2000"))

SPECIALTIES = ["cardiology", "dermatology", "pediatrics", "orthopedics", "gynecology", "neurology", "general"]
SERVICE_TYPES = ["consultation", "follow_up"]
DAYS = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"]
TIME_PERIODS = ["morning", "afternoon", "evening"]
VISIT_REASONS = ["follow_up", "new_complaint", "routine_checkup", "post_op", "chronic_management"]
CHRONIC_KEYS = ["diabetes", "hypertension", "asthma", "heart", "kidney"]


def generate_row(i):
    specialty = random.choice(SPECIALTIES)
    service_type = random.choice(SERVICE_TYPES)
    day = random.choice(DAYS)
    period = random.choice(TIME_PERIODS)
    queue_pos = random.randint(1, 20)
    lead_hours = round(random.uniform(1, 168), 1)
    is_rescheduled = random.random() < 0.15
    age = random.randint(18, 85)
    prior_visits = random.randint(0, 10)
    prior_completed = random.randint(0, prior_visits) if prior_visits > 0 else 0
    prior_cancelled = random.randint(0, max(0, prior_visits - prior_completed))
    prior_no_show = random.randint(0, max(0, prior_visits - prior_completed - prior_cancelled))
    attendance = round(prior_completed / max(1, prior_visits), 2) if prior_visits > 0 else 1.0
    avg_dur = round(random.uniform(10, 40), 1) if prior_completed > 0 else None
    configured = random.choice([15, 20, 30, 45, 60])

    chronic = {k: random.random() < 0.25 for k in CHRONIC_KEYS}
    reason = random.choice(VISIT_REASONS)
    problem = random.choice([
        "متابعة ضغط دم",
        "صداع ودوار",
        "ألم في المفاصل",
        "فحص دوري",
        "مراجعة نتيجة تحاليل",
        "شفتي جروح قديمة",
        "طفح جلدي",
        "ألم بطن متقطع",
        "سعال وضيق نفس",
        "استشارة تغذية"
    ])

    # Duration model: base + specialty + age + chronic + noise
    base = configured
    if specialty in ["cardiology", "neurology"]:
        base += 5
    if age > 65:
        base += 3
    if any(chronic.values()):
        base += 4
    actual_duration = max(5, base + random.gauss(0, 4))

    # No-show model: base rate + history + lead time
    p_no_show = 0.08
    if prior_no_show > 0:
        p_no_show += 0.12 * min(prior_no_show, 3)
    if attendance < 0.8:
        p_no_show += 0.10
    if lead_hours > 72:
        p_no_show += 0.05
    p_no_show = max(0.0, min(0.95, p_no_show))
    no_show = random.random() < p_no_show

    return {
        "doctor_id": f"anon_doc_{random.randint(1, 50)}",
        "specialty": specialty,
        "service_type": service_type,
        "appointment_date": (datetime.now() + timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d"),
        "appointment_time": f"{random.randint(9, 16):02d}:{random.choice(['00', '30'])}",
        "day_of_week": day,
        "time_period": period,
        "queue_position": queue_pos,
        "booking_lead_time_hours": lead_hours,
        "is_rescheduled": is_rescheduled,
        "patient_age": age,
        "prior_visit_count": prior_visits,
        "prior_completed_count": prior_completed,
        "prior_cancelled_count": prior_cancelled,
        "prior_no_show_count": prior_no_show,
        "attendance_rate": attendance,
        "avg_previous_duration": avg_dur if avg_dur else "",
        "configured_service_duration": configured,
        "chronic_diabetes": chronic["diabetes"],
        "chronic_hypertension": chronic["hypertension"],
        "chronic_asthma": chronic["asthma"],
        "chronic_heart": chronic["heart"],
        "chronic_kidney": chronic["kidney"],
        "visit_reason_category": reason,
        "problem_description": problem,
        "actual_duration_minutes": round(actual_duration, 1),
        "no_show": no_show
    }


def main():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    rows = [generate_row(i) for i in range(N_ROWS)]
    df = pd.DataFrame(rows)
    df.to_csv(OUTPUT_PATH, index=False)
    logger.info(f"Generated {N_ROWS} synthetic rows → {OUTPUT_PATH}")
    logger.info(f"No-show rate: {df['no_show'].mean():.2%}")
    logger.info(f"Avg duration: {df['actual_duration_minutes'].mean():.1f} min")


if __name__ == "__main__":
    main()
