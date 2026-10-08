# Patient Consultation - Database Changes

## 1. booking_items

### New Fields

| Field | Type | Description |
|---|---|---|
| patient_confirmation_status | VARCHAR | Patient confirmation status |
| confirmation_attempts | INT | Number of patient decline attempts |
| cancelled_at | TIMESTAMP | Time of cancellation |
| cancellation_reason | TEXT | Reason for cancellation |

### Patient Confirmation Status

- pending
- confirmed
- declined
- cancelled

### Business Rule

If confirmation_attempts = 1:
The patient remains in the queue and will be called again.

If confirmation_attempts = 2:
The patient's queue entry is cancelled and the next patient is called.

## 2. patient_medical_histories

| Field | Type | Description |
|---|---|---|
| id | BIGINT | Primary key |
| patient_id | BIGINT | Patient reference |
| condition | VARCHAR | Medical condition |
| condition_type | VARCHAR | Chronic / Previous |
| notes | TEXT | Additional notes |
| diagnosed_at | DATE | Diagnosis date |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

## 2. patient_medical_histories

| Field | Type | Description |
|---|---|---|
| id | BIGINT | Primary key |
| patient_id | BIGINT | Patient reference |
| condition | VARCHAR | Medical condition |
| condition_type | VARCHAR | Chronic / Previous |
| notes | TEXT | Additional notes |
| diagnosed_at | DATE | Diagnosis date |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

## 4. patient_medications

| Field | Type | Description |
|---|---|---|
| id | BIGINT | Primary key |
| patient_id | BIGINT | Patient reference |
| medicine_name | VARCHAR | Medicine name |
| dosage | VARCHAR | Medicine dosage |
| frequency | VARCHAR | Frequency |
| start_date | DATE | Start date |
| end_date | DATE | End date |
| status | VARCHAR | Active / Completed |

## 4. patient_medications

| Field | Type | Description |
|---|---|---|
| id | BIGINT | Primary key |
| patient_id | BIGINT | Patient reference |
| medicine_name | VARCHAR | Medicine name |
| dosage | VARCHAR | Medicine dosage |
| frequency | VARCHAR | Frequency |
| start_date | DATE | Start date |
| end_date | DATE | End date |
| status | VARCHAR | Active / Completed |

## 5. consultations

| Field | Type | Description |
|---|---|---|
| id | BIGINT | Primary key |
| booking_item_id | BIGINT | Related appointment |
| patient_id | BIGINT | Patient |
| doctor_id | BIGINT | Doctor |
| symptoms | TEXT | Patient symptoms |
| clinical_notes | TEXT | Doctor notes |
| diagnosis | TEXT | Diagnosis |
| treatment_plan | TEXT | Treatment plan |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

## 6. prescriptions

| Field | Type | Description |
|---|---|---|
| id | BIGINT | Primary key |
| consultation_id | BIGINT | Related consultation |
| medicine_name | VARCHAR | Medicine |
| dosage | VARCHAR | Dosage |
| frequency | VARCHAR | Frequency |
| duration | VARCHAR | Duration |
| instructions | TEXT | Instructions |
| created_at | TIMESTAMP | Creation time |