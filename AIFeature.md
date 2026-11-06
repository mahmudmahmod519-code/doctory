# AI Scheduling Prediction Feature: Full Technical Plan

## 1. Executive summary

Doctory will add two machine-learning predictions to support the doctor's booking and queue workflow:

1. **Consultation-duration regression:** predicts how many minutes the current patient is likely to spend with the doctor.
2. **Patient no-show classification:** predicts the probability that the patient will be absent.

The AI component will only calculate predictions. The existing Node.js backend remains the owner of MongoDB access, booking state, queue ordering, reminders, confirmation requirements, deposits, and all final business decisions.

The first working version will use manually researched, manually generated, and manually reviewed synthetic data. After real appointments accumulate, the same pipeline will be retrained manually with approved real data. The models will be classical supervised models trained with scikit-learn; no pretrained medical model or LLM is required.

## 2. Confirmed requirements and decisions

### 2.1 Prediction targets

- `predicted_duration_minutes`: numeric estimate for the current consultation only.
- `no_show_probability`: a value from `0.0` to `1.0`.
- A configurable threshold converts the probability into `normal` or `high_risk`.

The model does not predict total waiting time. The backend derives waiting and queue estimates from the duration predictions of relevant patients and the doctor's current queue state.

### 2.2 Allowed feature groups

The request sent from Node.js to Python may contain:

- Doctor and service context: doctor/portfolio identifier, specialty, service type, and configured service duration.
- Appointment context: date, time, day of week, time period, queue position, booking creation lead time, and whether the appointment is a new booking or a rescheduled booking.
- Patient profile and history: age, prior visit count, prior completed count, prior cancelled count, prior no-show count, historical attendance rate, and previous average duration when enough history exists.
- Medical context: structured chronic-disease flags and a controlled visit-reason/category.
- Patient problem description: a short free-text description supplied by the patient.

The raw description must not contain direct identifiers. The training pipeline should apply text preprocessing/vectorization and should not send medical text to an external pretrained model.

### 2.3 Privacy and consent

- The patient must agree to the documented use of the submitted information for scheduling prediction.
- Only the minimum useful description should be collected and retained.
- Direct identifiers must be excluded from model features.
- Access to raw medical data, derived features, labels, and prediction logs must be role-controlled and documented.
- The database should prefer storing structured categories and a minimized/sanitized description representation; raw text retention must have a defined access and retention rule.

### 2.4 High-risk booking policy

- A high no-show prediction does not reject or cancel a booking in the first version.
- The booking remains allowed and receives a high-risk marker.
- The backend can require confirmation, request a deposit, and schedule reminders according to configuration.
- Deposit is initially optional. After enough accurate real data is collected and the team approves the policy, deposit can become required for high-risk bookings.
- The backend, not the model, decides which actions are required.

### 2.5 Prediction timing

- Request predictions when a booking is created.
- If relevant booking data changes, delete or replace the affected last booking as required by the existing workflow and request a new prediction for the new booking.
- Do not recompute the model prediction merely because an earlier queue consultation finishes.
- When the queue advances, the backend sends reminders to upcoming patients and may tell them they can arrive earlier; this is operational logic, not a new model inference.

### 2.6 Initial data and retraining

- The initial dataset will be researched, generated, reviewed, and corrected manually to make it plausible.
- The dataset must contain explicit labels for actual consultation duration and whether the patient was a no-show.
- The first model is a functional baseline, not evidence of production accuracy.
- Retraining with real data is a manual, reproducible process run by the project owner after data review.
- A new artifact is accepted only after an evaluation report and model-version approval.

## 3. Data contract

### 3.1 Training row

Each approved training row should contain a stable schema with:

- `doctor_id` or anonymized doctor group;
- specialty and service/appointment type;
- appointment date/time features;
- queue position and booking lead time;
- patient age and prior attendance statistics;
- chronic-disease indicators;
- controlled visit-reason/category;
- sanitized problem-description text or its training-time vectorized representation;
- `actual_duration_minutes` as the regression label;
- `no_show` as the classification label;


### 3.2 Runtime prediction request

The Node backend prepares a JSON request for the Python service. Every field must use the same definition used during training. For example, `age` must always mean the patient's age in years, `queue_position` must mean the patient's position in the current booking queue, and `prior_no_show_count` must count only previously recorded no-shows. Node must not rename a field or change its unit between training and production.


