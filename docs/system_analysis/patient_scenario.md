# Patient Scenario

## Actor
Patient

## Goal
Complete the medical consultation successfully.

## Preconditions
- Patient has an accepted appointment.
- Patient is added to the doctor's waiting queue.
- Patient is authenticated in the system.

## Main Scenario

1. The patient arrives at the clinic and waits for their turn.
2. The system displays the patient's queue number and current position.
3. When the patient's turn approaches, the system sends a notification.
4. When the patient's turn arrives, the system sends a turn notification.
5. The patient can either confirm or decline the turn.

### Case 1: Patient Confirms

6. The patient selects "Confirm".
7. The system records that the patient confirmed their turn.
8. The doctor is notified that the patient is ready.
9. The patient enters the consultation.
10. The doctor opens the patient's medical information.
11. The doctor reviews the patient's chronic diseases, allergies, current medications, and medical history.
12. The doctor asks about the patient's current symptoms and performs the examination.
13. The doctor records the symptoms and clinical notes.
14. The doctor enters the diagnosis.
15. The doctor creates the prescription.
16. The doctor completes the consultation.
17. The system saves the consultation and prescription.
18. The patient can view the medical report and prescription.

### Case 2: Patient Declines for the First Time

6. The patient selects "Decline".
7. The system records the first decline attempt.
8. The appointment is not cancelled.
9. The patient remains eligible for another call.
10. The system sends the patient another notification.

### Case 3: Patient Declines for the Second Time

6. The patient selects "Decline" again.
7. The system records the second decline attempt.
8. The system cancels the patient's active queue entry.
9. The cancellation reason is recorded.
10. The action is recorded in the audit log.
11. The patient receives a cancellation notification.
12. The system moves to the next eligible patient in the queue.
13. The next patient is notified.

## Postconditions

### If Patient Confirms
- Consultation is completed.
- Diagnosis is saved.
- Prescription is saved.
- Medical report is available.

### If Patient Declines Twice
- Patient is removed from the active queue.
- Appointment/queue entry is marked as cancelled.
- Next eligible patient is called.