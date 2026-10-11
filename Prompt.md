# Doctor Module — UI Design Prompt

Use the prompt below with your preferred AI UI design tool.

---

Design a clean, professional, responsive Doctor Dashboard UI for a graduation project named **“AI-Powered Smart Clinic System.”**

## Screens
1. Doctor Login.
2. Doctor Dashboard with navigation and a concise overview of pending bookings and the waiting list.
3. Pending Bookings list with relevant appointment details and Accept/Reject actions.
4. Booking Details view showing only information needed for the booking decision.
5. Waiting List.
6. Patient Visit / Clinical Summary.
7. Diagnosis editor.
8. Prescription editor.
9. Optional Doctor Verification Status screen, only if supported by implementation.

## Visual Requirements
- Use a calm, trustworthy healthcare visual style.
- Use clear typography, accessible contrast, consistent spacing, and responsive desktop/tablet/mobile layouts.
- Use a left sidebar on desktop and compact mobile navigation.
- Include loading, empty, validation-error, server-error, confirmation, and success states.
- Confirm before Accept/Reject and clearly show the resulting booking status.
- Use fictional sample data only.
- Keep the interface efficient for a busy clinic day.

## Permissions and Safety
- This is a Doctor-only interface.
- Do not show Admin-only controls such as approving other doctors or viewing the system-wide Audit Log.
- Do not expose the patient's full account data; show only authorized information.
- AI outputs are suggestions only, never final diagnoses or autonomous prescriptions.
- Do not invent medical capabilities that are not in the requirements.

## Integration
- Keep UI components separate from API/business logic.
- Treat API paths in the accompanying API specification as proposed until checked against the project's API documentation.
- Include clear navigation between screens.
- Represent booking statuses `pending`, `confirmed`, and `rejected`.
- Do not claim unimplemented backend features are functional.

## Expected Output
Produce a consistent set of high-fidelity screens, responsive layouts, main interaction states, and a clear navigation flow.