A request should include:



- the feature values for the current booking;

- `feature_schema_version`, identifying the exact feature definitions expected by the model;

- `model_version` or the server's configured model version;

- `correlation_id`, a unique ID generated for this prediction request so logs from Node and Python can be matched.



The Python service validates required fields, types, ranges, and allowed categories before prediction. For example, it rejects a negative age, a probability supplied as text, an unknown appointment type, or a missing chronic-disease field when that field is required. It returns a clear validation error instead of producing a prediction from malformed data.


The `model_version` identifies the trained artifact used for the answer. The `feature_schema_version` identifies the meaning and layout of the input fields. The `correlation_id` is not a patient identifier and is used only to trace one request across services for debugging and operational logs.

### 3.3 Runtime prediction response

The Python service returns a JSON result similar to:


JSON






```
{
  "predicted_duration_minutes": 24.5,
  "no_show_probability": 0.72,
  "risk_level": "high",
  "model_version": "duration-v1.2.0-no-show-v1.1.0",
  "feature_schema_version": "booking-features-v1",
  "predicted_at": "2026-11-01T14:20:56Z",
  "correlation_id": "prediction-request-abc123",
  "warnings": [],
  "data_quality": {
    "used_fallback_features": false,
    "missing_optional_fields": []
  }
}

```





Field meanings:



- `predicted_duration_minutes`: the estimated time this patient will spend with the doctor. It is not the patient's waiting time.

- `no_show_probability`: the estimated probability of absence, from `0.0` to `1.0`; `0.72` means the model estimates a 72% probability.

- `risk_level`: a label calculated from the probability and the configured threshold, such as `normal` or `high`.

- `model_version`: identifies the exact trained model artifacts that produced the result.

- `feature_schema_version`: identifies the definitions and units of the input fields.

- `predicted_at`: when the prediction was generated.

- `correlation_id`: connects this result to the matching Node and Python log entries without identifying the patient.

- `warnings`: non-fatal issues such as an optional value being absent. A warning must never hide an invalid required field.

- `data_quality`: safe operational information about whether optional values or fallback features were used; it must not contain raw medical text.



Node stores a **prediction snapshot** inside the booking item. A snapshot is the result and metadata copied at booking time, for example the 24.5-minute estimate, 0.72 probability, risk level, model version, and timestamp. This makes the booking explainable later: the team can see which prediction caused the high-risk flag even if a newer model is trained tomorrow. Replacing the model artifact does not silently rewrite old bookings; a new prediction is saved only when the backend intentionally requests one after relevant booking data changes.

## 4. Model-training design

### 4.1 Pipeline stages

1. Validate the dataset schema and allowed ranges.
2. Remove or quarantine invalid, duplicated, or unreviewed rows.
3. Split data into train/validation/test sets without leaking labels or future outcomes.
4. Preprocess numeric, categorical, and text features using a reproducible scikit-learn pipeline.
5. Train a duration regression model.
6. Train a no-show classification model.
7. Evaluate against baseline models and report metrics.
8. Save model artifacts, preprocessing, feature schema, training-data version, and model version together.
9. Produce a human-readable evaluation report before the artifact is used by the service.

### 4.2 Candidate algorithms

These are alternative model types to compare. The project does not need to use every option in production, and “build from scratch” means training on Doctory's reviewed data rather than using a pretrained medical model; scikit-learn may provide the standard algorithm implementations.


#### Duration prediction



- **Regularized linear regression baseline:** estimates duration as a weighted combination of the input features. Regularization limits extreme weights and reduces overfitting. It is simple, fast, and easy to explain, so it provides the minimum benchmark that a more complex model must beat.

- **Tree-based regressor candidate:** learns decision rules such as “if this is a follow-up visit and the patient has a chronic condition, predict a longer duration.” It can capture non-linear relationships and feature interactions that linear regression misses, while remaining easier to inspect than a neural network.



The duration model returns a numeric value in minutes. The backend must clamp or reject impossible outputs such as negative values and apply a configured operational range if the model produces an extreme estimate.


#### No-show prediction



- **Logistic regression baseline:** estimates no-show probability from a weighted combination of features. Its output is naturally a probability and its direction is relatively easy to explain.

