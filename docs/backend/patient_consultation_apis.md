# Patient Queue & Consultation APIs

## Queue

### GET /queue/:bookingItemId
Get patient's current queue information.

Role:
Patient

Response:
- queue_number
- current_number
- patients_ahead
- estimated_waiting_time
- status

### POST /queue/:bookingItemId/call

Role:
Doctor / System

Description:
Call the next eligible patient in the queue.

### PATCH /queue/:bookingItemId/confirm

Role:
Patient

Description:
Confirm that the patient is ready for consultation.

### PATCH /queue/:bookingItemId/decline

Role:
Patient

Description:
Record a patient decline attempt.

Business Logic:
- First decline → call patient again.
- Second decline → cancel queue entry and call next patient.

## Medical History

### GET /patients/:patientId/medical-history

Role:
Doctor

Description:
Retrieve patient's medical history.

### GET /patients/:patientId/allergies

Role:
Doctor

Description:
Retrieve patient's allergies.

### GET /patients/:patientId/medications

Role:
Doctor

Description:
Retrieve patient's current medications.

## Consultation

### POST /consultations

Role:
Doctor

Description:
Create a new consultation.

## Consultation

### POST /consultations

Role:
Doctor

Description:
Create a new consultation.

### PATCH /consultations/:id

Role:
Doctor

Description:
Update consultation information.

### POST /consultations/:id/prescription

Role:
Doctor

Description:
Create prescription for the consultation.

### POST /consultations/:id/complete

Role:
Doctor

Description:
Complete the consultation and generate the medical report.