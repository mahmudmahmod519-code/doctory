# Doctor Module — API

## Status
The endpoints below are proposals, not confirmed existing routes. The README points to `docs/backend/README_APIs.md` as the API documentation source. Align paths, schemas, and response formats with that file before implementation.

## Proposed Endpoints

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| GET | `/api/doctor/dashboard` | Doctor | Dashboard summary (proposed) |
| GET | `/api/doctor/bookings?status=pending` | Doctor | List pending bookings for the authenticated Doctor |
| GET | `/api/doctor/bookings/:bookingId` | Doctor | Read booking details, excluding unauthorized patient data |
| PATCH | `/api/doctor/bookings/:bookingId/accept` | Doctor | Accept a pending booking |
| PATCH | `/api/doctor/bookings/:bookingId/reject` | Doctor | Reject a pending booking |
| GET | `/api/doctor/waiting-list` | Doctor | View the Doctor's waiting list |
| GET | `/api/doctor/visits/:visitId/clinical-summary` | Doctor | Read authorized clinical information (proposed) |
| PUT | `/api/doctor/visits/:visitId/diagnosis` | Doctor | Create or update diagnosis (proposed) |
| POST | `/api/doctor/visits/:visitId/prescriptions` | Doctor | Create a prescription (proposed) |
| GET | `/api/doctor/visits/:visitId/prescriptions` | Doctor | List prescriptions, if in scope (optional) |
| GET | `/api/doctor/profile/verification-status` | Doctor | Read own verification status, if implemented (optional) |

## Accept Booking
`PATCH /api/doctor/bookings/:bookingId/accept`

Expected behavior:
1. Authenticate and enforce Doctor role.
2. Verify the Doctor is authorized to manage the booking.
3. Ensure the booking is still `pending`.
4. Change status to `confirmed`.
5. Notify the patient.
6. Add the patient to the waiting queue.
7. Record the action in the Audit Log.
8. Return the updated booking status.

## Reject Booking
`PATCH /api/doctor/bookings/:bookingId/reject`

Expected behavior:
1. Authenticate and enforce Doctor role.
2. Verify the Doctor is authorized to manage the booking.
3. Ensure the booking is still `pending`.
4. Change status to `rejected`.
5. Notify the patient.
6. Free the appointment slot.
7. Record the action in the Audit Log.
8. Return the updated booking status.

## Security and Validation
- `401`: unauthenticated request.
- `403`: user lacks Doctor role/permission.
- `404`: record does not exist or is not visible under the chosen privacy policy.
- `409`: booking is no longer pending.
- Validate parameters and request bodies; the README lists Joi.
- Derive Doctor identity from authentication; do not trust a client-supplied `doctorId`.
- Enforce record-level authorization, not only role checks.
- Never return full patient account data, password hashes, or authentication secrets.
- Keep status updates, slot handling, queue insertion, and audit logging consistent; use a transaction where applicable.
- Define notification-failure behavior with the team.

## Illustrative Request
```http
PATCH /api/doctor/bookings/BOOKING_ID/accept
```

## Illustrative Success Response
```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "data": {
    "bookingId": "BOOKING_ID",
    "status": "confirmed"
  }
}
```
The response shape above is illustrative, not defined by the README.

## Questions to Confirm
1. Existing route prefixes and naming conventions?
2. Which patient/clinical fields can Doctor endpoints return?
3. Required diagnosis and prescription fields?
4. Queue ordering/update rules?
5. Exact patient re-confirmation / third-attempt rule?
6. Notification channels?
7. Are prescription/diagnosis read endpoints in scope?