- **Tree-based classifier candidate:** learns non-linear combinations such as attendance history, appointment timing, and booking lead time. It can output a probability that is then compared with the configured high-risk threshold.



The no-show model must be evaluated as a probability model, not only as a yes/no accuracy score. A threshold such as `0.70` is a backend policy setting and is not part of the mathematical model itself.


#### Problem-description text


The initial text approach is **TF-IDF**:



1. Normalize the short description.

2. Remove or mask direct identifiers and unsafe retained content.

3. Tokenize the remaining text.

4. Convert words or short phrases into numeric features based on how informative they are in the reviewed training dataset.

5. Limit vocabulary size and configure minimum frequency so the model does not memorize rare text.



TF-IDF is not a language model and does not understand or diagnose medical conditions. It is a transparent numeric representation used together with the structured fields.


#### Combining all features


The inputs contain different types of data:



- numeric fields such as age, queue position, and prior visit counts;

- categorical fields such as specialty, service type, and visit category;

- text features from TF-IDF.



Scikit-learn's `ColumnTransformer` applies the correct preprocessing to each group and combines the results into one feature matrix. Each prediction model is wrapped in one reproducible pipeline containing preprocessing and the estimator. This prevents training and runtime preprocessing from drifting apart: the same fitted transformations used during training are loaded with the model artifact.


#### Selection process


The team should train the simple baseline first, then compare the tree-based candidate using the same data split and preprocessing rules. The final choice is based on:



- lower validation error for duration or better probability-quality metrics for no-show;

- performance on data the model did not train on;

- stability across repeated splits and relevant patient/appointment subgroups;

- calibration and usefulness at the selected high-risk threshold;

- ability to explain the result to the doctor and team;

- training/inference cost and the amount of data available.



The most complex model is not automatically the best model. If the baseline performs similarly, the simpler model should be preferred because it is easier to explain, test, maintain, and retrain.

### 4.3 Evaluation

Duration model:

- MAE as the primary operational metric;
- RMSE to expose large errors;
- error distribution by specialty, appointment type, age group, and visit category;
- sanity checks for negative, extreme, or implausible predictions.

No-show model:

- ROC-AUC;
- precision, recall, and F1;
- confusion matrix at the configured high-risk threshold;
- calibration/reliability assessment;
- subgroup checks to identify materially different error behavior.

Metrics are reported for the synthetic baseline but are not treated as production acceptance thresholds until real-data validation is available. The report must clearly identify synthetic-data limitations.

### 4.4 Artifact and reproducibility rules

- Every artifact has a model version, dataset version, feature-schema version, training timestamp, and code version.
- Training parameters are stored in configuration rather than hidden in scripts.
- The training command must be repeatable from a clean environment.
- Artifacts are loaded read-only by the prediction service.
- A model cannot be promoted merely because training succeeded; evaluation and review are required.

## 5. Python prediction service

### 5.1 Initial runtime

During development, the service runs as a separate manually started Python process. Deployment separation can be added later. Node must use a configurable base URL so local and deployed environments do not require code changes.

### 5.2 Endpoints

- `GET /health`: service availability, loaded model versions, and readiness.
- `POST /predict`: validate a feature payload and return both predictions.
- Optional later endpoint: `GET /model-info` for non-sensitive version and schema information.

The service must not connect directly to MongoDB, mutate bookings, send reminders, or require patient identifiers.

### 5.3 Error behavior

- Invalid input returns a clear validation error.
- Missing model artifacts make the service unready rather than returning fabricated predictions.
- Service logs include correlation ID, model version, validation result, and latency, but not raw medical descriptions.
- Authentication and network restrictions are required when the service is deployed outside the local machine.

## 6. Node.js backend integration

### 6.1 AI service boundary

Implement the existing `services/aiService.js` as the only Node boundary for the Python service. It should own:

- base URL and timeout configuration;
- request validation/normalization;
- correlation IDs;
- response schema validation;
- retry policy limited to safe, idempotent prediction requests;
- explicit error types for unavailable, invalid, and stale predictions.

Routes and controllers should not call Python directly.

### 6.2 Schema changes

Extend booking items or the appropriate booking model with:

