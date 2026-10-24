# 🗺️ Doctory — System Diagrams & Animation Prompts

> **Graduation Project** — Faculty of Computers and Information  
> AI-Powered Smart Clinic System (نظام عيادات ذكي)

---

## 📌 How To Use This File

These prompts are meant to be **pasted one at a time into Google Stitch** (or any AI diagramming / wireframing tool) to generate **system-level visuals** — full architecture, data relationships, business scenarios, and state machines.

This file is **separate from per-page UI prompts**. Where a prompt describes a *screen* (login form, dashboard card, queue screen), it belongs in a page-level prompt library. Where a prompt describes a *system* (layers, collections, flows, state transitions, matrices), it belongs here.

**Every prompt below is self-contained.** Copy the whole fenced block, paste it, and the tool will generate the diagram.

### 🔔 Notification Policy Reminder

> In-app notifications for routine events, email (Nodemailer) for critical events only, **NO SMS anywhere in the system** — reflect this in every diagram that involves notifications.

**Critical events that trigger email** (exact list): email verification · forgot/reset password · doctor verification approve/reject · final booking accept/reject · deletion-request decision.

**Routine events that are in-app only**: queue position updates, turn warnings, appointment cancellation notices, system notices, admin dashboard activity.

**Never include** an SMS box, an SMS icon, a Twilio/Vonage/MessageBird logo, or a phone-bubble with a checkmark in any generated diagram. When the tool attempts to add one, remove it and re-prompt: *"Remove the SMS channel. This system uses in-app notifications plus email for critical events only."*

---

## 📑 Index

