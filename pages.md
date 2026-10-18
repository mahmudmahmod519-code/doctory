# Doctor Module — Pages

## Scope
The project README documents these Doctor capabilities: dashboard access, managing pending bookings, viewing the waiting list, writing prescriptions, and modifying diagnosis. The Doctor must not access the patient's full account data.

> Screen layouts and detailed fields below are proposals; the README does not define exact UI designs.

## P-01 — Doctor Login
**Goal:** Let a doctor sign in.
- Email/username and password fields.
- Validation, loading, invalid-credentials, and access-denied states.
- Follow the project's JWT + HttpOnly Cookie authentication approach.
- Confirm with the team how unverified doctors are handled at login.

## P-02 — Doctor Dashboard
**Goal:** Provide a starting point for the doctor's work.
- Navigation to Pending Bookings and Waiting List.
- Suggested summary of pending bookings and waiting-list count.
- Shortcuts to doctor functions.
- Exact dashboard metrics are not specified in the README.

## P-03 — Pending Bookings
**Goal:** Review appointment requests.
- List bookings with `pending` status.
- Show relevant appointment details.
- Actions: View Details, Accept, Reject.
- Include loading, empty, error, and confirmation states.

## P-04 — Booking Details
**Goal:** Show information needed for a booking decision.
- Appointment details and only the patient data necessary for this workflow.
- Accept and Reject actions.
- Do not expose the patient's full account data.

## P-05 — Waiting List
**Goal:** View patients waiting to be seen.
- List queue entries and relevant appointment information.
- Include loading, empty, and error states.
- Queue ordering and exact fields need confirmation.

## P-06 — Patient Visit / Clinical Summary
**Goal:** Display authorized clinical information relevant to a visit.
- Clinical summary and navigation to diagnosis/prescription actions.
- This page structure is proposed, based on documented Doctor actions.

## P-07 — Diagnosis Editor
**Goal:** Create or modify diagnosis.
- Diagnosis field, Save/Cancel, validation, and success/error feedback.
- AI output must remain a suggestion; the physician makes the final medical decision.

## P-08 — Prescription Editor
**Goal:** Write a prescription.
- Prescription form, Save/Cancel, and validation feedback.
- Exact prescription fields are not specified in the README; confirm them with the team.

## P-09 — Doctor Verification Status (Optional)
The Admin reviews the Egyptian Medical Syndicate ID and activates/rejects the Doctor. A Doctor-facing status page is not defined in the README, so treat this as optional only.

## Suggested Navigation
```text
Doctor Login
  -> Doctor Dashboard
      -> Pending Bookings -> Booking Details -> Accept / Reject
      -> Waiting List -> Patient Visit
                          -> Diagnosis Editor
                          -> Prescription Editor
```

## Shared UI States
- Loading, empty, validation error, server error, and success.
- Confirmation dialog before Accept/Reject.
- Use fictional sample data.

## Privacy and Role Restrictions
- Do not show Admin-only controls such as approving other doctors or viewing the system-wide Audit Log.
- Do not expose the patient's full account data.
- AI results are suggestions, not final diagnoses.

## Questions to Confirm
1. What patient fields can the Doctor see during booking review?
2. What fields are required for diagnosis and prescription?
3. How is the waiting queue ordered?
4. Can an unverified Doctor sign in?
