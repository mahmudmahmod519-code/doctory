# 🏥 Doctory — AI-Powered Smart Clinic System (نظام عيادات ذكي)

> **Graduation Project** — Faculty of Computers and Information  
> AI-Powered Smart Clinic System for Patient Management and Clinical Decision Support

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Project Structure](#project-structure)
5. [Environment Variables](#environment-variables)
6. [Pages](#pages)
7. [Page Documentation Template](#page-documentation-template)
8. [APIs](#apis)
9. [API Documentation Template](#api-documentation-template)
10. [Scenarios](#scenarios)
11. [Database](#database)
12. [Database Collections](#database-collections)
13. [User Roles & Permissions](#user-roles--permissions)
14. [Authorization Rules](#authorization-rules)
15. [Security Mechanisms](#security-mechanisms)
16. [Checklist](#checklist)
17. [Roadmap to Tasks](#roadmap-to-tasks)
18. [Running the Project](#running-the-project)
19. [Contributing](#contributing)
20. [License](#license)

---

## 🎯 Project Overview

**Doctory** is an intelligent clinic management application that simplifies the patient journey, eliminates long waiting times, and provides AI-powered clinical decision support. The system routes patients to the right medical specialty, manages bookings through a doctor-approval mechanism, and digitizes prescriptions.

### Core Objectives

- Simplify the patient journey from registration to consultation completion
- Eliminate long waiting times through an organized queue management system
- Route patients to the appropriate medical specialty using AI-assisted symptom analysis
- Manage appointments through a doctor-approval workflow (pending → accepted/rejected)
- Digitize prescriptions and medical reports for easy access and record-keeping
- Provide AI-powered clinical decision support as an assistance tool, not a replacement for physician judgment

### Important AI Disclaimer

> AI in this project is a **Clinical Decision Support Tool**, not an autonomous diagnostic system. The physician always has full authority over diagnosis, prescriptions, and medical reports. All AI outputs are presented as suggestions, never as final medical decisions.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Node.js, Express.js | Server-side application framework and runtime |
| **Database** | MongoDB (Mongoose) | Document database for storing users, bookings, records, and logs |
| **Templating / Rendering** | EJS (Server-Side Rendering) | Server-side view engine for rendering web pages |
| **Mobile** | Flutter | Cross-platform mobile application for patients and doctors |
| **Authentication** | JWT (Access + Refresh) in HTTP-Only Cookies | Secure stateless authentication with token refresh |
| **Two-Factor Authentication** | Google Authenticator | Time-based one-time passwords for enhanced security |
| **Validation** | Joi | Request data validation schema |
| **File Uploads** | Multer | Handling file uploads (e.g., Medical ID images, prescriptions) |
| **Email** | Nodemailer | Sending emails for verification, password reset, and notifications |
| **Scheduling** | node-cron | Scheduled background tasks (e.g., cleanup jobs) |
| **AI Layer** | Node.js + Express | Symptom-to-specialty routing and prescription OCR |
| **Cache / Queue** | Redis (planned) | Caching and background job queuing |
| **Containerization** | Docker, Docker Compose | Application packaging and deployment |

---

## 🏗️ System Architecture

```
Patient App (Flutter) ──┐
Doctor Web (EJS) ───────┼──> Express.js API ──> MongoDB (Mongoose)
Admin Web (EJS) ────────┘         │
                                  ├──> AI Microservice (Node.js + Express)
                                  │     ├─ NLP Routing (symptom → specialty)
                                  │     └─ OCR (prescription → text)
                                  │
                                  └──> Redis (queues, sessions) [planned]
```

### Data Flow Summary

1. **Clients** (Patient Flutter app, Doctor web, Admin web) connect to the Express.js API
2. **Express.js API** processes requests, enforces authentication and authorization, and communicates with MongoDB
3. **AI Microservice** provides clinical decision support (symptom routing and prescription OCR) as suggestions to doctors
4. **Redis** (planned) handles caching and session/queue management

### Architectural Pattern

The system follows a strict separation between **Renders** and **APIs**:

- **Renders:** EJS pages that display the user interface and pass only user state information to the frontend
- **APIs:** JSON endpoints consumed by frontend JavaScript through fetch requests for data operations

---

## 📁 Project Structure

```
doctory/
├── config/
│   ├── database.js
│   ├── server.js
│   └── env.js
├── logicModels/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   └── auth.render.js
│   ├── patient/
│   │   ├── patient.controller.js
│   │   └── patient.render.js
│   ├── doctor/
│   │   ├── doctor.controller.js
│   │   └── doctor.render.js
│   ├── admin/
│   │   ├── admin.controller.js
│   │   └── admin.render.js
│   ├── AuditLog/
│   │   ├── AuditLog.controller.js
│   │   └── AuditLog.render.js
│   ├── Booking/
│   │   ├── Booking.controller.js
│   │   └── Booking.render.js
│   ├── BookingItem/
│   │   ├── BookingItem.controller.js
│   │   └── BookingItem.render.js
│   ├── DeletionRequest/
│   │   ├── DeletionRequest.controller.js
│   │   └── DeletionRequest.render.js
│   ├── DoctorPortfolio/
│   │   ├── DoctorPortfolio.controller.js
│   │   └── DoctorPortfolio.render.js
│   ├── DoctorWork/
│   │   ├── DoctorWork.controller.js
│   │   └── DoctorWork.render.js
│   ├── RefreshToken/
│   │   ├── RefreshToken.controller.js
│   │   └── RefreshToken.render.js
│   ├── Report/
│   │   ├── Report.controller.js
│   │   └── Report.render.js
│   ├── Review/
│   │   ├── Review.controller.js
│   │   └── Review.render.js
│   └── User/
│       ├── User.controller.js
│       └── User.render.js
├── routes/
│   ├── index.js
│   ├── auth/
│   │   ├── index.js
│   │   ├── auth.apis.js
│   │   └── auth.render.js
│   ├── patient/
│   │   ├── index.js
│   │   ├── patient.apis.js
│   │   └── patient.render.js
│   ├── doctor/
│   │   ├── index.js
│   │   ├── doctor.apis.js
│   │   └── doctor.render.js
│   ├── admin/
│   │   ├── index.js
│   │   ├── admin.apis.js
│   │   └── admin.render.js
│   ├── AuditLog/
│   │   ├── index.js
│   │   ├── AuditLog.apis.js
│   │   └── AuditLog.render.js
│   ├── Booking/
│   │   ├── index.js
│   │   ├── Booking.apis.js
│   │   └── Booking.render.js
│   ├── BookingItem/
│   │   ├── index.js
│   │   ├── BookingItem.apis.js
│   │   └── BookingItem.render.js
│   ├── DeletionRequest/
│   │   ├── index.js
│   │   ├── DeletionRequest.apis.js
│   │   └── DeletionRequest.render.js
│   ├── DoctorPortfolio/
│   │   ├── index.js
│   │   ├── DoctorPortfolio.apis.js
│   │   └── DoctorPortfolio.render.js
│   ├── DoctorWork/
│   │   ├── index.js
│   │   ├── DoctorWork.apis.js
│   │   └── DoctorWork.render.js
│   ├── RefreshToken/
│   │   ├── index.js
│   │   ├── RefreshToken.apis.js
│   │   └── RefreshToken.render.js
│   ├── Report/
│   │   ├── index.js
│   │   ├── Report.apis.js
│   │   └── Report.render.js
│   ├── Review/
│   │   ├── index.js
│   │   ├── Review.apis.js
│   │   └── Review.render.js
│   ├── User/
│   │   ├── index.js
│   │   ├── User.apis.js
│   │   └── User.render.js
│   ├── errors/
│   │   └── index.js
│   ├── static/
│   │   ├── index.js
│   │   └── static.render.js
│   └── module_Ex/
│       ├── index.js
│       ├── moduleName_EX.apis.js
│       └── moduleName_EX.render.js
├── models/
│   ├── User.entity.js
│   ├── DoctorPortfolio.entity.js
│   ├── DoctorWork.entity.js
│   ├── Booking.entity.js
│   ├── BookingItem.entity.js
│   ├── Review.entity.js
│   ├── Report.entity.js
│   ├── AuditLog.entity.js
│   ├── DeletionRequest.entity.js
│   └── RefreshToken.entity.js
├── middleware/
│   ├── auth.js
│   ├── roles.js
│   ├── upload.js
│   ├── validate.js
│   ├── helmet.js
│   └── securityLogger.js
├── services/
│   ├── authService.js
│   ├── emailService.js
│   ├── queueService.js
│   └── aiService.js
├── utils/
│   ├── catchError.js
│   ├── validation.js
│   ├── checkLogin.js
│   ├── removePassword.js
│   ├── mailer.js
│   └── cronJobs.js
├── views/
│   ├── auth/
│   ├── patient/
│   ├── doctor/
│   └── admin/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── scripts/
│   ├── seed.js
│   └── migrate.js
├── docs/
│   ├── database/
│   ├── backend/
│   ├── frontend/
│   └── system_analysis/
├── server.js
├── package.json
├── .env.example
├── Dockerfile
├── Dockerfile.dev
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```

### Directory Descriptions

| Directory | Purpose |
|-----------|---------|
| `config/` | System configuration (database connection, server config, environment variables) |
| `logicModels/` | Split by domain; each folder contains `[model].controller.js` (API logic) and `[model].render.js` (page render logic) |
| `routes/` | Split by domain; each folder contains `index.js` (route registry), `[model].apis.js` (API routes), `[model].render.js` (page routes) |
| `models/` | Mongoose entity schemas (`.entity.js` files) for MongoDB collections |
| `middleware/` | Express middleware (authentication, roles, upload, validation, security headers, logging) |
| `services/` | Business logic services (auth, email, queue, AI) |
| `utils/` | Utility functions (error handling, validation helpers, login check, email, cron jobs) |
| `views/` | EJS template folders for server-side rendered pages |
| `public/` | Static assets (CSS, JavaScript, images) |
| `scripts/` | Database seeding and migration scripts |
| `docs/` | Project documentation (database, backend APIs, frontend pages, system analysis) |

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server listening port | `3000` |
| `NODE_ENV` | Application environment | `development` / `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/doctory_db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Strong random string |
| `JWT_EXPIRES_IN` | Access token expiration time | `7d` |
| `MAIL_HOST` | SMTP server host | `smtp.example.com` |
| `MAIL_PORT` | SMTP server port | `587` |
| `MAIL_USER` | SMTP authentication username | Email address |
| `MAIL_PASS` | SMTP authentication password | Email password |

> The `.env` file should never be committed to version control. An `.env.example` template is provided for reference.

---

## 📄 Pages

The system contains **40 pages** organized into four modules: Public, Patient, Doctor, and Admin.

### 🏠 Public Pages (Guest Access)

| # | Page | Path | Role | Purpose | Description |
|---|------|------|------|---------|-------------|
| 1 | Home / Main Page | `/` | guest | Landing page | Public home page with Login and Sign Up buttons |
| 2 | Sign Up Options | `/auth/signup-options` | guest | Choose account type | Select Patient or Doctor registration path |
| 3 | Login | `/auth/login` | guest | Authenticate | Email and password login with Forgot Password link |
| 4 | Patient Registration | `/auth/register/patient` | guest | Create patient account | Name, email, password, and phone number |
| 5 | Doctor Registration | `/auth/register/doctor` | guest | Create doctor account | Doctor information and Egyptian Medical Syndicate ID upload |
| 6 | Forgot Password | `/auth/forgot-password` | guest | Password reset request | Enter email to receive a password reset link |
| 7 | Reset Password | `/auth/reset-password/:token` | guest | Set new password | Page opened from the email reset link |
| 8 | 2FA Verification | `/auth/2fa/verify` | guest / login flow | Two-factor verification | Authenticator app code entry |

### 👤 Patient Pages (Authenticated)

| # | Page | Path | Role | Purpose | Description |
|---|------|------|------|---------|-------------|
| 9 | Patient Dashboard | `/patient/dashboard` | patient | View upcoming appointment | Shows upcoming appointment, doctor, specialty, date, time, queue number, and status |
| 10 | Waiting Queue | `/patient/waiting-queue` | patient | Monitor queue position | Queue number, current number, patients ahead, estimated wait time, and progress indicator |
| 11 | Turn Notification | `/patient/turn-notification` | patient | Confirm or decline turn | Prominent "Your turn is now" message with Confirm and Decline buttons |
| 12 | First Decline Warning | `/patient/decline-warning` | patient | First decline notice | Informs patient they will be called again; shows remaining attempts |
| 13 | Appointment Cancelled | `/patient/appointment-cancelled` | patient | Cancellation notice | Shown after two declines; includes reason and Back to Dashboard button |
| 14 | Medical History | `/patient/medical-history` | patient | View medical history | Chronic diseases, allergies, current medications, and previous medical history |
| 15 | Medical Report | `/patient/medical-report` | patient | View completed consultation | Doctor information, visit date, symptoms, diagnosis, notes, prescription, and recommendations |

### 👨‍⚕️ Doctor Pages (Authenticated, Verified)

| # | Page | Path | Role | Purpose | Description |
|---|------|------|------|---------|-------------|
| 16 | Doctor Login | `/doctor/login` | doctor | Doctor sign in | Email and password login with mandatory 2FA |
| 17 | Doctor Dashboard | `/doctor/dashboard` | doctor | Doctor work starting point | Navigation to Pending Bookings and Waiting List with summary counts |
| 18 | Pending Bookings | `/doctor/bookings/pending` | doctor | Review appointment requests | List pending bookings with Accept, Reject, and View Details actions |
| 19 | Booking Details | `/doctor/bookings/:id` | doctor | Decision information | Appointment details with only necessary patient data (no full account data) |
| 20 | Waiting List | `/doctor/waiting-list` | doctor | View patients waiting | Queue entries with appointment information |
| 21 | Patient Visit / Clinical Summary | `/doctor/visits/:id/clinical-summary` | doctor | Authorized clinical info | Clinical summary with navigation to diagnosis and prescription |
| 22 | Diagnosis Editor | `/doctor/visits/:id/diagnosis` | doctor | Create or modify diagnosis | Diagnosis field with Save/Cancel and validation feedback |
| 23 | Prescription Editor | `/doctor/visits/:id/prescription` | doctor | Write prescription | Prescription form with Save/Cancel and validation feedback |
| 24 | Doctor Verification Status | `/doctor/verification-status` | doctor | Verification status | Pending / Approved / Rejected status; resubmit Medical ID if rejected |

### 🛡️ Admin Pages (Authenticated, Admin Only)

| # | Page | Path | Role | Purpose | Description |
|---|------|------|------|---------|-------------|
| 25 | Admin Dashboard | `/admin/dashboard` | admin | System overview | Stat cards, charts, and latest activity for patients, doctors, bookings, and requests |
| 26 | Doctor Verification | `/admin/doctors/verification` | admin | Review pending doctors | Table of doctors awaiting Medical ID review with search and pagination |
| 27 | Doctor Verification Details | `/admin/doctors/verification/:id` | admin | Approve or reject doctor | Zoomable Medical ID image; Approve (with confirmation) or Reject (reason required) |
| 28 | Doctors | `/admin/doctors` | admin | Manage all doctors | Table with specialty, status, sessions, and patient counts; filters and search |
| 29 | Doctor Profile | `/admin/doctors/:id` | admin | Individual doctor details | Header information with tabs for Patients, Sessions, and Services; Waiting List button |
| 30 | Patients | `/admin/patients` | admin | Search and filter patients | Search by name, phone, or email; filters by age group, doctor, status, address, and reports |
| 31 | Patient Profile | `/admin/patients/:id` | admin | Patient booking history | Patient information and booking history with doctors; reports count only |
| 32 | Users & Admins | `/admin/users` | admin | Manage all users | Role tabs (All, Admins, Doctors, Patients); add user drawer; row action menus |
| 33 | User Details | `/admin/users/:id` | admin | Login control panel | Account card with role, status, 2FA, and last login; controls for suspend, force logout, reset password, reset 2FA |
| 34 | Bookings | `/admin/bookings` | admin | Exams and consultations | Tabs for Exams, Consultations, and All; filters for status, doctor, and date range |
| 35 | Booking Details | `/admin/bookings/:id` | admin | Session and patients | Session header and items table with queue number, patient, and status; edit dialogs |
| 36 | Waiting List | `/admin/waiting-list` | admin | Doctor daily queue | Doctor picker and date picker; counters for waiting, completed, and removed patients |
| 37 | Doctor Services | `/admin/services` | admin | Review doctor services | Status tabs (pending, active, rejected); approve or reject with reason |
| 38 | Audit Log | `/admin/audit-log` | admin | Read-only operation log | Filters and expandable metadata JSON; no edit or delete capabilities |
| 39 | Deletion Requests | `/admin/deletion-requests` | admin | Data deletion law compliance | Masked patient names; approve (hard delete or anonymize) or reject with reason |
| 40 | Error Pages | `/403`, `/404`, `/500` | all | Error handling | Clear error message with a return button |

---

## 📋 Page Documentation Template

Every page in the system is documented using the following template:

```
PAGE: [Page Name]
PATH: [route path]
ROLE: [guest | patient | doctor | admin]
PURPOSE: [goal of the page]
STATE: [user state data passed to the page]
APIS: [APIs consumed by the page]
UI COMPONENTS: [components used on the page]
STATES: [loading / empty / error / success states]
ACTIONS: [available user actions]
REDIRECTS: [where users are redirected after actions]
```

---

## 🔌 APIs

The system exposes RESTful API endpoints organized by module. All endpoints follow a consistent documentation pattern.

### 🔐 Authentication APIs

| Method | Path | Role | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/register/patient` | guest | Register a new patient account |
| POST | `/api/auth/register/doctor` | guest | Register a new doctor account with PENDING status and Medical ID upload |
| POST | `/api/auth/login` | guest | Authenticate user and issue JWT Access and Refresh tokens in HTTP-Only Cookies |
| POST | `/api/auth/2fa/verify` | guest / login flow | Verify two-factor authentication code |
| POST | `/api/auth/refresh` | guest | Issue a new Access Token using a valid Refresh Token |
| GET | `/api/auth/me` | authenticated | Retrieve current authenticated user information |
| POST | `/api/auth/logout` | authenticated | Log out user by revoking Refresh Token and clearing cookies |
| POST | `/api/auth/forgot-password` | guest | Start password reset flow by sending a reset link to email |
| POST | `/api/auth/reset-password` | guest | Set a new password using a valid reset token |
| POST | `/api/auth/change-password` | authenticated | Change password from Settings with current password verification |

### 👨‍⚕️ Doctor APIs

| Method | Path | Role | Purpose |
|--------|------|------|---------|
| GET | `/api/doctor/dashboard` | doctor | Retrieve dashboard summary statistics |
| GET | `/api/doctor/bookings?status=pending` | doctor | List pending bookings for the authenticated doctor |
| GET | `/api/doctor/bookings/:bookingId` | doctor | Read booking details with limited patient data |
| PATCH | `/api/doctor/bookings/:bookingId/accept` | doctor | Accept a pending booking, changing status to confirmed and adding patient to queue |
| PATCH | `/api/doctor/bookings/:bookingId/reject` | doctor | Reject a pending booking, changing status to rejected and freeing the appointment slot |
| GET | `/api/doctor/waiting-list` | doctor | View the doctor's current waiting list |
| GET | `/api/doctor/visits/:visitId/clinical-summary` | doctor | Read authorized clinical information for a visit |
| PUT | `/api/doctor/visits/:visitId/diagnosis` | doctor | Create or update diagnosis for a visit |
| POST | `/api/doctor/visits/:visitId/prescriptions` | doctor | Create a prescription for a visit |
| GET | `/api/doctor/visits/:visitId/prescriptions` | doctor | List prescriptions for a visit (optional) |
| GET | `/api/doctor/profile/verification-status` | doctor | Read the doctor's own verification status |

### 🛡️ Admin APIs

| Method | Path | Role | Purpose |
|--------|------|------|---------|
| GET | `/api/admin/stats` | admin | Retrieve dashboard statistics |
| GET | `/api/admin/doctors/pending` | admin | List doctors pending verification |
| GET | `/api/admin/doctors/:id/verification` | admin | Retrieve doctor verification details |
| PATCH | `/api/admin/doctors/:id/approve` | admin | Approve a doctor's verification |
| PATCH | `/api/admin/doctors/:id/reject` | admin | Reject a doctor's verification with a required reason |
| GET | `/api/admin/doctors` | admin | List all doctors |
| GET | `/api/admin/doctors/:id` | admin | Retrieve individual doctor profile |
| GET | `/api/admin/doctors/:id/patients` | admin | Retrieve patients of a specific doctor |
| GET | `/api/admin/patients` | admin | List patients with search and filters |
| GET | `/api/admin/patients/:id` | admin | Retrieve patient profile and booking history |
| GET | `/api/admin/users` | admin | List all users |
| POST | `/api/admin/users` | admin | Create a new user |
| PATCH | `/api/admin/users/:id/role` | admin | Change a user's role |
| PATCH | `/api/admin/users/:id/status` | admin | Suspend or activate a user account |
| DELETE | `/api/admin/users/:id` | admin | Soft delete a user |
| PATCH | `/api/admin/users/:id/restore` | admin | Restore a soft-deleted user |
| POST | `/api/admin/users/:id/force-logout` | admin | Force logout a user by revoking all refresh tokens |
| POST | `/api/admin/users/:id/reset-password` | admin | Send a password reset email to a user |
| POST | `/api/admin/users/:id/reset-2fa` | admin | Reset a user's two-factor authentication |
| GET | `/api/admin/bookings` | admin | List bookings (exams and consultations) |
| GET | `/api/admin/bookings/:id` | admin | Retrieve booking details |
| PATCH | `/api/admin/bookings/:id` | admin | Update booking information |
| DELETE | `/api/admin/bookings/:id` | admin | Soft delete a booking |
| PATCH | `/api/admin/booking-items/:id` | admin | Update a booking item (patient within a session) |
| GET | `/api/admin/waiting-list` | admin | Retrieve waiting list for a doctor on a specific date |
| GET | `/api/admin/services` | admin | List doctor services |
| PATCH | `/api/admin/services/:id/status` | admin | Approve or reject a doctor service |
| GET | `/api/admin/audit-logs` | admin | Read audit log entries |
| GET | `/api/admin/deletion-requests` | admin | List patient data deletion requests |

### 🏥 Queue & Consultation APIs

| Method | Path | Role | Purpose |
|--------|------|------|---------|
| GET | `/queue/:bookingItemId` | patient | Get patient's current queue information |
| POST | `/queue/:bookingItemId/call` | doctor / system | Call the next eligible patient in the queue |
| PATCH | `/queue/:bookingItemId/confirm` | patient | Confirm readiness for consultation |
| PATCH | `/queue/:bookingItemId/decline` | patient | Record a patient decline attempt |
| GET | `/patients/:patientId/medical-history` | doctor | Retrieve patient's medical history |
| GET | `/patients/:patientId/allergies` | doctor | Retrieve patient's allergies |
| GET | `/patients/:patientId/medications` | doctor | Retrieve patient's current medications |
| POST | `/consultations` | doctor | Create a new consultation |
| PATCH | `/consultations/:id` | doctor | Update consultation information |
| POST | `/consultations/:id/prescription` | doctor | Create a prescription for a consultation |
| POST | `/consultations/:id/complete` | doctor | Complete a consultation and generate the medical report |

### API Documentation Template

Every API endpoint is documented using the following template:

```
type: API | RENDER
http method: GET | POST | PATCH | PUT | DELETE
path: /api/...
name: functionName
role: guest | patient | doctor | admin
description by arabic: [description in Arabic]
```

### API Rules

- Every `/api/admin/*` endpoint requires JWT authentication with the `admin` role (returns 401 if not authenticated, 403 if wrong role)
- Every write action creates an entry in the Audit Log
- User, doctor, and service IDs use UUIDs; bookings and booking items use integer IDs
- List endpoints accept pagination parameters (page, limit) and sorting options (sort, order)
- Soft-deleted records are hidden unless explicitly requested with `include_deleted=true`

---

## 📋 Scenarios

The system supports the following business scenarios:

### Scenario 1: Patient Booking and Consultation Flow

**Trigger:** A patient wants to book and complete a medical consultation.

**Flow:**
1. Patient registers an account and logs in
2. Patient books an appointment (initial status: pending)
3. Doctor reviews the pending booking
4. Doctor makes a decision:
   - **Accept:** Status changes to confirmed; patient is added to the waiting queue
   - **Reject:** Status changes to rejected; appointment slot is freed
5. System notifies the patient when their turn approaches
6. Patient receives a turn notification and can either confirm or decline

**Case A — Patient Confirms:**
- Patient selects Confirm
- System records that the patient confirmed their turn
- Doctor is notified that the patient is ready
- Patient enters the consultation room
- Doctor opens the patient's medical information (chronic diseases, allergies, current medications, medical history)
- Doctor asks about current symptoms and performs the examination
- Doctor records symptoms and clinical notes
- Doctor enters the diagnosis
- Doctor creates the prescription
- Doctor completes the consultation
- System saves the consultation and prescription
- Patient can view the medical report and prescription

**Case B — Patient Declines (First Time):**
- Patient selects Decline
- System records the first decline attempt
- Appointment is not cancelled
- Patient remains eligible for another call
- System sends the patient another notification

**Case C — Patient Declines (Second Time):**
- Patient selects Decline again
- System records the second decline attempt
- System cancels the patient's active queue entry
- Cancellation reason is recorded
- Action is recorded in the Audit Log
- Patient receives a cancellation notification
- System moves to the next eligible patient in the queue
- Next patient is notified

---

### Scenario 2: Doctor Verification Flow

**Trigger:** A doctor registers and needs administrative approval before accessing doctor features.

**Flow:**
1. Doctor registers an account and uploads their Egyptian Medical Syndicate ID
2. Account is created with PENDING verification status
3. Admin reviews the doctor's data and Medical ID image
4. Admin makes a decision:
   - **Approve:** Doctor status changes to APPROVED; doctor gains access to protected doctor features; notification email is sent
   - **Reject:** Doctor verification status changes to REJECTED with a mandatory reason (minimum 10 characters); account remains active; doctor can resubmit a new Medical ID from the same account; request returns to PENDING status in the admin verification list
5. Every approval or rejection decision is recorded in the Audit Log

---

### Scenario 3: Admin User Management Flow

**Trigger:** An administrator manages user accounts in the system.

**Flow:**
1. Admin adds a new user by specifying role, name, email, and phone
2. System creates the account and sends a password setup link to the user's email
3. If the role is admin, two-factor authentication is required on first login
4. Admin can modify user data (name, email, phone, address, birth date)
5. Admin can change a user's role (admin or patient only; doctor roles are created through registration and verification)
6. Changing a role immediately revokes all refresh tokens so the new role takes effect
7. Admin can suspend a user account, which cancels all sessions and blocks future logins (403)
8. Admin can soft delete a user, setting a deletion timestamp while preserving associated data
9. Admin can restore a soft-deleted user; status returns to suspended until activated
10. Admin can force logout a user, revoking all refresh tokens while the current access token remains valid until expiration
11. Admin cannot change their own role, suspend themselves, or delete themselves
12. The last active admin cannot be deleted or deactivated

---

### Scenario 4: Waiting List Flow

**Trigger:** An admin or doctor needs to manage the daily queue for a specific doctor.

**Flow:**
1. Admin selects a doctor (by name or ID) and a date (default: today)
2. System retrieves all bookings for that doctor on that date
3. System retrieves all booking items associated with those bookings, ordered by queue number
4. System divides patients into three groups:
   - **Waiting:** Patients with pending or accepted status who have not completed their visit
   - **Completed:** Patients with completed status
   - **Removed:** Patients with rejected, cancelled, or soft-deleted status
5. For each waiting patient, the system displays waiting minutes and estimated wait minutes
6. Admin can modify a patient's status, soft-remove a patient, or restore a removed patient
7. The waiting list can be automatically refreshed at regular intervals

---

### Scenario 5: Data Deletion Request (Law 151/2020)

**Trigger:** A patient requests deletion of their personal data in compliance with Egyptian Personal Data Protection Law No. 151 (2020).

**Flow:**
1. Patient submits a data deletion request
2. System creates a deletion request record with PENDING status
3. Admin reviews the deletion request (patient name is masked for privacy)
4. Admin makes a decision:
   - **Approve:** Patient data is permanently deleted or anonymized; patient is notified; this is the only exception to the soft delete policy
   - **Reject:** Admin provides a reason; patient is notified
5. The admin decision is recorded in the Audit Log without including sensitive patient data

---

## 🗄️ Database

**Database Type:** MongoDB (document database via Mongoose)

The database stores all system data including users, doctor profiles, bookings, medical reports, reviews, audit logs, and deletion requests.

### Database Collections

#### 1. `users` Collection (`User.entity.js`)

Stores all system users (admins, doctors, and patients).

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `user_id` | String (UUID) | Unique external reference for security |
| `role` | String | User role: `admin`, `doctor`, or `patient` |
| `status` | String | Account status: `active`, `pending`, or `suspended` (default: `pending`) |
| `name` | String | Full name of the user |
| `email` | String | Email address, used for login (unique) |
| `email_verified` | Boolean | Whether the email has been verified (default: false) |
| `password_hash` | String | Hashed password |
| `phone` | String | Phone number |
| `address` | String | Physical address |
| `birth_date` | Date | Date of birth (used to calculate age dynamically) |
| `image_profile` | String | URL to profile image |
| `enable_2fa` | Boolean | Whether two-factor authentication is enabled (default: false) |
| `token` | String | Session token |
| `secure_key` | String | Two-factor authentication secret key |
| `last_login` | Date | Last login timestamp |
| `deleted_at` | Date | Soft delete timestamp |
| `deleted_by` | ObjectId → users | Reference to the user who performed the soft delete |
| `created_at`, `updated_at` | Date | Timestamps |

Indexes: `user_id`, `email`, `role`, `status`

#### 2. `doctor_portfolios` Collection (`DoctorPortfolio.entity.js`)

Stores doctor profile information linked to a user account.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `portfolio_id` | String (UUID) | Unique external reference |
| `user_id` | ObjectId → users | Reference to the user account |
| `doctor_name` | String | Doctor's full name |
| `specialty` | String | Medical specialty |
| `title` | String | Professional title |
| `background_image` | String | URL to background image |
| `profile_image` | String | URL to profile image |
| `phone_number` | String | Contact phone number |
| `working_hours` | String | Working hours schedule |
| `created_at`, `updated_at` | Date | Timestamps |

Indexes: `user_id`, `portfolio_id`, `specialty`

#### 3. `doctor_works` Collection (`DoctorWork.entity.js`)

Stores services or works offered by doctors.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `work_id` | String (UUID) | Unique external reference |
| `portfolio_id` | ObjectId → doctor_portfolios | Reference to the doctor's portfolio |
| `status` | String | Service status: `pending`, `active`, or `rejected` |
| `title` | String | Service title |
| `image` | String | URL to service image |
| `price` | Number | Service price |
| `description` | String | Service description |
| `duration_session` | Number | Duration of the session in minutes |
| `working_time` | String | Time of day when the service is available |
| `deleted_at` | Date | Soft delete timestamp |
| `created_at`, `updated_at` | Date | Timestamps |

Indexes: `portfolio_id`, `status`, `work_id`

#### 4. `bookings` Collection (`Booking.entity.js`)

Stores appointment sessions created by doctors.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `portfolio_id` | ObjectId → doctor_portfolios | Reference to the doctor's portfolio |
| `type` | String | Booking type: `booking` (exam) or `consulting` |
| `total_patients` | Number | Maximum number of patients (default: 50) |
| `status` | String | Booking status: `pending`, `active`, `expired`, or `cancelled` |
| `appointment_date` | Date | Date of the appointment |
| `appointment_time` | String | Time of the appointment |
| `deleted_at` | Date | Soft delete timestamp |
| `created_at` | Date | Record creation timestamp |

Indexes: `portfolio_id`, `status`, `appointment_date`, `portfolio_id + appointment_date`

#### 5. `booking_items` Collection (`BookingItem.entity.js`)

Stores individual patient bookings within a booking session.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `booking_id` | ObjectId → bookings | Reference to the booking session |
| `user_id` | ObjectId → users | Reference to the patient user |
| `queue_number` | Number | Patient's position in the queue |
| `patient_name` | String | Patient name snapshot at booking time |
| `patient_phone` | String | Patient phone snapshot at booking time |
| `patient_age` | Number | Patient age snapshot at booking time |
| `patient_address` | String | Patient address snapshot at booking time |
| `status` | String | Item status: `pending`, `accepted`, `rejected`, `completed`, or `cancelled` |
| `qr_code` | String | QR code for check-in |
| `completed_at` | Date | Timestamp when the visit was completed |
| `deleted_at` | Date | Soft delete timestamp |
| `created_at` | Date | Record creation timestamp |

Indexes: `booking_id`, `user_id`, `status`, `booking_id + user_id` (unique)

#### 6. `reviews` Collection (`Review.entity.js`)

Stores patient reviews and ratings for doctors.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `user_id` | ObjectId → users | Reference to the patient |
| `portfolio_id` | ObjectId → doctor_portfolios | Reference to the doctor |
| `feedback` | String | Review text |
| `rating` | Number | Rating from 1 to 5 stars |
| `created_at` | Date | Record creation timestamp |

Indexes: `user_id`, `portfolio_id`

#### 7. `reports` Collection (`Report.entity.js`)

Stores medical reports created by doctors for patients.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `user_id` | ObjectId → users | Reference to the patient |
| `portfolio_id` | ObjectId → doctor_portfolios | Reference to the doctor |
| `description` | String | Medical report description |
| `medicines` | Array | List of medicine identifiers |
| `created_at` | Date | Record creation timestamp |

Indexes: `user_id`, `portfolio_id`

#### 8. `audit_logs` Collection (`AuditLog.entity.js`)

Stores an insert-only log of all sensitive system operations.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `actor_id` | String (UUID) | Identifier of the user who performed the action |
| `actor_role` | String | Role of the actor |
| `action` | String | Type of action performed |
| `entity_type` | String | Type of entity affected |
| `entity_id` | Mixed | Identifier of the affected entity |
| `ip` | String | IP address of the actor |
| `metadata` | Object | Additional details such as old and new values or rejection reasons |
| `created_at` | Date | Record creation timestamp |

Indexes: `actor_id`, `actor_role`, `action`, `entity_type + entity_id`, `created_at`

#### 9. `deletion_requests` Collection (`DeletionRequest.entity.js`)

Stores patient data deletion requests for legal compliance.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `user_id` | ObjectId → users | Reference to the patient requesting deletion |
| `status` | String | Request status: `pending`, `approved`, or `rejected` |
| `reason` | String | Reason for the deletion request |
| `reviewed_by` | ObjectId → users | Reference to the admin who reviewed the request |
| `reviewed_at` | Date | Timestamp when the request was reviewed |
| `created_at` | Date | Record creation timestamp |

Indexes: `user_id`, `status`

#### 10. `refresh_tokens` Collection (`RefreshToken.entity.js`)

Stores JWT refresh tokens to enable token revocation and session management.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `user_id` | ObjectId → users | Reference to the user |
| `token` | String | Refresh token (unique) |
| `expires_at` | Date | Token expiration timestamp |
| `revoked_at` | Date | Token revocation timestamp |
| `created_at`, `updated_at` | Date | Timestamps |

Indexes: `user_id`, `token` (unique), `expires_at` (TTL)

---

## 👥 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Patient** | Register, browse clinics, book appointments, view medical reports, request data deletion, confirm or decline queue turns |
| **Doctor** | View dashboard, manage pending bookings (accept or reject), view waiting list, write prescriptions, modify diagnosis. Cannot access the patient's full account data. Requires admin verification of the Egyptian Medical Syndicate ID before accessing protected features. |
| **Admin** | Verify doctor IDs, approve or reject doctor registrations, manage all users, view system statistics, view the audit log, manage data deletion requests |

---

## 🔐 Authorization Rules

- **401 Unauthorized:** Returned when the user is not authenticated
- **403 Forbidden:** Returned when the user is authenticated but does not have permission for the requested resource
- A doctor cannot access a patient's full account data
- An admin cannot change their own role, suspend their own account, or delete their own account
- The last active admin cannot be deleted or deactivated
- Changing a user's role or suspending an account immediately revokes all refresh tokens

---

## 🔒 Security Mechanisms

1. **Physician Verification:** Doctors must upload their Egyptian Medical Syndicate ID; an admin reviews and approves or rejects before the doctor can access protected features
2. **Authentication:** JWT Access and Refresh tokens stored in HTTP-Only Cookies to prevent token theft via JavaScript
3. **Two-Factor Authentication:** Google Authenticator-based time-based one-time passwords; required for doctors and admins, optional for patients
4. **Role-Based Access Control (RBAC):** Middleware enforces role-based permissions on every protected route
5. **Data Protection:** Transport Layer Security for data in transit; encryption for sensitive data at rest; comprehensive Audit Log for all sensitive operations
6. **Legal Compliance:** Adherence to Egyptian Personal Data Protection Law No. 151 (2020), including a formal data deletion request process
7. **AI Safety:** AI outputs are presented strictly as clinical decision support suggestions; the physician retains full and final authority over all diagnosis, prescriptions, and medical reports

---

## ✅ Checklist

### Project Setup (Structure Complete)
- [x] Initialize Node.js + Express project structure
- [x] Create folder structure (`config/`, `logicModels/`, `routes/`, `models/`, `middleware/`, `services/`, `utils/`, `views/`, `public/`, `scripts/`, `docs/`)
- [x] Create model folders in `logicModels/` for all 10 entities
- [x] Create route folders in `routes/` for all 10 entities
- [x] Create empty placeholder files (no code) for all controllers, renders, APIs, and route index files
- [x] Configure `.env.example` with required environment variables
- [x] Create Docker configuration files (`Dockerfile`, `Dockerfile.dev`, `docker-compose.yml`, `docker-compose.dev.yml`)

### Models (Complete)
- [x] `User.entity.js` — users collection with full schema and indexes
- [x] `DoctorPortfolio.entity.js` — doctor_portfolios collection
- [x] `DoctorWork.entity.js` — doctor_works collection
- [x] `Booking.entity.js` — bookings collection
- [x] `BookingItem.entity.js` — booking_items collection
- [x] `Review.entity.js` — reviews collection
- [x] `Report.entity.js` — reports collection
- [x] `AuditLog.entity.js` — audit_logs collection
- [x] `DeletionRequest.entity.js` — deletion_requests collection
- [x] `RefreshToken.entity.js` — refresh_tokens collection

### Authentication Module (Pending Implementation)
- [ ] Patient registration endpoint (`/api/auth/register/patient`)
- [ ] Doctor registration endpoint (`/api/auth/register/doctor`) + Medical ID upload
- [ ] Login endpoint (JWT Access + Refresh in HTTP-Only Cookies)
- [ ] 2FA verify endpoint (`/api/auth/2fa/verify`)
- [ ] Refresh token endpoint (`/api/auth/refresh`)
- [ ] Logout endpoint (`/api/auth/logout`)
- [ ] Forgot / Reset password flow
- [ ] Change password endpoint
- [ ] `GET /api/auth/me` current user
- [ ] Role-based access middleware (`auth.js`, `roles.js`)
- [ ] Middleware: `checkLogin`, `validate.js` (Joi), `upload.js` (multer), `helmet.js`, `securityLogger.js`

### Patient Module (Pending Implementation)
- [ ] Patient Dashboard page (EJS)
- [ ] Waiting Queue page (EJS)
- [ ] Turn Notification page (Confirm / Decline)
- [ ] First Decline Warning page
- [ ] Appointment Cancelled page
- [ ] Medical History page
- [ ] Medical Report page
- [ ] Queue APIs (`GET /queue/:id`, `POST /queue/:id/call`, `PATCH /queue/:id/confirm`, `PATCH /queue/:id/decline`)
- [ ] Consultation APIs (`POST /consultations`, `PATCH /consultations/:id`, prescription, complete)

### Doctor Module (Pending Implementation)
- [ ] Doctor Login page
- [ ] Doctor Dashboard page
- [ ] Pending Bookings page
- [ ] Booking Details page
- [ ] Waiting List page
- [ ] Patient Visit / Clinical Summary page
- [ ] Diagnosis Editor page
- [ ] Prescription Editor page
- [ ] Doctor Verification Status page
- [ ] Doctor APIs (dashboard, bookings, accept/reject, waiting-list, diagnosis, prescriptions)

### Admin Module (Pending Implementation)
- [ ] Admin Dashboard page
- [ ] Doctor Verification list page
- [ ] Doctor Verification Details page (approve/reject)
- [ ] Doctors list page
- [ ] Doctor Profile page
- [ ] Patients list page
- [ ] Patient Profile page
- [ ] Users & Admins page
- [ ] User Details / Login Control page
- [ ] Bookings page
- [ ] Booking Details page
- [ ] Waiting List page
- [ ] Doctor Services page
- [ ] Audit Log page
- [ ] Deletion Requests page
- [ ] Admin APIs (stats, doctors, patients, users, bookings, waiting-list, services, audit-log, deletion-requests)

### Routes & Controllers (Structure Complete, Code Pending)
- [x] `routes/User/` — `index.js`, `User.apis.js`, `User.render.js`
- [x] `routes/DoctorPortfolio/` — `index.js`, `DoctorPortfolio.apis.js`, `DoctorPortfolio.render.js`
- [x] `routes/DoctorWork/` — `index.js`, `DoctorWork.apis.js`, `DoctorWork.render.js`
- [x] `routes/Booking/` — `index.js`, `Booking.apis.js`, `Booking.render.js`
- [x] `routes/BookingItem/` — `index.js`, `BookingItem.apis.js`, `BookingItem.render.js`
- [x] `routes/Review/` — `index.js`, `Review.apis.js`, `Review.render.js`
- [x] `routes/Report/` — `index.js`, `Report.apis.js`, `Report.render.js`
- [x] `routes/AuditLog/` — `index.js`, `AuditLog.apis.js`, `AuditLog.render.js`
- [x] `routes/DeletionRequest/` — `index.js`, `DeletionRequest.apis.js`, `DeletionRequest.render.js`
- [x] `routes/RefreshToken/` — `index.js`, `RefreshToken.apis.js`, `RefreshToken.render.js`
- [x] `logicModels/User/` — `User.controller.js`, `User.render.js`
- [x] `logicModels/DoctorPortfolio/` — `DoctorPortfolio.controller.js`, `DoctorPortfolio.render.js`
- [x] `logicModels/DoctorWork/` — `DoctorWork.controller.js`, `DoctorWork.render.js`
- [x] `logicModels/Booking/` — `Booking.controller.js`, `Booking.render.js`
- [x] `logicModels/BookingItem/` — `BookingItem.controller.js`, `BookingItem.render.js`
- [x] `logicModels/Review/` — `Review.controller.js`, `Review.render.js`
- [x] `logicModels/Report/` — `Report.controller.js`, `Report.render.js`
- [x] `logicModels/AuditLog/` — `AuditLog.controller.js`, `AuditLog.render.js`
- [x] `logicModels/DeletionRequest/` — `DeletionRequest.controller.js`, `DeletionRequest.render.js`
- [x] `logicModels/RefreshToken/` — `RefreshToken.controller.js`, `RefreshToken.render.js`

### Database (Schema Defined)
- [x] All 10 collections designed with fields, types, enums, and constraints
- [x] Indexes defined for query optimization
- [x] Soft delete pattern (`deleted_at`, `deleted_by`) on relevant collections
- [x] Foreign key references via Mongoose ObjectId with `ref`
- [ ] Implement Mongoose connection in `config/database.js`
- [ ] Create seed and migration scripts in `scripts/`

### AI Integration (Planned)
- [ ] Symptom → specialty routing (NLP)
- [ ] Prescription OCR (Vision-Language Model)
- [ ] Analytics (Traditional ML)

### Testing (Planned)
- [ ] Unit tests (Jest)
- [ ] Integration tests (Supertest)
- [ ] Security tests (OWASP checklist)
- [ ] Manual tests (Postman / Thunder Client)
- [ ] Load testing (Artillery or k6)

### Deployment (Planned)
- [ ] Dockerfile (production)
- [ ] Dockerfile.dev (development, hot reload)
- [ ] docker-compose.yml (production: app + MongoDB)
- [ ] docker-compose.dev.yml (dev: live reload)
- [ ] Environment variables documented

---

## 🗺️ Roadmap to Tasks

The project is planned over approximately 24 weeks across ten phases:

| Phase | Duration | Focus Areas | Deliverables |
|-------|----------|-------------|--------------|
| **1. Research & Requirements** | 4 weeks | Requirements study, database design, user flows, scenarios, API documentation, page documentation, prompts | Requirements document, database design, user flow diagrams, scenario definitions, API specifications, page specifications |
| **2. Project Setup & Scaffolding** | 2 weeks | Project initialization, MongoDB connection, EJS configuration, folder structure, environment setup, middleware | Project boilerplate, authentication middleware, error handling structure |
| **3. Authentication Module** | 3 weeks | Patient and doctor registration, login, JWT cookies, two-factor authentication, token refresh, forgot/reset/change password | Complete authentication system with protected routes |
| **4. Patient Module** | 3 weeks | Patient dashboard, waiting queue, turn notification, medical history, medical report, queue and consultation APIs | All patient-facing features complete |
| **5. Doctor Module** | 4 weeks | Doctor dashboard, pending bookings, waiting list, clinical summary, diagnosis editor, prescription editor, verification status | All doctor-facing features complete |
| **6. Admin Module** | 4 weeks | Admin dashboard, doctor verification, user management, patient management, booking management, waiting list, doctor services, audit log, deletion requests | Complete admin panel |
| **7. AI Integration** | 3 weeks | Symptom-to-specialty routing, prescription OCR, analytics | AI-powered clinical decision support features |
| **8. Mobile App Development** | 4 weeks | Flutter mobile application for patients and doctors | Mobile applications for both patient and doctor users |
| **9. Testing & Optimization** | 2 weeks | Unit testing, integration testing, security testing, manual testing, load testing, bug fixes, code cleanup | Tested and optimized application |
| **10. Documentation & Delivery** | 2 weeks | Final documentation, user manual, presentation materials, project handover | Complete project documentation and delivery |

**Total Estimated Timeline:** Approximately 24 weeks

---

## 🚀 Running the Project

The project can be executed in the following environments:

### Local Development
1. Install project dependencies
2. Configure environment variables using the provided template
3. Start the application server
4. Access the application through the configured port

### Docker Deployment
1. **Development Environment:** Use the development Docker Compose configuration with live code reload and hot restart
2. **Production Environment:** Use the production Docker Compose configuration with optimized images

---

## 🤝 Contributing

1. Obtain the latest version of the main branch
2. Create a new branch for your task using the naming convention (`dev/` for features, `fix/` for bug fixes)
3. Follow the existing code style and project structure
4. Document any new APIs using the API documentation template
5. Document any database changes in the database documentation folder
6. Submit a pull request with a clear description of the changes

**Branch Naming Convention:**
- `fix/branch-name` — for debugging and bug fixes
- `dev/branch-name` — for new code, features, and tasks

---

## 📄 License

ISC — For academic and graduation project use.

---

> Built as a graduation project — Faculty of Computers and Information  
> AI-Powered Smart Clinic System (نظام عيادات ذكي)