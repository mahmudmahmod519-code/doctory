# Patient User Flow

## Patient Journey

Login
  ↓
Patient Dashboard
  ↓
Upcoming Appointment
  ↓
Waiting Queue
  ↓
Turn Notification
  ↓
┌─────────────────────┐
│ Confirm or Decline? │
└─────────────────────┘
      ↓          ↓
   Confirm     Decline
      ↓          ↓
Doctor       First Decline
Consultation      ↓
      │       Call Again
      │          ↓
      │     Confirm or Decline?
      │          ↓          ↓
      │       Confirm     Decline
      │          ↓          ↓
      │      Doctor      Cancel
      │    Consultation   Appointment
      │                    ↓
      │              Call Next Patient
      ↓
Medical History
      ↓
Symptoms
      ↓
Diagnosis
      ↓
Prescription
      ↓
Complete Consultation
      ↓
Medical Report
      ↓
Patient Dashboard

## Flow Rules

1. The patient receives a notification when their turn arrives.
2. The first decline does not cancel the appointment.
3. The patient is called again after the first decline.
4. The second decline cancels the active queue entry.
5. The next eligible patient is called after cancellation.
6. The doctor must review the patient's medical history before prescribing medication.