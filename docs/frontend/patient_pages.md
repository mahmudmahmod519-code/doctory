# Patient Pages

## 1. Patient Dashboard

### Purpose
Allow the patient to view their upcoming appointment and current queue status.

### Components
- Patient name
- Upcoming appointment
- Doctor name
- Specialty
- Appointment date
- Appointment time
- Queue number
- Appointment status
- View Queue button

### Navigation
Patient Dashboard
→ Appointment Details
→ Waiting Queue

## 2. Waiting Queue

### Purpose
Allow the patient to monitor their position in the doctor's queue.

### Components
- Queue number
- Current patient number
- Patients ahead
- Estimated waiting time
- Doctor name
- Queue status
- Progress indicator

### Navigation
Patient Dashboard
→ Waiting Queue
→ Turn Notification

## 3. Turn Notification

### Purpose
Notify the patient that their turn has arrived.

### Components
- Doctor name
- Queue number
- Turn status
- Confirm button
- Decline button

### Navigation

Confirm
→ Doctor Consultation

Decline
→ First Decline Warning

## 4. First Decline Warning

### Purpose
Inform the patient that they declined their turn and will be called again.

### Components
- Warning message
- Doctor name
- Queue number
- Remaining attempts
- Wait for My Turn Again button

### Navigation

First Decline
→ Waiting Queue
→ Second Turn Notification

## 5. Appointment Cancelled

### Purpose
Inform the patient that their queue entry was cancelled after two declines.

### Components
- Cancellation message
- Doctor name
- Appointment date
- Queue number
- Cancellation reason
- Back to Dashboard button

### Navigation

Appointment Cancelled
→ Patient Dashboard

## 6. Doctor - Patient Medical History

### Purpose
Allow the doctor to review important medical information before consultation.

### Components
- Patient name
- Age
- Gender
- Chronic diseases
- Allergies
- Current medications
- Previous medical history

### Navigation

Doctor Queue
→ Patient Details
→ Medical History
→ Consultation

## 7. Doctor Consultation

### Purpose
Allow the doctor to conduct and document the patient's consultation.

### Components
- Patient information
- Chief complaint
- Symptoms
- Vital signs
- Clinical notes
- Examination findings
- Diagnosis
- Treatment plan
- Complete Consultation button

## 8. Prescription

### Purpose
Allow the doctor to create the patient's prescription.

### Components
- Patient name
- Diagnosis
- Medicine name
- Dosage
- Frequency
- Duration
- Instructions
- Add Medicine button
- Save Prescription button

## 9. Medical Report

### Purpose
Allow the patient to view the results of the completed consultation.

### Components
- Doctor information
- Visit date
- Patient information
- Symptoms
- Diagnosis
- Medical notes
- Prescription
- Doctor recommendations