- prediction snapshot;
- model version and prediction timestamp;
- predicted duration;
- no-show probability and risk level;
- confirmation-required flag;
- deposit-required flag;
- reminder state;
- prediction status (`available`, `fallback`, `failed`, or equivalent);
- actual consultation start/end timestamps;
- actual duration;
- explicit no-show outcome;
- consent/version metadata where needed.

These fields support both explainability and later real-data retraining.

### 6.3 Booking creation flow

1. Authenticate and validate the patient request.
2. Validate and sanitize the structured and text medical inputs.
3. Verify consent.
4. Retrieve the doctor/service and existing patient history.
5. Build the runtime feature payload.
6. Call `aiService`.
7. Store the prediction snapshot.
8. Mark high-risk status when the configured threshold is reached.
9. Apply confirmation, deposit, and reminder requirements from backend configuration.
10. Create the booking and return the normal booking response plus safe prediction-derived status.

The AI result must not bypass existing authorization, duplicate-booking, capacity, or queue validations.

### 6.4 Queue and reminder flow

- Use predicted durations to estimate queue progress and upcoming wait times.
- Recalculate operational estimates when booking data changes or the queue state changes.
- Do not call the model again solely because a prior patient finished.
- Send reminders for upcoming patients and communicate that an earlier arrival may be possible according to backend rules.
- Keep prediction snapshots immutable for historical interpretation; operational estimates can be recalculated separately.

### 6.5 Fallback

If Python is unavailable or times out:

- allow booking using the configured doctor/service default duration;
- mark prediction status as unavailable/fallback;
- do not mark the patient high-risk based on missing data;
- log and expose an operational alert/metric;
- avoid silently returning a successful model prediction.

## 7. Configuration

Add environment/configuration for:

- Python service URL;
- request timeout;
- authentication secret when deployed;
- duration fallback/default;
- no-show high-risk threshold;
- confirmation requirement;
- deposit mode (`optional` initially, configurable for later required mode);
- reminder timing;
- model version pinning;
- logging/retention controls.

Thresholds and policy must not be embedded in route code.

## 8. Testing and validation

### 8.1 Training tests

- schema and range validation;
- preprocessing consistency;
- deterministic training on the same reviewed dataset;
- artifact loading;
- prediction bounds and calibration checks;
- no label leakage in feature construction.

### 8.2 Python service tests

- health/readiness behavior;
- valid prediction request;
- missing/invalid fields;
- missing artifact behavior;
- service response schema;
- no raw medical text in logs.

### 8.3 Node/backend tests

- successful booking with prediction snapshot;
- high-risk booking remains allowed and receives configured actions;
- normal-risk booking does not receive high-risk actions;
- changed booking data causes a fresh prediction;
- queue movement sends reminders without a new model call;
- timeout/unavailable service uses the explicit fallback;
- authorization and duplicate-booking behavior remain unchanged.

## 9. Documentation deliverables

The implementation should include:

- architecture and request-flow diagram;
- feature dictionary and label definitions;
- synthetic-data assumptions and review checklist;
- local Python service setup;
- training/evaluation/retraining commands;
- model-card-style limitations and known bias risks;
- API contract examples;
- booking policy and threshold configuration;
- privacy, consent, access, and retention rules;
- deployment handoff instructions for a later separately deployed Python service.

## 10. Implementation sequence

1. Freeze the feature dictionary, labels, consent rules, and API schemas.
2. Add outcome and prediction metadata fields to the Mongoose models and migration/index process.
3. Prepare and review the synthetic dataset.
4. Build preprocessing, baseline models, evaluation, and versioned artifacts.
5. Implement and test the Python health/prediction service.
6. Implement and test `services/aiService.js`.
7. Integrate prediction into booking creation and policy application.
8. Integrate duration-based queue estimates and reminder triggers without repeated inference on queue completion.
9. Add fallback, logging, metrics, and access controls.
10. Run focused tests, document the complete workflow, and perform a team review before the first demonstration.
11. When real data is available, review labels, retrain manually, compare with the baseline, approve a model version, and only then promote it.

## 11. Explicit non-goals

- The model will not diagnose patients or recommend treatment.
- The model will not directly access the database.
- The model will not automatically reject or cancel patients.
- The first version will not require deposits for every high-risk booking.
- The first version will not perform automatic retraining.