| # | Section | Type |
|---|---------|------|
| 1 | [Full System Architecture Diagram](#1-full-system-architecture-diagram) | Diagram |
| 2 | [Entity-Relationship (ER) Diagram](#2-entity-relationship-er-diagram) | Diagram |
| 3 | [Authentication & 2FA Sequence Diagram](#3-authentication--2fa-sequence-diagram) | Diagram |
| 4 | [Role-Based Access Control (RBAC) Matrix](#4-role-based-access-control-rbac-matrix) | Diagram |
| 5 | [Booking Lifecycle State Diagram](#5-booking-lifecycle-state-diagram) | Diagram |
| 6 | [Doctor Verification Flow](#6-doctor-verification-flow-scenario-2) | Diagram + Animation |
| 7 | [Waiting Queue & Decline Logic Flow](#7-waiting-queue--decline-logic-flow-scenario-1-cases-abc) | Diagram + Animation |
| 8 | [Full Consultation Flow](#8-full-consultation-flow-scenario-1-case-a-continued) | Diagram |
| 9 | [Admin User Management Flow](#9-admin-user-management-flow-scenario-3) | Diagram |
| 10 | [Waiting List Management Flow](#10-waiting-list-management-flow-scenario-4) | Diagram + Animation |
| 11 | [Data Deletion Request Flow — Law 151/2020](#11-data-deletion-request-flow--law-1512020-scenario-5) | Diagram |
| 12 | [Notification System Flow](#12-notification-system-flow-cross-cutting) | Diagram |
| 13 | [Audit Log Write Flow](#13-audit-log-write-flow-cross-cutting) | Diagram |
| 14 | [Mongoose vs Previous Architecture](#14-mongoose-vs-previous-architecture-migration-note-diagram) | Diagram |
| — | [🔁 General Diagram & Animation Style Guide](#-general-diagram--animation-style-guide) | Style guide |

---

## 1. Full System Architecture Diagram

**Diagram Prompt**

```
Create a clean, professional system architecture diagram for an academic graduation project titled
"Doctory" with the Arabic subtitle "نظام عيادات ذكي" (AI-Powered Smart Clinic System).

LAYOUT: 5 horizontal layers, top to bottom, white background, landscape 16:9, flat vector style.

LAYER 1 — CLIENTS (light blue boxes, 3 side by side):
  - "Patient Mobile App" (Flutter) — iOS & Android
  - "Doctor Web Portal" (EJS server-side rendering)
  - "Admin Web Portal" (EJS server-side rendering)
All three point DOWN into the API Gateway with solid arrows. Label the arrows "HTTPS / JSON".

LAYER 2 — API GATEWAY (one wide dark-blue box centered below the clients):
  Title: "Express.js REST API"
  Subtitle: "Single entry point — all clients speak JSON"
  Inside the box, show 5 small pill-shaped middleware chips in one row:
    "Auth Middleware (JWT + HTTP-Only Cookies)", "RBAC Middleware", "Rate Limiter",
    "Validation (Joi)", "Security Logger"

LAYER 3 — CORE SERVICES (4 teal boxes side by side, branching downward from the API box):
  - "Auth Service" — JWT access + refresh tokens, 2FA (TOTP), password reset, role & status enforcement
  - "Booking & Queue Service" — bookings, booking_items, confirm/decline logic, queue order & wait estimation
  - "Notification Service" — in-app notifications + critical emails ONLY.
    Include a small red crossed-out SMS bubble icon with the label "No SMS".
    Add the annotation: "In-App + Critical Email Only".
  - "Audit & Compliance Service" — audit_logs, deletion_requests, Egyptian Law 151/2020, soft delete & restore

LAYER 4 — DATA LAYER (2 boxes):
  - "MongoDB (Mongoose)" — SOLID green border, the primary store. List the 11 collections inside as
    small monospace chips: users, doctor_portfolios, doctor_works, bookings, booking_items, reviews,
    reports, audit_logs, deletion_requests, refresh_tokens, notifications
  - "Redis" — GRAY DASHED border (planned/future), labeled "Planned — cache & queue store".
    Sub-label: "Booking & Queue Service · session store · wait-time cache"

LAYER 5 — EXTERNAL & PLANNED INTEGRATIONS (side branches at the bottom):
  - "AI Microservice" — GRAY DASHED border, reached by a DASHED arrow from the API Gateway.
    Contains 3 bullet items: "Symptom-to-Specialty NLP Routing", "Prescription OCR", "Analytics".
    Annotation: "Clinical decision support — suggestions only, never a final diagnosis"
  - "Nodemailer SMTP" — SOLID purple border, reached by a SOLID arrow from the NOTIFICATION SERVICE
    ONLY (not from the API box). Contains a note box: "Critical events only: email verification,
    password reset, doctor approval, final booking decision, deletion-request decision".

STYLE RULES:
  - Rounded rectangles for everything. Solid 2px border + soft shadow = IMPLEMENTED.
    Dashed 2px gray border + no shadow = PLANNED / FUTURE.
  - Color code: Clients = light blue, API Gateway = dark blue (white text), Core Services = teal,
    Data Layer = green, External/live = purple, Planned = gray dashed.
  - Arrows show clear direction of data flow. Between the data layer and the services use
    double-headed (bidirectional) arrows labeled "read / write".
  - Include a legend box in the corner explaining: solid = implemented, dashed = planned,
    and the color mapping.
  - Title "Doctory" large, with the Arabic subtitle "نظام عيادات ذكي" directly underneath,
    and the English line "AI-Powered Smart Clinic System" below that.
  - Do NOT add any SMS channel, SMS icon, or mobile push gateway.
```

---

## 2. Entity-Relationship (ER) Diagram

**Diagram Prompt**

```
Create a professional ER diagram for the Doctory MongoDB database, landscape, white background,
crow's foot notation for relationship cardinality.

Title: "Doctory — MongoDB Data Model" with Arabic subtitle "نظام عيادات ذكي".

IMPORTANT: MongoDB is the only database. Do NOT show MySQL or TypeORM anywhere.

GROUP THE ENTITIES INTO TWO COLOURED CLUSTERS:
  - PATIENT-CLUSTER entities = soft warm background (light peach/amber)
  - DOCTOR-CLUSTER entities = soft cool background (light teal)
  - SYSTEM/INFRA entities = neutral light gray

ENTITIES (show each as a rounded rectangle table with a colored header, key fields listed,
with a small key icon on the primary key and "FK" markers on references):

1. users (PATIENT-CLUSTER + SYSTEM — center, light gray-blue)
   PK user_id (UUID, unique) | role [admin|doctor|patient] | status [active|pending|suspended]
   name | email (unique) | email_verified | password_hash | phone | address | birth_date
   enable_2fa | secure_key | last_login | deleted_at (soft delete) | deleted_by (FK→users)

2. doctor_portfolios (DOCTOR-CLUSTER)
   PK portfolio_id (UUID) | FK user_id → users | doctor_name | specialty | title
   background_image | profile_image | phone_number | working_hours

3. doctor_works (DOCTOR-CLUSTER)
   PK work_id (UUID) | FK portfolio_id → doctor_portfolios | status [pending|active|rejected]
   title | image | price | description | duration_session | working_time | deleted_at

4. bookings (DOCTOR-CLUSTER)
   PK _id (ObjectId) | FK portfolio_id → doctor_portfolios | type [booking|consulting]
   total_patients (default 50) | status [pending|active|expired|cancelled]
   appointment_date | appointment_time | deleted_at

5. booking_items (PATIENT-CLUSTER, sits between patients and sessions)
   PK _id (ObjectId) | FK booking_id → bookings | FK user_id → users
   queue_number | patient_name | patient_phone | patient_age | patient_address (all snapshots)
   status [pending|accepted|rejected|completed|cancelled] | qr_code | completed_at | deleted_at
   Note on the entity: "UNIQUE index on (booking_id, user_id) prevents duplicate bookings"

6. reviews (PATIENT-CLUSTER)
   PK _id | FK user_id → users | FK portfolio_id → doctor_portfolios | feedback | rating (1-5)

7. reports (PATIENT-CLUSTER)
   PK _id | FK user_id → users | FK portfolio_id → doctor_portfolios | description | medicines (array)

8. notifications (PATIENT-CLUSTER) — HIGHLIGHT THIS ENTITY:
   Give it a DISTINCT accent color (deep teal header with a subtle glow ring) and add a small
   callout badge reading "NEWEST ADDITION".
   PK notification_id (UUID) | FK user_id → users
   type [queue_update|booking_accepted|booking_rejected|turn_warning|appointment_cancelled|
          doctor_verified|deletion_request_update|system]
   title | message | is_read (default false) | related_entity_type | related_entity_id
   Annotation: "In-app only. Email (Nodemailer) is used separately for critical events. NO SMS."

9. audit_logs (SYSTEM) — insert-only, draw with a small "insert only" lock tag
   PK _id | actor_id | actor_role | action | entity_type | entity_id | ip | metadata (JSON)

10. deletion_requests (SYSTEM)
    PK _id | FK user_id → users | status [pending|approved|rejected] | reason
    FK reviewed_by → users | reviewed_at
    Annotation: "Egyptian Personal Data Protection Law 151/2020"

11. refresh_tokens (SYSTEM)
    PK _id | FK user_id → users | token (unique) | expires_at (TTL index) | revoked_at

RELATIONSHIP LABELS with crow's foot notation:
  users 1 —— N doctor_portfolios      (a user has 0..1 portfolio)
  doctor_portfolios 1 —— N doctor_works
  doctor_portfolios 1 —— N bookings
  bookings 1 —— N booking_items
  users 1 —— N booking_items
  users 1 —— N reviews / reports / notifications / refresh_tokens / deletion_requests
  doctor_portfolios 1 —— N reviews / reports
  users 1 —— N deletion_requests (reviewed_by is a second, separate self-reference)

STYLE: rounded rectangle entities, clean orthogonal connector lines with crow's foot endings,
field lists in small monospace text, entity headers colour-coded by cluster, soft shadows,
no decorative imagery, no SMS anything.
```

---

## 3. Authentication & 2FA Sequence Diagram

**Diagram Prompt**

```
Create a professional UML-style sequence diagram for the Doctory authentication flow, landscape,
white background, clean and technical.

Title: "Doctory — Authentication & 2FA Sequence" with Arabic subtitle "نظام عيادات ذكي".

ACTORS (left to right):
  1. "Patient / Doctor / Admin" (stick figure)
  2. "Express.js API" (the API Gateway box, showing the middleware chain:
     Auth Middleware → RBAC Middleware → Validation (Joi))
  3. "Auth Service"  (JWT signing, 2FA, refresh tokens, password reset)
  4. "MongoDB (Mongoose)"  (users, refresh_tokens collections)
  5. "Nodemailer SMTP"     (critical events only)
  6. "Google Authenticator (TOTP)" — draw a phone outline

SEQUENCE 1 — LOGIN:
  1. Actor → API: "POST /api/auth/login  { email, password }"
  2. API → API: "Auth Middleware (not yet authenticated — pass through)"
  3. API → Auth Service: validate credentials
  4. Auth Service → MongoDB: "users.findOne({ email })"
  5. MongoDB → Auth Service: user document (password_hash, role, status)
  6. Auth Service → Auth Service: "bcrypt.compare(password, password_hash)"
  7. Auth Service → Auth Service: check account status
       - if status = 'suspended' or deleted_at set → return 403 Forbidden
       - if status = 'pending' and role = 'doctor' → return 403 (not yet verified)
  8. Auth Service → Google Authenticator: "enable_2fa ?"
       - Patient: optional, skip if not enabled
       - Doctor / Admin: 2FA is MANDATORY
  9. Google Authenticator → Actor: show a TOTP code prompt
  10. Actor → API: "POST /api/auth/2fa/verify { token }"
  11. API → Auth Service: verify TOTP using speakeasy (base32 secret, TOTP window)
  12. Auth Service → MongoDB: "refresh_tokens.insertOne({ user_id, token, expires_at })"
  13. Auth Service → API: "sign Access JWT (expires_in 1d) + sign Refresh JWT (expires_in 7d)"
  14. API → Actor: "Set-Cookie: session_token = <Access JWT>  HttpOnly, SameSite=Strict, Secure in production"
  15. API → Actor: "Set-Cookie: refresh_token = <Refresh JWT>  HttpOnly, SameSite=Strict"
  16. API → Actor: "200 OK { success, data: { user_id, name, email, role, status } }"
  17. Auth Service → MongoDB: "users.updateOne({ user_id }, { last_login: now })"

SEQUENCE 2 — REFRESH:
  1. Actor → API: "any protected request with expired Access JWT"
  2. API → Actor: "401 Unauthorized"
  3. Actor → API: "POST /api/auth/refresh  (refresh_token cookie)"
  4. Auth Service → MongoDB: "refresh_tokens.findOne({ token })"
  5. Auth Service → Auth Service: "check expires_at and revoked_at"
       - invalid / expired / revoked → 401 Unauthorized, user must log in again
  6. Auth Service → API: issue a new Access JWT
  7. API → Actor: "Set-Cookie: session_token = <new Access JWT>"

SEQUENCE 3 — LOGOUT & REVOCATION:
  1. Actor → API: "POST /api/auth/logout"
  2. Auth Service → MongoDB: "refresh_tokens.updateOne({ user_id }, { revoked_at: now })"
  3. API → Actor: "Clear-Cookie: session_token; Clear-Cookie: refresh_token" → "204 No Content"
  4. Show a side note: "Admin force-logout and role/status changes revoke ALL refresh tokens
     for that user. The current Access JWT stays valid until it expires."

SEQUENCE 4 — FORGOT / RESET PASSWORD (critical event → EMAIL):
  1. Actor → API: "POST /api/auth/forgot-password { email }"
  2. Auth Service → MongoDB: "users.findOne({ email })"
  3. NOTE over the response: "Always reply 200 with the same generic message so the response
     never reveals whether the email exists"
  4. Auth Service → MongoDB: "users.updateOne({ user_id }, { token: <resetToken> })"
  5. Auth Service → Nodemailer: "send reset link (valid 1 hour)"
  6. Nodemailer → Actor: "CRITICAL EVENT — email sent"
  7. Actor → API: "POST /api/auth/reset-password { token, new_password }"
  8. Auth Service → MongoDB: "validate token + expiry, then update password_hash (bcrypt)"

STYLE: lifeline dashed vertical lines, activation bars on lifelines, numbered step badges,
message arrows with labels, "alt" / "opt" fragments for the conditional branches
(2FA required, invalid credentials, suspended account, token expired), monospace for payloads,
no SMS actor and no SMS messages anywhere.
```

---

## 4. Role-Based Access Control (RBAC) Matrix

**Diagram Prompt**

```
Create a clean, presentation-quality RBAC permission matrix table for the Doctory system,
landscape, white background.

Title: "Doctory — Role-Based Access Control Matrix" with Arabic subtitle "نظام عيادات ذكي".

STRUCTURE: a grid table.
  - Header row: an empty corner cell, then three coloured role headers:
      "PATIENT" (light blue), "DOCTOR" (teal), "ADMIN" (dark blue with white text)
  - Left column: the permission name, in dark bold text, with a small category icon
  - Body cells: permission marks, centred

PERMISSION ROWS (in this order), grouped into labelled sub-sections with a subtle
section-divider row:

  ACCOUNT & PROFILE
   - Register an account
   - Verify email address
   - Manage own profile & settings
   - Change own password
   - Request deletion of own data
   - View own medical history & reports
   - Submit a review after a completed visit

  BOOKINGS & QUEUE
   - Book an appointment
   - Accept / Reject a booking
   - Confirm / Decline own queue turn
   - View own waiting-list position
   - View a patient's clinical information
   - Write a diagnosis
   - Write a prescription
   - Complete a consultation

  DOCTOR MANAGEMENT
   - Verify / approve / reject doctors
   - Manage own portfolio & working hours
   - Manage own services (submit for review)
   - Approve / reject doctor services

  ADMINISTRATION
   - Manage users & roles
   - Suspend / restore an account
   - Force-logout a user
   - View the system-wide audit log
   - Approve / reject deletion requests

MARKS — use exactly this system and explain it in a small legend at the bottom:
   ✓  (green filled circle) = full permission
   ◐  (amber half circle)     = limited / partial permission
   ✗  (red light circle)      = no permission

CORRECT MARKINGS:
  PATIENT:
   Register an account = ✓ | Verify email = ✓ | Manage own profile = ✓ | Change own password = ✓
   Request deletion of own data = ✓ | View own medical history & reports = ✓ | Submit a review = ✓
   Book an appointment = ✓ | Accept / Reject a booking = ✗ | Confirm / Decline own queue turn = ✓
   View own waiting-list position = ✓ | View a patient's clinical information = ✗
   Write a diagnosis = ✗ | Write a prescription = ✗ | Complete a consultation = ✗
   Verify doctors = ✗ | Manage own portfolio = ✗ | Manage own services = ✗
   Approve / reject services = ✗ | Manage users & roles = ✗ | Suspend / restore = ✗
   Force-logout a user = ✗ | View audit log = ✗ | Approve deletion requests = ✗

  DOCTOR:
   Register an account = ✓ | Verify email = ✓ | Manage own profile & settings = ✓
   Change own password = ✓ | Request deletion of own data = ✓
   View own medical history & reports = ◐ (own patients' authorised clinical data only)
   Submit a review = ✗ | Book an appointment = ✗ | Accept / Reject a booking = ✓
   Confirm / Decline own queue turn = ◐ (calls the next patient, but cannot answer for them)
   View own waiting-list position = ✓ | View a patient's clinical information = ✓
   Write a diagnosis = ✓ | Write a prescription = ✓ | Complete a consultation = ✓
   Verify doctors = ✗ | Manage own portfolio & working hours = ✓ | Manage own services = ✓
   Approve / reject doctor services = ✗ | Manage users & roles = ✗ | Suspend / restore = ✗
   Force-logout = ✗ | View audit log = ✗ | Approve deletion requests = ✗

  ADMIN:
   Register an account = ✗ (admins are created by an existing admin)
   Verify email = ✗ | Manage own profile & settings = ✓ | Change own password = ✓
   Request deletion of own data = ✓ | View own medical history & reports = ✗
   Submit a review = ✗ | Book an appointment = ✗ | Accept / Reject a booking = ◐
     (admin can update a booking item's status, but accept/reject is a doctor action)
   Confirm / Decline own queue turn = ✗ | View own waiting-list position = ✓
   View a patient's clinical information = ◐ (demographics + booking history only —
     medical report CONTENT is never shown to admin)
   Write a diagnosis = ✗ | Write a prescription = ✗ | Complete a consultation = ✗
   Verify / approve / reject doctors = ✓ | Manage own portfolio = ✗ | Manage own services = ✗
   Approve / reject doctor services = ✓ | Manage users & roles = ✓ | Suspend / restore = ✓
   Force-logout a user = ✓ | View the system-wide audit log = ✓ | Approve deletion requests = ✓

ADD A FOOTNOTE BAR at the bottom with these three guards, in a soft red-tinted strip:
  "GUARDS — An admin cannot change their own role, suspend themselves, or delete themselves.
   The LAST active admin can never be deleted or deactivated.
   Changing a role or suspending an account revokes all of that user's refresh tokens."

STYLE: rounded table with soft shadow, coloured header cells, generous cell padding,
zebra row striping in very light gray, section-divider rows in uppercase letterspaced caps,
a clean legend row at the bottom, no imagery.
```

---

## 5. Booking Lifecycle State Diagram

**Diagram Prompt**

```
Create a clean state-machine diagram for the Doctory booking lifecycle, landscape, white background.

Title: "Doctory — Booking Lifecycle State Machine" with Arabic subtitle "نظام عيكات ذكي".
(Correct the Arabic subtitle exactly as: نظام عيادات ذكي)

THIS IS THE booking_items COLLECTION STATUS (the individual patient entry inside a booking session).

STATES — draw as rounded rectangles, one per status, colour-coded by outcome:

  [ pending ]        — WHITE with a blue border, label "PENDING" (default state)
  [ accepted ]       — GREEN fill, label "ACCEPTED"
  [ completed ]      — DEEP GREEN fill, white text, label "COMPLETED"
  [ rejected ]       — RED fill, white text, label "REJECTED"
  [ cancelled ]      — AMBER/ORANGE fill, white text, label "CANCELLED"

TRANSITIONS — every arrow must carry a bold trigger label plus a smaller condition note:

  pending ──► accepted
     trigger label: "Doctor accepts the booking"
     note: "booking_items.status = 'accepted' · patient is added to the waiting queue ·
            in-app notification to patient · critical email to patient · audit_logs entry"

  pending ──► rejected
     trigger label: "Doctor rejects the booking"
     note: "booking_items.status = 'rejected' · the appointment slot is freed ·
            in-app notification to patient · critical email to patient · audit_logs entry"

  accepted ──► completed
     trigger label: "Doctor completes the visit"
     note: "booking_items.status = 'completed' · completed_at is set to now ·
            consultation + prescription are saved · a medical report is generated"

  accepted ──► cancelled
     trigger label: "Patient declines the turn TWICE"
     note: "booking_items.status = 'cancelled' · cancellation reason is recorded ·
            in-app notification to patient · critical email to patient · audit_logs entry ·
            the system automatically calls the next eligible patient"

  accepted ──► rejected
     trigger label: "Admin removes the patient from the session (soft delete)"
     note: "status = 'rejected' + deleted_at set · the patient moves to the REMOVED group
            in the waiting list · audit_logs entry"

  pending ──► cancelled
     trigger label: "Admin cancels the whole session"
     note: "bookings.status = 'cancelled' and every pending/accepted item in that session
            is cancelled too · each affected patient gets an in-app notification"

  completed ──► (terminal)
  rejected  ──► (terminal)
  cancelled ──► (terminal)

ADD A SECOND, SMALLER STATE MACHINE to the right for the PARENT booking session
(bookings collection), titled "Session status (bookings)":
  [ pending ] ──► [ active ] ──► [ expired ]
                      │
                      └──► [ cancelled ]
  note under it: "bookings.type = 'booking' (exam) or 'consulting' ·
                  bookings.total_patients = 50 by default"

ADD A CALLOUT BOX in a corner:
  "NAMING NOTE — the database enum uses 'accepted'. Some product documents and UI labels
   say 'confirmed' for the same state. The database value is authoritative:
   booking_items.status ∈ [ pending | accepted | rejected | completed | cancelled ]"

STYLE: rounded state boxes, clean orthogonal or curved connectors with arrowheads,
bold trigger labels on every edge, small monospace note boxes attached to edges,
clean white background, no decorative graphics.
```

---

## 6. Doctor Verification Flow (Scenario 2)

**Diagram Prompt**

```
Create a professional flowchart for the Doctory doctor verification process, portrait or
landscape, white background.

Title: "Doctory — Doctor Verification Flow" with Arabic subtitle "نظام عيادات ذكي".

FLOWCHART (rounded rectangles = actions, diamonds = decisions, parallelograms = outputs):

  (Start, rounded pill) "Doctor opens /auth/register/doctor"
        │
        ▼
  "Doctor enters personal data, specialty, professional title"
        │
        ▼
  "Uploads Egyptian Medical Syndicate ID image"   [attach a small document/upload icon]
        │
        ▼
  "POST /api/auth/register/doctor"  [show the endpoint as a monospace label]
        │
        ▼
  "Account created — users.status = 'pending'"
  "verification record created with status = 'pending'"
        │
        ▼
  ┌──────────────────────────────┐
  │ Admin opens                   │
  │ /admin/doctors/verification   │
  └──────────────────────────────┘
        │
        ▼
  "GET /api/admin/doctors/pending"  → table of doctors awaiting review
        │
        ▼
  "Admin opens a request and reviews the Medical ID image + data"
        │
        ▼
  ◆ DECISION: "Approve or Reject?"
        │
        ├── APPROVE ──► "PATCH /api/admin/doctors/:id/approve"
        │                   │
        │                   ▼
        │             "verification.status = 'approved'"
        │             "users.status = 'active'"
        │                   │
        │                   ▼
        │             ┌────────────────────────────────────┐
        │             │ In-app notification (doctor_verified)│
        │             │ CRITICAL EMAIL to the doctor         │
        │             │ audit_logs entry: DOCTOR_APPROVED     │
        │             └────────────────────────────────────┘
        │                   │
        │                   ▼
        │             "Doctor can now access protected doctor features"
        │
        └── REJECT ───► "PATCH /api/admin/doctors/:id/reject  { reason }"
                            │
                            ▼
                      ◆ DECISION: "reason length ≥ 10 characters?"
                            │
                            ├── NO ──► "400 Bad Request — reason is mandatory"
                            │
                            └── YES ─► "verification.status = 'rejected'"
                                       "rejection_reason stored"
                                       "the ACCOUNT STAYS ALIVE — no re-registration needed"
                                            │
                                            ▼
                                      ┌────────────────────────────────────┐
                                      │ In-app notification (doctor_verified)│
                                      │ CRITICAL EMAIL to the doctor         │
                                      │ audit_logs entry: DOCTOR_REJECTED     │
                                      └────────────────────────────────────┘
                                            │
                                            ▼
                                      "Doctor uploads a NEW Medical ID from the SAME account"
                                            │
                                            ▼
                                      "verification returns to 'pending' → Attempt 2"
                                            │
                                            └──► loops back to the Admin review step

COLOUR RULES: start/end pills in light gray, action rectangles in teal (matching the
Core Services colour), decision diamonds in soft amber, the APPROVE branch in green,
the REJECT branch in red, email/notification callouts in purple, and every arrow to
an email labelled "CRITICAL EVENT — email".

STYLE: clean orthogonal connectors with arrowheads, small monospace endpoint labels,
no SMS icon anywhere, no decorative imagery.
```

**Animation Prompt**

```
Animate the status badge in the Doctory doctor verification UI.

Show a single status badge component in the centre of a clean white screen, cycling
smoothly through its three states with a soft, professional medical-dashboard feel.

STATES AND COLOURS:
  PENDING   — amber / warm yellow fill, dark amber text, subtle pulsing glow
  APPROVED  — green fill, white text, static calm glow
  REJECTED  — red fill, white text, static calm glow

TRANSITION BEHAVIOUR:
  - The badge morphs its background colour smoothly over 400ms with an ease-out curve
    (cubic-bezier(0.22, 1, 0.36, 1)) — no hard cuts, no colour flashing.
  - Simultaneously the text cross-fades: the old word slides up 6px and fades out while
    the new word slides in from 6px below and fades in, over the same 400ms.
  - A subtle scale bounce accompanies the change: the badge scales 1.00 → 1.06 → 1.00
    over 380ms, with a gentle ease-out on the way up and ease-in on the way back.
  - A soft coloured ring shadow expands outward once on each change (ring pulses out to
    1.18× and fades to 0 over 500ms), tinted with the NEW state colour.
  - The icon inside the badge swaps with a 180ms cross-fade — a clock/hourglass for
    PENDING, a checkmark for APPROVED, an X for REJECTED.
  - While the state is PENDING, the badge has a slow 2-second breathing pulse
    (opacity 1.0 → 0.82 → 1.0) to signal that the review is still in progress.
    APPROVED and REJECTED do not pulse.
  - When a REJECTED state is reached, a one-time horizontal shake of 6px over 300ms
    plays, and a small "Reason required (min 10 characters)" helper line fades in below
    the badge — a single occurrence, not a loop.

STYLE: white background, the badge as a rounded pill with 999px radius, subtle shadow,
Inter or IBM Plex Sans Arabic typography, no bounce beyond the single described scale,
no confetti, no SMS icon.
```

---

## 7. Waiting Queue & Decline Logic Flow (Scenario 1, Cases A/B/C)

**Diagram Prompt**

```
Create a professional flowchart for the Doctory waiting queue and patient decline logic,
landscape, white background.

Title: "Doctory — Waiting Queue & Decline Logic" with Arabic subtitle "نظام عيادات ذكي".

FLOWCHART:

  (Start) "Doctor accepts a booking"
        │
        ▼
  "booking_items.status = 'accepted'"
        │
        ▼
  "Patient is added to the waiting queue, ordered by queue_number"
        │
        ▼
  "System calls the next eligible patient"
        │
        ▼
  "POST /queue/:bookingItemId/call  (doctor or system)"
        │
        ▼
  "In-app TURN NOTIFICATION sent to the patient  (type: turn_warning)"
        │
        ▼
  ◆ DECISION: "Patient response within the call window?"
        │
        ├── NO RESPONSE ──► "Treat as a decline · follow the decline path below"
        │
        ├── CASE A — CONFIRM ──► "PATCH /queue/:bookingItemId/confirm"
        │                         │
        │                         ▼
        │                   "Turn confirmed · doctor is notified the patient is ready"
        │                         │
        │                         ▼
        │                   "Patient enters the consultation"
        │                         │
        │                         ▼
        │                   "→ continue to the Consultation Flow diagram"
        │                         │
        │                         ▼
        │                   (End) "Consultation completed"
        │
        ├── CASE B — FIRST DECLINE ──► "PATCH /queue/:bookingItemId/decline"
        │                                  │
        │                                  ▼
        │                            "decline attempt 1 recorded"
        │                                  │
        │                                  ▼
        │                            "Appointment is NOT cancelled"
        │                            "Patient stays eligible for another call"
        │                                  │
        │                                  ▼
        │                            "In-app FIRST DECLINE WARNING sent to the patient"
        │                            "Remaining attempts shown: 1"
        │                                  │
        │                                  ▼
        │                            "System calls the patient again"
        │                                  │
        │                                  └──► loops back to the turn-notification step
        │
        └── CASE C — SECOND DECLINE ──► "PATCH /queue/:bookingItemId/decline"
                                           │
                                           ▼
                                     "decline attempt 2 recorded"
                                           │
                                           ▼
                                     "booking_items.status = 'cancelled'"
                                     "cancellation reason is stored"
                                           │
                                           ▼
                                     ┌──────────────────────────────────────┐
                                     │ In-app APPOINTMENT CANCELLED notice   │
                                     │ CRITICAL EMAIL to the patient         │
                                     │ audit_logs entry                       │
                                     └──────────────────────────────────────┘
                                           │
                                           ▼
                                     "The system automatically calls the NEXT
                                      eligible patient in the queue"
                                           │
                                           ▼
                                     (End) "Queue continues"

SIDE ANNOTATION BOX (bottom-left, soft gray):
  "Decline rule — the FIRST decline does not cancel the appointment. The SECOND decline
   cancels the active queue entry, is written to the audit log, notifies the patient, and
   the system moves on to the next eligible patient automatically."

STYLE: teal action boxes, amber decision diamonds, green for the confirm branch,
amber for the first-decline branch, red for the second-decline branch, purple for
in-app/email callouts, clean orthogonal connectors, monospace endpoint labels,
no SMS icon anywhere.
```

**Animation Prompt**

```
Animate the Doctory patient waiting queue screen.

SCENE 1 — THE QUEUE COUNTER (the main element):
  A large circular progress ring, 240px diameter, with a soft 10px stroke and a rounded cap,
  sits centred on a white card. Inside it, a big queue number.
  - As the patient's position advances, the ring fills clockwise smoothly over 600ms
    using an ease-out curve. The fill colour is a calm medical teal.
  - The number inside cross-fades and counts DOWN digit by digit: each digit change is a
    200ms upward slide + fade, staggered 60ms per digit, so "14" → "13" feels mechanical
    and precise rather than bouncy.
  - Below the ring, a caption "patients ahead" counts down in sync, and an estimated
    wait time in minutes ticks with a subtle fade — never a jump-cut.
  - A thin secondary ring behind the main ring shows the overall session progress.

SCENE 2 — URGENCY AS THE TURN APPROACHES:
  - When the patient is more than 3 positions away, the card is calm: no motion, neutral
    teal, and the notification bell does nothing.
  - When the patient is 1 to 3 positions away, the card enters a gentle "approaching" state:
    the ring's teal deepens slightly, a soft outer glow pulses once every 3 seconds at low
    opacity, and the estimated wait time fades in.
  - When it is the patient's turn, the state becomes "your turn": the ring completes its
    full sweep in 500ms, the number scales from 1.0 → 1.08 → 1.00 with a single ease-out
    bounce, and the card background cross-fades to a soft green wash. A subtle 2-second
    breathing pulse on the glow signals that the turn is live and waiting for a response.

SCENE 3 — THE TURN NOTIFICATION:
  - The notification slides down from the top of the screen over 350ms (ease-out) with a
    6px upward offset, and gently settles — it does not bounce.
  - The Confirm button is the primary action in solid teal; Decline is a quiet outlined
    secondary action.
  - A countdown ring on the notification shows the response window.
  - If the patient declines, the notification collapses back upward over 250ms and the
    "FIRST DECLINE — you will be called again" warning slides in its place, with a small
    remaining-attempts indicator. No harsh red, no alarming shaking.
  - After a second decline, the card cross-fades to the CANCELLED state in a soft amber.

STYLE: white background, modern medical-dashboard aesthetic, Inter or IBM Plex Sans Arabic,
generous whitespace, 300-600ms transitions, ease-out curves throughout, no confetti,
no notification sound animation, and no SMS references.
```

---

## 8. Full Consultation Flow (Scenario 1, Case A continued)

**Diagram Prompt**

```
Create a professional flowchart for the Doctory in-consultation flow, landscape, white background.

Title: "Doctory — Full Consultation Flow" with Arabic subtitle "نظام عيادات ذكي".

FLOWCHART (horizontal swim-lane style, with 2 lanes: "DOCTOR" on top, "SYSTEM" below):

  (Start) "Patient confirms the queue turn"
        │
        ▼
  ┌─ DOCTOR LANE ────────────────────────────────────────────────┐
  │ "Opens the patient's visit"                                    │
  │ "GET /api/doctor/visits/:visitId/clinical-summary"             │
  │ "GET /patients/:patientId/medical-history"                     │
  │ "GET /patients/:patientId/allergies"                           │
  │ "GET /patients/:patientId/medications"                         │
  │   ↳ annotation: "Chronic diseases · drug allergies · current  │
  │      medications · previous medical history"                   │
  └────────────────────────────────────────────────────────────────┘
        │
        ▼
  ┌─ DOCTOR LANE ────────────────────────────────────────────────┐
  │ "Records the chief complaint and symptoms"                     │
  │ "Records vital signs and examination findings"                 │
  │ "Writes clinical notes"                                        │
  └────────────────────────────────────────────────────────────────┘
        │
        ▼
  ┌─ DOCTOR LANE ────────────────────────────────────────────────┐
  │ "Enters the DIAGNOSIS"                                         │
  │ "PUT /api/doctor/visits/:visitId/diagnosis"                    │
  │   ↳ annotation: "AI suggestions are shown as suggestions only  │
  │      — the doctor makes and owns the final clinical decision"  │
  └────────────────────────────────────────────────────────────────┘
        │
        ▼
  ┌─ DOCTOR LANE ────────────────────────────────────────────────┐
  │ "Creates the PRESCRIPTION"                                    │
  │ "POST /api/doctor/visits/:visitId/prescriptions"               │
  │   ↳ per medicine: name · dosage · frequency · duration ·      │
  │      instructions"                                             │
  └────────────────────────────────────────────────────────────────┘
        │
        ▼
  ┌─ DOCTOR LANE ────────────────────────────────────────────────┐
  │ "Clicks COMPLETE CONSULTATION"                                │
  │ "POST /api/doctor/visits/:visitId/complete"                    │
  └────────────────────────────────────────────────────────────────┘
        │
        ▼
  ┌─ SYSTEM LANE ────────────────────────────────────────────────┐
  │ "POST /consultations  → a consultation record is saved"        │
  │ "The prescription is saved"                                    │
  │ "booking_items.status = 'completed'  +  completed_at = now"   │
  │ "A medical REPORT is generated"                               │
  │   ↳ reports: user_id · portfolio_id · description · medicines[]│
  │ "audit_logs entry written"                                    │
  │ "In-app notification to the patient"                           │
  │ "CRITICAL EMAIL to the patient (final booking decision)"       │
  └────────────────────────────────────────────────────────────────┘
        │
        ▼
  ┌─ SYSTEM LANE ────────────────────────────────────────────────┐
  │ "Patient opens /patient/medical-report"                       │
  │ "Views: doctor info · visit date · symptoms · diagnosis ·     │
  │          medical notes · prescribed medicines · dosage ·       │
  │          duration · doctor recommendations"                    │
  │ "Actions: Download Report · View Prescription"                 │
  │ "Optional: patient may submit a review (rating 1-5 + feedback)"│
  └────────────────────────────────────────────────────────────────┘
        │
        ▼
  (End) "Consultation closed — record archived"

PRIVACY CALLOUT (soft red strip at the bottom):
  "PRIVACY — a doctor sees ONLY the authorised clinical information of the patient
   currently in front of them. Full account data, password hashes and authentication
   secrets are never exposed through any doctor endpoint."

COLOUR RULES: doctor-lane boxes in teal, system-lane boxes in green, endpoints in
monospace with a purple "CRITICAL EVENT" tag for email, arrows solid and directional.

STYLE: clean professional flowchart, two clearly separated swim lanes with labelled
headers, orthogonal connectors, small monospace API labels, no SMS anything.
```

---

## 9. Admin User Management Flow (Scenario 3)

**Diagram Prompt**

```
Create a professional decision-tree flowchart for the Doctory admin user management,
landscape, white background.

Title: "Doctory — Admin User Management Flow" with Arabic subtitle "نظام عيادات ذكي".

START:
  (Start) "Admin opens /admin/users"
        │
        ▼
  ◆ DECISION: "Which action?"
        │
        ├── A) CREATE USER
        │     "POST /api/admin/users  { role, name, email, phone }"
        │     "The admin NEVER sets the password."
        │     "A password-setup link is emailed to the user."
        │        (if role = 'doctor' → also add doctor_name, specialty, title)
        │     "In-app notification + CRITICAL EMAIL (password setup)"
        │     "audit_logs entry: USER_CREATED"
        │     "If role = 'admin' → 2FA is enforced on the first login"
        │     "409 Conflict if the email already exists"
        │
        ├── B) EDIT DATA
        │     "PATCH /api/admin/users/:id  { name, email, phone, address, birth_date }"
        │     "audit_logs entry: USER_UPDATED"
        │
        ├── C) CHANGE ROLE
        │     "PATCH /api/admin/users/:id/role  { role }"
        │     "◆ GUARD: the admin cannot change their OWN role → 403 Forbidden"
        │     "◆ GUARD: the new role must be admin or patient"
        │        (doctors are created through registration + verification)"
        │     "◆ GUARD: the last active admin cannot be demoted → 409 Conflict"
        │     "ALL refresh tokens for that user are revoked immediately"
        │     "audit_logs entry: USER_ROLE_CHANGED"
        │
        ├── D) SUSPEND / ACTIVATE
        │     "PATCH /api/admin/users/:id/status  { status: 'suspended' | 'active', reason }"
        │     "◆ GUARD: the admin cannot suspend themselves → 403 Forbidden"
        │     "◆ GUARD: the last active admin cannot be deactivated → 409 Conflict"
        │     "All sessions are cancelled; any later login returns 403"
        │     "An already-issued Access JWT stays valid until it expires"
        │     "audit_logs entry: USER_SUSPENDED / USER_ACTIVATED"
        │
        ├── E) SOFT DELETE
        │     "DELETE /api/admin/users/:id"
        │     "deleted_at and deleted_by are set — the row is hidden, not erased"
        │     "◆ GUARD: the admin cannot delete themselves → 403 Forbidden"
        │     "◆ GUARD: the last active admin cannot be deleted → 409 Conflict"
        │     "All sessions are cancelled and the user is hidden from every list"
        │     "Related bookings, reviews and reports are PRESERVED (no cascade)"
        │     "audit_logs entry: USER_DELETED"
        │
        ├── F) RESTORE
        │     "PATCH /api/admin/users/:id/restore"
        │     "The row comes back, but its status returns to 'suspended'"
        │     "The admin must then explicitly ACTIVATE the account"
        │     "audit_logs entry: USER_RESTORED"
        │
        ├── G) FORCE LOGOUT
        │     "POST /api/admin/users/:id/force-logout"
        │     "Every refresh token for that user is revoked"
        │     "The current Access JWT remains valid until it expires"
        │     "audit_logs entry: FORCE_LOGOUT"
        │
        ├── H) RESET PASSWORD
        │     "POST /api/admin/users/:id/reset-password"
        │     "A reset link is emailed to the user — the admin never sees the password"
        │     "In-app notification + CRITICAL EMAIL"
        │     "audit_logs entry: PASSWORD_RESET_SENT"
        │     "429 if repeated too many times"
        │
        └── I) RESET 2FA
              "POST /api/admin/users/:id/reset-2fa"
              "secure_key is cleared and enable_2fa is switched off"
              "Doctors and admins must re-enable 2FA on their next login, because it is
               mandatory for them"
              "audit_logs entry: TWO_FA_RESET"

FOOTNOTE BAR (soft red-tinted strip across the bottom):
  "GUARDS — An admin can never change their own role, suspend themselves, or delete themselves.
   The LAST active admin can never be deleted, suspended, or demoted.
   Every admin action is written to audit_logs before it takes effect."

STYLE: rounded action boxes in teal, amber diamonds for decisions, red-tinted guard
diamonds, purple for email/notification callouts, gray for the endpoints, orthogonal
connectors with arrowheads, monospace endpoint labels, no SMS anything.
```

---

## 10. Waiting List Management Flow (Scenario 4)

**Diagram Prompt**

```
Create a professional flowchart for the Doctory waiting list management, landscape, white background.

Title: "Doctory — Waiting List Management" with Arabic subtitle "نظام عيادات ذكي".

FLOWCHART:

  (Start) "Admin or Doctor opens /admin/waiting-list"
        │
        ▼
  "Selects a DOCTOR  (searchable picker showing the doctor's name and doctor id)"
  "Selects a DATE    (date picker, defaults to today)"
  "Optionally toggles the TYPE filter: All / Exams / Consultations"
        │
        ▼
  "GET /api/admin/waiting-list?doctor_id&date&type"
        │
        ▼
  "System retrieves every BOOKING belonging to that doctor on that date"
        │
        ▼
  "System retrieves all BOOKING_ITEMS of those bookings, ordered by queue_number"
        │
        ▼
  ┌──────────────────── SYSTEM DIVIDES THE PATIENTS INTO 3 GROUPS ────────────────────┐
  │                                                                                      │
  │   ▣ WAITING (green header)                                                          │
  │     status = 'pending' OR 'accepted'  AND  the visit is not finished                │
  │                                                                                      │
  │   ▣ COMPLETED (blue header)                                                          │
  │     status = 'completed'                                                            │
  │                                                                                      │
  │   ▣ REMOVED (gray header)                                                           │
  │     status = 'rejected' OR 'cancelled' OR deleted_at is set                         │
  │                                                                                      │
  └──────────────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
  "For each WAITING patient, compute and display:"
    • waiting_minutes          = now − (appointment date + appointment time), never below 0"
    • estimated_wait_minutes   = (number of patients ahead in the queue)"
    "                              × (average duration_session of that doctor's active services)"
        │
        ▼
  "Counters displayed at the top:  Waiting: 12   |   Completed: 20   |   Removed: 3"
        │
        ▼
  ◆ DECISION: "Admin action on a patient?"
        │
        ├── "MODIFY a patient's status  → PATCH /api/admin/booking-items/:id  { status, queue_number }"
        │     "queue_number must stay unique within the session — the backend validates this"
        │     "status = 'completed' also sets completed_at"
        │
        ├── "SOFT-REMOVE a patient  → DELETE /api/admin/booking-items/:id"
        │     "deleted_at is set and the patient moves into the REMOVED group"
        │
        └── "RESTORE a removed patient  → PATCH /api/admin/booking-items/:id/restore"
              "409 Conflict if the parent session was already cancelled or full"

FOOTNOTE (soft teal strip):
  "AUTO-REFRESH — the waiting list refreshes on an interval (every 30 seconds) so the
   queue stays live. A manual refresh button is also available. No user action is lost
   while a refresh happens."

STYLE: three clearly separated group panels (Waiting / Completed / Removed) each with its
own colour-coded header bar, teal action boxes, orange diamonds, monospace endpoint labels,
orthogonal connectors, no SMS anything.
```

**Animation Prompt**

```
Animate the Doctory waiting list management screen as patients move between groups in real time.

SCENE 1 — GROUP REORDERING (the core animation):
  Three stacked panels: WAITING (green), COMPLETED (blue), REMOVED (gray). Each panel holds
  patient rows: queue number, patient name, phone, age, waiting minutes, estimated wait.
  - When a patient's status changes (a visit is completed, a patient is removed), the row
    smoothly REORDERS into its new group using a FLIP-style animation: measure the row's
    old position, re-parent it into the target group, measure the new position, then
    animate the transform back to zero over 450ms with an ease-out curve.
  - The row itself cross-fades between the two groups — it never jumps or teleports.
  - Rows that are only shifting position (because a patient ahead completed) glide
    smoothly rather than re-rendering.
  - A completed row slides slightly to the right and its left edge bar animates from
    green to blue over 250ms, marking the status change.
  - A removed row desaturates to 60% opacity over 300ms and its left edge bar animates
    to gray.

SCENE 2 — LIVE COUNTERS:
  - The three counters at the top (Waiting / Completed / Removed) animate with a
    digit-roll: the number counts up or down with a 300ms eased tween, each digit
    sliding vertically within its fixed-width slot so the layout never shifts.
  - A brief soft highlight wash (200ms fade) pulses behind a counter when it changes.

SCENE 3 — WAITING-TIME TICKING:
  - The "waiting minutes" value on each waiting row increments once per minute with a
    250ms cross-fade. The "estimated wait" value adjusts with a 400ms eased tween.
  - When the estimated wait jumps by more than 10 minutes, the value briefly turns amber
    to signal a delay, then settles back to teal after 1.5 seconds.

SCENE 4 — POLLING INDICATOR:
  - A small circular spinner in the panel header rotates smoothly once every 30 seconds
    during the background refresh, then fades out. It is subtle and never blocks content.
  - Rows update in place without any flash or full re-render.

STYLE: white background, modern medical admin dashboard, Inter or IBM Plex Sans Arabic,
300-500ms transitions, ease-out curves, generous spacing, no confetti, no SMS references.
```

---

## 11. Data Deletion Request Flow — Law 151/2020 (Scenario 5)

**Diagram Prompt**

```
Create a professional flowchart for the Doctory data deletion request process, portrait or
landscape, white background.

Title: "Doctory — Data Deletion Request (Law 151/2020)" with Arabic subtitle "نظام عيادات ذكي".

Add a header strip in soft green: "COMPLIANCE — Egyptian Personal Data Protection Law No. 151 of 2020"

FLOWCHART:

  (Start) "Patient opens Settings → Request deletion of my data"
        │
        ▼
  "The system asks for a REASON (free text) — the patient confirms the request"
        │
        ▼
  "POST /api/deletion-requests"
        │
        ▼
  "A deletion_requests record is created with status = 'pending'"
  "deletion_requests: user_id · status · reason · created_at"
        │
        ▼
  "In-app notification to the patient — 'your request was received'"
        │
        ▼
  (End for the patient side — the flow continues on the Admin side)

  ═══════════════ ADMIN SIDE ═══════════════

  (Start) "Admin opens /admin/deletion-requests"
        │
        ▼
  "GET /api/admin/deletion-requests"
        │
        ▼
  "The list shows the patient name MASKED (e.g. 'A**** M****') for privacy"
        │
        ▼
  "Admin opens a request and reviews the reason"
        │
        ▼
  ◆ DECISION: "Approve or Reject?"
        │
        ├── APPROVE
        │     "PATCH /api/admin/deletion-requests/:id  { decision: 'approved', reason }"
        │          │
        │          ▼
        │     ◆ DECISION: "Hard delete OR anonymise?"
        │          │
        │          ├── HARD DELETE
        │          │     "The user's personal records are permanently removed"
        │          │     "This is the ONLY exception to the soft-delete policy"
        │          │     "Associated records: profile · reports · reviews · booking history"
        │          │
        │          └── ANONYMISE
        │                "Personally identifying fields are cleared or replaced"
        │                "the booking and audit history is retained for legal traceability"
        │          │
        │          ▼
        │     "deletion_requests.status = 'approved'"
        │     "reviewed_by and reviewed_at are recorded"
        │          │
        │          ▼
        │     ┌──────────────────────────────────────────────┐
        │     │ In-app notification (deletion_request_update) │
        │     │ CRITICAL EMAIL to the patient — your data      │
        │     │   deletion request was approved                │
        │     │ audit_logs entry: DELETION_APPROVED            │
        │     │   (recorded WITHOUT sensitive patient data)    │
        │     └──────────────────────────────────────────────┘
        │
        └── REJECT
              "PATCH /api/admin/deletion-requests/:id  { decision: 'rejected', reason }"
              "A reason is REQUIRED"
              "deletion_requests.status = 'rejected'"
              "reviewed_by and reviewed_at are recorded"
                    │
                    ▼
              ┌──────────────────────────────────────────────┐
              │ In-app notification (deletion_request_update) │
              │ CRITICAL EMAIL to the patient — the request   │
              │   was rejected, with the reason               │
              │ audit_logs entry: DELETION_REJECTED           │
              │   (recorded WITHOUT sensitive patient data)    │
              └──────────────────────────────────────────────┘

CALLOUT BOX (soft red strip, bottom):
  "409 Conflict if the same request has already been decided.
   The audit log records the ADMIN'S DECISION ONLY — never the patient's medical content."

COLOUR RULES: teal action boxes, amber decision diamonds, green for approve, red for reject,
purple for in-app/email callouts, and the 'hard delete' diamond in a deeper red.
Monospace endpoint labels, orthogonal connectors, no SMS anything.
```

---

## 12. Notification System Flow (Cross-Cutting)

**Diagram Prompt**

```
Create a professional branching flowchart for the Doctory notification system, landscape,
white background. This diagram is CROSS-CUTTING — it applies to every module.

Title: "Doctory — Notification System Flow" with Arabic subtitle "نظام عيادات ذكي".

FLOWCHART:

  (Start) "A system event occurs"
        │
        ▼
  ┌──────────────────────────── EVENT SOURCES ─────────────────────────────┐
  │ • booking_accepted      (doctor accepts a booking)                     │
  │ • booking_rejected      (doctor rejects a booking)                     │
  │ • queue_update          (the patient's queue position changed)         │
  │ • turn_warning          (the patient's turn is approaching)            │
  │ • appointment_cancelled (the queue entry was cancelled)                 │
  │ • doctor_verified       (the doctor's verification was approved/rejected)│
  │ • deletion_request_update (the admin decided on a deletion request)    │
  │ • system                (a generic notice)                             │
  └─────────────────────────────────────────────────────────────────────────┘
        │
        ▼
  "The event is passed to the notification service"
  "createNotification({ user_id, type, title, message, related_entity_type, related_entity_id })"
        │
        ▼
  ┌─────────────────────── BRANCH A — ALWAYS ──────────────────────────────┐
  │                                                                        │
  │   "INSERT one document into the NOTIFICATIONS collection"              │
  │   "notifications: notification_id (UUID) · user_id (FK→users) ·        │
  │    type · title · message · is_read = false ·                         │
  │    related_entity_type · related_entity_id · createdAt"                │
  │                                                                        │
  │   "The user sees it IN-APP on the Web portal and on the Flutter app"   │
  │   "The Notifications Center lists them · unread badge count"           │
  │   "GET /api/notifications · PATCH /api/notifications/:id/read ·        │
  │    PATCH /api/notifications/read-all · DELETE /api/notifications/:id"  │
  │                                                                        │
  └────────────────────────────────────────────────────────────────────────┘
        │
        ▼
  ┌─────────────────────── BRANCH B — CONDITIONAL ────────────────────────┐
  │                                                                        │
  │   ◆ DECISION: "Is this a CRITICAL event?"                              │
  │                                                                        │
  │   CRITICAL events (email required):                                    │
  │     • email verification                                               │
  │     • forgot / reset password                                         │
  │     • doctor verification approved / rejected                         │
  │     • final booking accept / reject                                    │
  │     • deletion-request decision                                        │
  │                                                                        │
  │   ROUTINE events (in-app only, no email):                              │
  │     • queue_update · turn_warning · appointment_cancelled · system     │
  │                                                                        │
  └───┬────────────────────────────────────────────────────────────────────┘
      │
      ├── YES ──► "SEND the email through Nodemailer SMTP"
      │              "A styled HTML email is sent to the user's address"
      │              "Log the email attempt with the event"
      │              "NOTE: email failure must never roll back the in-app
      │               notification — the in-app copy is already persisted"
      │
      └── NO ────► "Stop here — the in-app notification is the only channel"

  ┌───────────── EXPLICITLY EXCLUDED CHANNEL (draw as a crossed-out box) ─────────────┐
  │                                                                                    │
  │        ┌──────────────────────────────────────────────────────┐                    │
  │        │   ▣ SMS  —  ✕  NOT USED                              │                    │
  │        │   "Not used — cost reasons and no paid SMS gateway"  │                    │
  │        │   "No Twilio, no Vonage, no MessageBird, no SMS API"  │                    │
  │        └──────────────────────────────────────────────────────┘                    │
  │         (draw this box with a red diagonal cross over it, muted/greyed out)         │
  │                                                                                    │
  └────────────────────────────────────────────────────────────────────────────────────┘

FOOTNOTE BAR (soft purple strip across the bottom):
  "POLICY — In-app notifications for routine events. Email (Nodemailer) for critical events
   only. NO SMS anywhere in the system. Every notification is created through a single
   notificationService function so this policy lives in exactly one place."

STYLE: purple for the notification service and email branch, teal for the in-app branch,
amber diamond for the critical-event decision, gray for routine events, a bold red
cross-out over the SMS box, clean orthogonal connectors, monospace endpoint labels.
```

---

## 13. Audit Log Write Flow (Cross-Cutting)

**Diagram Prompt**

```
Create a professional cross-cutting flowchart for the Doctory audit log mechanism, landscape,
white background. This diagram applies to EVERY write operation in the system.

Title: "Doctory — Audit Log Write Flow" with Arabic subtitle "نظام عيادات ذكي".

FLOWCHART:

  (Start) "A write operation is requested by a logged-in user"
        │
        ▼
  ┌────────────────────── WRITE OPERATIONS THAT ARE AUDITED ───────────────────────┐
  │  ADMIN MODULE                                                                    │
  │   • create a user · update a user · change a role                                │
  │   • suspend / activate a user · soft-delete a user · restore a user              │
  │   • force-logout a user · send a password reset · reset 2FA                     │
  │   • approve a doctor · reject a doctor                                          │
  │   • approve / reject a doctor service                                            │
  │   • update a booking · update a booking item · cancel a session                 │
  │   • approve / reject a deletion request                                          │
  │                                                                                  │
  │  DOCTOR MODULE                                                                   │
  │   • accept a booking · reject a booking                                         │
  │   • write a diagnosis · write a prescription · complete a consultation           │
  │   • update the own portfolio / services                                          │
  │                                                                                  │
  │  PATIENT MODULE                                                                  │
  │   • confirm a queue turn · decline a queue turn (twice = cancelled)             │
  │   • book an appointment · submit a review                                        │
  │   • request data deletion · update own profile                                   │
  │   • change own password · request password reset                                  │
  └──────────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
  "The request passes through the Express middleware chain:"
  "  Auth (JWT) → RBAC (role check) → Validation (Joi) → the controller"
        │
        ▼
  "The controller performs the MAIN database write"
        │
        ▼
  ┌──────────────────── SHARED AUDIT LOGGER STEP ───────────────────────────┐
  │                                                                          │
  │   "auditLog({ actor_id, actor_role, action, entity_type, entity_id,     │
  │                ip, metadata })"                                          │
  │                                                                          │
  │   FIELD GUIDE (show as a small annotated card next to the step):        │
  │     actor_id      → the acting user's user_id (UUID)                     │
  │     actor_role    → admin | doctor | patient                              │
  │     action        → a SNAKE_CASE verb, e.g. BOOKING_ACCEPTED,            │
  │                     USER_ROLE_CHANGED, DOCTOR_APPROVED,                   │
  │                     DELETION_APPROVED, QUEUE_DECLINED                     │
  │     entity_type   → the kind of record affected, e.g. booking_item       │
  │     entity_id     → the id of the affected record                        │
  │     ip            → the actor's IP address                               │
  │     metadata      → JSON: the old value, the new value, and the reason  │
  │                     (for example the rejection reason)                   │
  │     created_at    → automatic timestamp                                  │
  │                                                                          │
  │   "The audit_logs collection is INSERT-ONLY — it is never updated or     │
  │    deleted. A dedicated admin page reads it; no endpoint can modify it."  │
  │                                                                          │
  └──────────────────────────────────────────────────────────────────────────┘
        │
        ▼
  "One document is inserted into the audit_logs collection"
        │
        ▼
  "The Audit Log admin page reads it"
  "GET /api/admin/audit-logs?action&actor_id&actor_role&entity_type&from&to&page&limit"
  "GET /api/admin/audit-logs/:id   (shows the full metadata JSON, expandable)"
        │
        ▼
  (End)

IMPORTANT CALLOUT (soft red strip):
  "The audit log records the ADMIN'S ACTION, never the patient's medical content.
   For a deletion request the entry contains the decision and the reason, but not the
   patient's report, diagnosis, or prescription text."

SUGGESTED ACTION VERB LIST (show as a light reference panel to the right):
  LOGIN · LOGIN_FAILED · USER_CREATED · USER_UPDATED · USER_ROLE_CHANGED · USER_SUSPENDED ·
  USER_ACTIVATED · USER_DELETED · USER_RESTORED · FORCE_LOGOUT · PASSWORD_RESET_SENT ·
  TWO_FA_RESET · DOCTOR_APPROVED · DOCTOR_REJECTED · BOOKING_ACCEPTED · BOOKING_REJECTED ·
  BOOKING_UPDATED · BOOKING_CANCELLED · BOOKING_DELETED · BOOKING_ITEM_UPDATED ·
  BOOKING_ITEM_DELETED · SERVICE_APPROVED · SERVICE_REJECTED · DELETION_APPROVED ·
  DELETION_REJECTED

STYLE: teal action boxes, a distinct dark panel for the shared audit logger step, purple
for the read path, orange for the reference verb list, orthogonal connectors, monospace
field names, no SMS anything.
```

---

## 14. Mongoose vs Previous Architecture (Migration Note Diagram)

**Diagram Prompt**

```
Create a clean side-by-side BEFORE / AFTER comparison diagram documenting a completed
infrastructure migration, landscape, white background.

Title: "Doctory — Infrastructure Migration" with Arabic subtitle "نظام عيادات ذكي".
Subtitle: "From TypeORM + MySQL to Mongoose + MongoDB"

BEFORE PANEL (left half) — drawn as RETIRED:
  - Title: "BEFORE" with a small "deprecated" tag
  - Everything inside is GREY (#9aa0a6) with DASHED borders and slightly reduced opacity
  - A large semi-transparent red diagonal cross-out runs across the whole panel
  - Contents:
      • "TypeORM"  — box labeled "DataSource · entity decorators · getRepository()"
      • "MySQL 8" — box labeled "Relational tables · SQL schema · mysql2 driver"
      • "Relational Model" — box listing: users, doctor_portfolios, doctor_works, bookings,
        booking_items, reviews, reports, audit_logs, deletion_requests, refresh_tokens
        (drawn as a classic table/grid with column rows)
      • A small note: "The models were written as Mongoose schemas, so TypeORM could never
        load them — the DataSource and the entities were incompatible"
  - A small caption under the panel: "Deprecated — removed from the codebase"

AFTER PANEL (right half) — drawn as CURRENT:
  - Title: "AFTER" with a small green "current" tag
  - Everything is SOLID with the project colour scheme:
      • "Mongoose 9"  — SOLID BLUE box, labeled "mongoose.connect() · retry logic ·
        connection events · schemas with enums, indexes, soft delete"
      • "MongoDB 7"   — SOLID GREEN box, labeled "Document database · 11 collections ·
        ObjectId references · TTL indexes"
      • "Document Model" — SOLID TEAL box listing the SAME 11 collections as document
        collections: users, doctor_portfolios, doctor_works, bookings, booking_items,
        reviews, reports, audit_logs, deletion_requests, refresh_tokens, notifications
        (drawn as document cards, each with a rounded corner and key/value rows)
  - Highlight the NEW collection in the AFTER panel: "notifications" gets a distinct
    accent colour and a small "NEW" badge
  - Caption under the panel: "Current — the only database in the project"

CENTRE ARROW between the two panels:
  A thick green arrow pointing from BEFORE to AFTER, labelled "MIGRATION COMPLETED"
  with a short list of the changes that were made underneath it:
    "• config/data-source.js deleted"
    "• config/database.js added with mongoose.connect()"
    "• typeorm, reflect-metadata, mysql2 removed from package.json"
    "• docker-compose switched from a mysql service to a mongo:7 service"
    "• .env.example switched from MySQL variables to MONGO_URI"

BOTTOM STRIP (soft gray, full width):
  "WHAT DID NOT CHANGE — all 11 Mongoose model files, the Express + EJS architecture,
   the roles and permissions model, the notification policy, and every business rule."

STYLE: rounded rectangles, the BEFORE panel deliberately desaturated and crossed out,
the AFTER panel in full project colours with soft shadows, thick centre arrow, clean
typography, no decorative imagery, no SMS anything.
```

---

## 🔁 General Diagram & Animation Style Guide

Use this as the base prompt for **every** diagram and animation in this file. It guarantees a consistent, presentation-ready look across the whole project.

```
STYLE GUIDE — Doctory system diagrams and animations

BRANDING & TYPOGRAPHY
  - Title: "Doctory" in a large bold geometric sans-serif, dark navy (#12386b).
  - Directly underneath, the Arabic subtitle "نظام عيادات ذكي" in teal (#17877a),
    right-to-left, keeping the "Doctory" title left-aligned above it.
  - Third line: a short English descriptor in muted gray (#6b7280), e.g.
    "AI-Powered Smart Clinic System" or a section-specific subtitle.
  - Body font: Inter, IBM Plex Sans Arabic, Segoe UI, or Noto Sans Arabic.
  - Code, endpoint paths, field names, and enum values in a monospace face
    (JetBrains Mono, SFMono-Regular, or Consolas) at roughly 85% of the body size.
  - Canvas: white background, generous margins, 16:9 landscape for architecture and
    matrix diagrams, portrait allowed for tall flowcharts.

BOXES AND SHAPES
  - Rounded rectangles everywhere — corner radius roughly 14-18px for large boxes and
    999px (pill) for small chips, tags, and badges.
  - Action nodes: rectangles.
  - Decision nodes: diamonds.
  - Start / end nodes: pills or stadium shapes.
  - Callouts and notes: smaller rounded panels with a 1px border and a soft tinted fill.
  - Never use sharp 90-degree corners, drop shadows that are heavy, or 3D effects.
  - Keep a consistent border weight: 2px for component boxes, 1px for notes and chips.

SOLID VS DASHED — THE SINGLE MOST IMPORTANT RULE
  - SOLID 2px border + a soft shadow  = IMPLEMENTED and working today.
  - DASHED 2px gray border (#9aa0a6) + no shadow + slightly muted fill = PLANNED or FUTURE.
  - Every diagram MUST include a legend box explaining this, placed in a corner where it
    does not overlap any content.
  - Components that are planned in this project and must therefore be drawn dashed:
      Redis, AI Microservice, rate limiting, and any future push/FCM channel.
  - Components that are implemented and must be drawn solid:
      Express.js API, all middleware, Mongoose + MongoDB, all 11 models, Nodemailer.

COLOUR SYSTEM (apply consistently across every diagram)
  - Clients ............... light blue    fill #E8F2FD  border #2F6FB5  text #14406F
  - API Gateway ........... dark blue     fill #1A4D8F  border #12386B  text #FFFFFF
  - Core Services ........ teal          fill #D9F2EF  border #17877A  text #0D5B52
  - Data Layer ........... green         fill #DFF2DF  border #2E7D32  text #1D5220
  - External service ..... purple        fill #EDE7F6  border #5E35B1  text #3D1F7A
  - Planned / Future ..... gray dashed   fill #F4F5F7  border #9AA0A6  text #5F6368
  - Danger / rejected .... red           fill #FDECEA  border #C62828  text #8E1F1F
  - Neutral canvas ....... white         text #1F2933  muted #6B7280  rule #E5E7EB

ARROWS AND FLOW DIRECTION
  - Arrows must always show a clear direction of data flow — never ambiguous lines.
  - Use a consistent arrowhead: a small solid triangle, roughly 10px.
  - Straight orthogonal (right-angle) connectors for flowcharts and architecture.
  - Curved connectors are acceptable for state machines and ER diagrams.
  - Bidirectional relationships use arrowheads on BOTH ends, and are labelled
    "read / write" where the access is genuinely two-way (services ↔ data layer).
  - Dashed arrows always mean "planned flow"; solid arrows always mean "live flow".
  - Label important arrows with a short monospace endpoint or action name, and give the
    label a small white background so it stays readable where it crosses a line.
  - Avoid crossing lines. When unavoidable, route the line around the outside of the
    diagram rather than through the boxes.

NOTIFICATION POLICY — REFLECT IT IN EVERY DIAGRAM THAT INVOLVES NOTIFICATIONS
  - In-app notifications (stored in the notifications collection) are the DEFAULT channel
    for routine events, and they appear on both the Web portal and the Flutter app.
  - Email through Nodemailer is for CRITICAL EVENTS ONLY:
      email verification · forgot/reset password · doctor verification approve/reject ·
      final booking accept/reject · deletion-request decision.
  - There is NO SMS channel. Never draw an SMS box, SMS icon, phone-bubble, or any paid
    SMS gateway (Twilio, Vonage, MessageBird, or similar). If one appears, delete it and
    re-prompt to remove it.
  - Push / FCM is optional future work and, when shown at all, must be dashed gray.
  - A standard annotation to reuse:
      "In-App + Critical Email Only — No SMS"

ANIMATION GUIDELINES
  - Duration: 300ms for micro-interactions, 400-600ms for state changes and layout
    moves, 1000ms+ only for ambient or looping motion.
  - Easing: ease-out (cubic-bezier(0.22, 1, 0.36, 1)) for entrances and state changes;
    ease-in for exits. Avoid linear easing except for continuous rotation.
  - Never use a harsh bounce, elastic overshoot, shake, or a jarring colour flash.
    A single subtle scale pulse (1.00 → 1.06 → 1.00) is the maximum celebratory motion.
  - State changes use colour morphing plus a cross-fade, never a hard cut.
  - Number changes use a digit-roll or a tween, and the layout must never shift — always
    reserve the width of the widest value.
  - List reordering uses a FLIP-style move: measure, re-parent, then animate the
    transform back to zero.
  - Respect reduced-motion preferences: provide a static fallback for every animation.
  - Ambient loops (a breathing glow, a slow spinner) must be low-contrast and slow —
    roughly 2-3 seconds per cycle — so they never compete with the content.

ACCESSIBILITY & CLARITY
  - Text on a coloured fill must maintain at least 4.5:1 contrast; use white text on the
    dark navy and deep green/teal fills.
  - Do not rely on colour alone to convey meaning: always pair a colour with a label,
    an icon, or a border style.
  - Minimum body text size in a diagram is 11px at 1× scale; never go below it.
  - Keep labels short and human-readable — a diagram is a summary, not a document.

FINAL QUALITY CHECK BEFORE EXPORT
  1. Every implemented component is solid, and every planned component is dashed.
  2. A legend box is present and correct.
  3. Arrows all point in the direction of the flow, with no ambiguous or floating ends.
  4. No SMS element anywhere.
  5. Title, Arabic subtitle, and the "Doctory" branding are present.
  6. Text is legible with no overlap, no clipping, and no collision with the legend.
  7. White background, no gradients on text, no drop shadows heavy enough to reduce
     legibility.
```

---

> **Related documentation** — `docs/backend/README_APIs.md` (API template) · `docs/frontend/pages.md` (page template) · `docs/database/databaseDoc.md` (data layer) · `docs/system_analysis/Auth_Final.md` (auth flows) · `README.md` (system overview, checklist, roadmap)
