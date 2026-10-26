# 🏥 Doctory — AI-Powered Smart Clinic System (نظام عيادات ذكي)

> **Graduation Project** — Faculty of Computers and Information  
> AI-Powered Smart Clinic System for Patient Management and Clinical Decision Support

**Stack:** Node.js · Express.js 5 · MongoDB (Mongoose) · EJS (SSR) · Flutter (planned)

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Current Implementation Status](#current-implementation-status)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Project Structure](#project-structure)
6. [Environment Variables](#environment-variables)
7. [Pages](#pages)
8. [Page Documentation Template](#page-documentation-template)
9. [APIs](#apis)
10. [API Documentation Template](#api-documentation-template)
11. [Scenarios](#scenarios)
12. [Database](#database)
13. [Database Collections](#database-collections)
14. [User Roles & Permissions](#user-roles--permissions)
15. [Authorization Rules](#authorization-rules)
16. [Security Mechanisms](#security-mechanisms)
17. [Notifications Policy](#notifications-policy)
18. [Checklist](#checklist)
19. [Roadmap to Tasks](#roadmap-to-tasks)
20. [Running the Project](#running-the-project)
21. [Contributing](#contributing)
22. [License](#license)

---

## 🎯 Project Overview

**Doctory** is an intelligent clinic management application that simplifies the patient journey, eliminates long waiting times, and provides AI-powered clinical decision support. The system routes patients to the right medical specialty, manages bookings through a doctor-approval workflow, and digitizes prescriptions.

### Core Objectives

- Simplify the patient journey from registration to consultation completion
- Eliminate long waiting times through an organized queue management system
- Route patients to the appropriate medical specialty using AI-assisted symptom analysis
- Manage appointments through a doctor-approval workflow (`pending` → `accepted` / `rejected`)
- Digitize prescriptions and medical reports for easy access and record-keeping
- Deliver in-app notifications to patients, doctors, and admins on every important event
- Provide AI-powered clinical decision support as an **assistance tool**, never a replacement for physician judgment

### ⚠️ AI Disclaimer

> AI in this project is a **Clinical Decision Support Tool**, not an autonomous diagnostic system. The physician always has full authority over diagnosis, prescriptions, and medical reports. All AI outputs are presented as suggestions, never as final medical decisions.

---

## 📊 Current Implementation Status

> This section reflects the **actual state of the repository**, not the target state.

| Layer | Files | Implemented | Status |
|-------|-------|-------------|--------|
| **Models (Mongoose)** | 11 | 11 | ✅ Complete — 11 collections with schemas, enums, indexes |
| **Middleware** | 6 | 6 | ✅ Complete — auth, roles, upload, validate, helmet, securityLogger |
| **Config** | 5 | 3 | ✅ Complete — `database.js`, `env-config.js`, `server-config.js` |
| **Utils** | 8 | 8 | ✅ Complete — all utilities including Joi validation schemas |
| **Routes** | 52 | 5 | 🟡 Structure only — 47 files are empty placeholders |
| **logicModels** | 34 | 4 | 🟡 Structure only — 30 files are empty placeholders |
| **Services** | 4 | 0 | ❌ Empty placeholders |
| **Views (EJS)** | 0 | 0 | ❌ No template files exist yet |
| **Scripts** | 2 | 2 | ✅ `scripts/migrate.js`, `scripts/seed.js` created |
| **Docker / Env** | 4 | 4 | ✅ Complete — MongoDB-based, build verified |

**Overall: the data layer and infrastructure are done; the application layer (routes, controllers, renders, views, services) is not implemented yet.**

The server **starts successfully** and connects to MongoDB. All web requests currently return `500` because the EJS templates they render do not exist yet — this is expected at this stage.

---

## 🛠️ Tech Stack

| Layer | Technology | Status | Purpose |
|-------|-----------|--------|---------|
| **Backend** | Node.js, Express.js 5 | ✅ Installed | Server-side application framework and runtime |
| **Database** | MongoDB + Mongoose | ✅ Installed | The only database in the project — document storage for users, bookings, records, logs |
| **Templating / Rendering** | EJS | ✅ Installed | Server-side view engine for rendering web pages |
| **Mobile** | Flutter | 📱 Planned / separate repo | Cross-platform mobile application for patients and doctors |
| **Authentication** | JWT Access + Refresh in HTTP-Only Cookies | ✅ Libraries installed | Secure stateless authentication with token refresh |
| **Two-Factor Authentication** | Google Authenticator (`speakeasy`) | 📦 Installed, ⏳ Not wired | TOTP codes — required for Doctor and Admin, optional for Patient |
| **Validation** | Joi | ✅ Installed, ⏳ No schemas yet | Request body / params / query validation |
| **File Uploads** | Multer | ✅ Configured | Medical ID images, prescriptions, profile photos |
| **Email** | Nodemailer | ✅ Configured | **Critical-event email only** (see Notifications Policy) |
| **Scheduling** | node-cron | ✅ Configured | Expired refresh-token cleanup; more jobs planned |
| **Security Headers** | Helmet | ✅ Enabled | CSP, HSTS, `X-Frame-Options`, `nosniff` |
| **AI Layer** | Node.js + Express + OpenRouter | 📋 Planned | Symptom → specialty routing, prescription OCR |
| **Cache / Queue** | Redis | 📋 Planned, ❌ Not implemented | Caching, session and background-job queuing |
| **Containerization** | Docker, Docker Compose | ✅ Working | `mongo:7` + app, build and stack verified |

> **Not used in this project:** MySQL, TypeORM, SMS gateways, paid notification providers.

---

## 🏗️ System Architecture

```
┌──────────────────────┐
│  Patient App (Flutter)│  📱 Planned
└──────────┬───────────┘
           │
┌──────────▼───────────┐        ┌────────────────────┐
│  Doctor Web (EJS)    │        │  Admin Web (EJS)   │
└──────────┬───────────┘        └──────────┬─────────┘
           │                               │
           └───────────────┬───────────────┘
                           ▼
              ┌──────────────────────────┐
              │      Express.js API      │
              │  helmet → auth → roles   │
              │  → validate → routes     │
              └─────┬──────────┬─────────┘
                    │          │
                    │          ├──────────────────┐
                    ▼          ▼                  ▼
         ┌───────────────┐  ┌─────────┐   ┌──────────────────────┐
         │    MongoDB    │  │ Redis   │   │  AI Microservice     │
         │   (Mongoose) │  │ Planned │   │  Clinical Decision   │
         │  11 colls.   │  │         │   │  Support — planned   │
         └───────────────┘  └─────────┘   └──────────────────────┘
                     │
                     ▼
        ┌───────────────────────────────────┐
        │   Notifications                    │
        │   • In-App  → notifications coll.  │
        │   • Email   → Nodemailer (critical)│
        │   • NO SMS / NO SMS gateways      │
        └───────────────────────────────────┘
```

### Architectural Pattern

**Full split between Renders and APIs:**

- **Renders** — EJS pages that display the user interface and pass only user state (`checkLogin`) to the frontend
- **APIs** — JSON endpoints consumed by frontend JavaScript through `fetch`

**Route → Controller flow:**

```
routes/[module]/index.js          → mounts the module router
  ├── [module].apis.js            → API endpoints (JSON)
  └── [module].render.js          → page endpoints (EJS)
        ↓ calls
logicModels/[module]/
  ├── [module].controller.js      → API business logic
  └── [module].render.js          → page rendering logic
```

**Error handling:** every controller function is wrapped with `utils/catchError.js`, which catches exceptions and renders the `errors/500` page.

---

## 📁 Project Structure

```
doctory/
├── config/
│   ├── database.js                ✅ Mongoose connection, retry + events
│   ├── env-config.js              ✅ Central config from process.env
│   ├── server-config.js           ✅ Express middleware, static, EJS engine
│   ├── env.js                     ⬜ Empty placeholder
│   └── server.js                  ⬜ Empty placeholder
├── logicModels/
│   ├── auth/
│   │   ├── auth.controller.js     ⬜ Empty placeholder
│   │   └── auth.render.js         ⬜ Empty placeholder
│   ├── patient/
│   │   ├── patient.controller.js  ⬜ Empty placeholder
│   │   └── patient.render.js      ⬜ Empty placeholder
│   ├── doctor/
│   │   ├── doctor.controller.js   ⬜ Empty placeholder
│   │   └── doctor.render.js       ⬜ Empty placeholder
│   ├── admin/
│   │   ├── admin.controller.js    ⬜ Empty placeholder
│   │   └── admin.render.js        ⬜ Empty placeholder
│   ├── Notification/
│   │   ├── Notification.controller.js  ⬜ Empty placeholder
│   │   └── Notification.render.js      ⬜ Empty placeholder
│   ├── User/                      ⬜ Empty — User.controller.js, User.render.js
│   ├── Booking/                   ⬜ Empty — Booking.controller.js, Booking.render.js
│   ├── BookingItem/               ⬜ Empty — BookingItem.controller.js, BookingItem.render.js
│   ├── Review/                    ⬜ Empty — Review.controller.js, Review.render.js
│   ├── Report/                    ⬜ Empty — Report.controller.js, Report.render.js
│   ├── AuditLog/                  ⬜ Empty — AuditLog.controller.js, AuditLog.render.js
│   ├── DeletionRequest/           ⬜ Empty — DeletionRequest.controller.js, .render.js
│   ├── RefreshToken/              ⬜ Empty — RefreshToken.controller.js, .render.js
│   ├── DoctorPortfolio/           ⬜ Empty — DoctorPortfolio.controller.js, .render.js
│   ├── DoctorWork/                ⬜ Empty — DoctorWork.controller.js, .render.js
│   ├── static/
│   │   └── static.render.js       ✅ 7 public page renderers
│   ├── errors/
│   │   └── error.render.js        ✅ 404 / 500 renderers
│   └── module_name_ex/
│       ├── moduleName.controller.js  ✅ Reference auth implementation
│       └── moduleName.render.js      ✅ Reference auth renderers
├── routes/
│   ├── index.js                   ✅ Mounts static + errors only
│   ├── auth/                      ⬜ Empty — index.js, auth.apis.js, auth.render.js
│   ├── patient/                   ⬜ Empty — index.js, patient.apis.js, patient.render.js
│   ├── doctor/                    ⬜ Empty — index.js, doctor.apis.js, doctor.render.js
│   ├── admin/                     ⬜ Empty — index.js, admin.apis.js, admin.render.js
│   ├── Notification/              ⬜ Empty — index.js, Notification.apis.js, .render.js
│   ├── User/                      ⬜ Empty
│   ├── Booking/                   ⬜ Empty
│   ├── BookingItem/               ⬜ Empty
│   ├── Review/                    ⬜ Empty
│   ├── Report/                    ⬜ Empty
│   ├── AuditLog/                  ⬜ Empty
│   ├── DeletionRequest/           ⬜ Empty
│   ├── RefreshToken/              ⬜ Empty
│   ├── DoctorPortfolio/           ⬜ Empty
│   ├── DoctorWork/                ⬜ Empty
│   ├── static/
│   │   ├── index.js               ✅ Router
│   │   └── static.render.js       ✅ Public page routes
│   ├── errors/
│   │   └── index.js               ✅ 404 + 500 handlers
│   └── module_Ex/                 ⬜ Template — index.js, moduleName_EX.apis.js, .render.js
├── models/                        ✅ All 11 Mongoose schemas
│   ├── User.entity.js
│   ├── DoctorPortfolio.entity.js
│   ├── DoctorWork.entity.js
│   ├── Booking.entity.js
│   ├── BookingItem.entity.js
│   ├── Review.entity.js
│   ├── Report.entity.js
│   ├── AuditLog.entity.js
│   ├── DeletionRequest.entity.js
│   ├── RefreshToken.entity.js
│   └── Notification.entity.js
├── middleware/                    ✅ All 6 implemented
│   ├── auth.js                    ✅ JWT verification (cookie + Bearer), Mongoose lookup
│   ├── roles.js                   ✅ RBAC — checks req.user.role
│   ├── upload.js                  ✅ Multer disk storage, MIME filter, size limit
│   ├── validate.js                ✅ Joi validation wrapper
│   ├── helmet.js                  ✅ Security headers (enabled in server-config.js)
│   └── securityLogger.js          ✅ Suspicious request logging
├── services/                      ⬜ All empty placeholders
│   ├── authService.js
│   ├── emailService.js
│   ├── queueService.js
│   └── aiService.js
├── utils/
│   ├── catchError.js              ✅ Controller error wrapper
│   ├── checkLogin.js              ✅ User-state helper for renders
│   ├── cronJobs.js                ✅ Refresh-token cleanup (MongoDB)
│   ├── mailer.js                  ✅ Nodemailer transporter
│   ├── payment.js                 ✅ Paymob integration
│   ├── remove_password.js         ✅ Strips password from user objects
│   ├── removePassword.js          ⬜ Empty placeholder
│   └── validation.js              🟡 Imports Joi, exports empty object
├── views/                         ❌ Folders exist, no EJS files yet
│   ├── auth/
│   ├── patient/
│   ├── doctor/
│   └── admin/
├── public/
│   ├── css/                       ⬜ Empty
│   ├── js/                        ⬜ Empty
│   ├── images/                    ⬜ Empty
│   └── assests/                   📁 1 image file
├── scripts/                       ✅ seed.js, migrate.js created
│   ├── migrate.js                 ✅ Ensures Mongoose indexes on all collections
│   └── seed.js                    ✅ Seeds sample data (admin, doctors, patients, bookings, reviews, reports, notifications)
├── docs/
│   ├── database/
│   ├── backend/
│   ├── frontend/
│   └── system_analysis/
├── server.js                      ✅ Entry point
├── package.json                   ✅ Scripts + dependencies
├── .env.example                   ✅ MongoDB-based template
├── .gitignore                     ✅ Protects .env and node_modules
├── Dockerfile                     ✅ Production image
├── Dockerfile.dev                 ✅ Development image (nodemon)
├── docker-compose.yml             ✅ app + mongo:7
├── docker-compose.dev.yml         ✅ app + mongo:7 with live reload + seed service
└── README.md
```

**Legend:** ✅ implemented · 🟡 partial · ⬜ empty placeholder · 📋 planned · ❌ missing

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and adjust. `.env` is gitignored and must never be committed.

### Server

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP port |
| `NODE_ENV` | `development` | `development` or `production` |
| `PUBLIC_FILE` | `public` | Static assets directory |
| `BACKUP_DIR` | `backups` | Backup output directory |
| `SSR` | `false` | Server-side rendering flag |

### Database (MongoDB only)

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017/clinic_db` | **Primary** connection string |
| `MONGO_HOST` | `localhost` | Used only if `MONGO_URI` is empty |
| `MONGO_PORT` | `27017` | Used only if `MONGO_URI` is empty |
| `MONGO_USER` | *(empty)* | Used only if `MONGO_URI` is empty |
| `MONGO_PASS` | *(empty)* | Used only if `MONGO_URI` is empty |
| `MONGO_DB_NAME` | `clinic_db` | Used only if `MONGO_URI` is empty |

### Redis (planned — not implemented)

| Variable | Default | Description |
|----------|---------|-------------|
| `CACHE_URL` | `redis://localhost:6379` | Redis connection string |
| `CACHE_DB_HOST` / `CACHE_DB_PORT` / `CACHE_DB_USER` / `CACHE_DB_PASS` / `CACHE_DB_NAME` | — | Individual Redis parts |
| `CACHE_SESSION_SECRET` | — | Redis session secret |
| `CACHE_DB_RECOUNECTION` | `true` | Reconnect strategy flag |

### Authentication & Security

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | `super_jwt_access_secret_key_change_me` | Access-token signing secret — **change in production** |
| `JWT_EXPIRES_IN` | `1d` | Access-token lifetime |
| `JWT_REFRESH_SECRET` | `super_jwt_refresh_secret_key_change_me` | Refresh-token signing secret — **change in production** |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh-token lifetime |
| `SALT_ROUNDS` | `12` | bcrypt cost factor |
| `RATE_LIMIT_WINDOW` | `900000` | Rate-limit window in ms (planned) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window (planned) |

### Email (Nodemailer — critical events only)

| Variable | Default | Description |
|----------|---------|-------------|
| `EMAIL_HOST` | `smtp.mailtrap.io` | SMTP host |
| `EMAIL_PORT` | `2525` | SMTP port |
| `EMAIL_USER` | *(empty)* | SMTP username |
| `EMAIL_PASS` | *(empty)* | SMTP password |
| `EMAIL_FROM` | `no-reply@doctory.com` | Sender address |

### Uploads

| Variable | Default | Description |
|----------|---------|-------------|
| `UPLOAD_DIR` | `public/uploads` | Upload destination |
| `UPLOAD_SIZE` | `5242880` | Max file size in bytes (5 MB) |
| `UPLOAD_FILTER_MIMETYPE` | `image/jpeg,image/png,image/webp,application/pdf` | Allowed MIME types |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | *(empty)* | Optional Cloudinary storage |

### AI (planned)

| Variable | Default | Description |
|----------|---------|-------------|
| `BASEURL` | `https://openrouter.ai/api/v1` | OpenRouter endpoint |
| `OPENROUTER_API_KEY` | *(empty)* | OpenRouter API key |
| `SITE_URL` | `http://localhost:3000` | Public site URL (used in email links) |
| `SITE_NAME` | `Doctory App` | Site name |
| `MODEL_NAME` | `anthropic/claude-3.5-sonnet` | Model identifier |
| `TEMPERATURE` | `0.7` | Sampling temperature |
| `MAX_TOKENS` | `1000` | Max response tokens |

### Admin & Logging

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_MAIL` / `ADMIN_PASS` / `ADMIN_USER` / `ADMIN_PHONE` | — | Seed super-admin credentials |
| `LOG_DIR` | `logs` | Log directory |
| `LEVEL` | `info` | Log level |

### CORS

| Variable | Default | Description |
|----------|---------|-------------|
| `CORS_DOMAINS` | `http://localhost:3000,http://localhost:5173` | Allowed origins (comma-separated) |
| `CORS_CREDENTIALS` | `true` | Allow credentials |
| `CORS_HTTP_ONLY` | `true` | HttpOnly cookie flag |
| `CORS_MAX_AGE` | `86400` | Max age in seconds |

---

## 📄 Pages

**54 pages total.** None of the EJS templates exist yet — every page below is **planned**. The status column reflects whether the server-side render function exists in the codebase.

### 🏠 Public Pages

| # | Page | Path | Role | Purpose | Status |
|---|------|------|------|---------|--------|
| 1 | Home / Main Page | `/` | guest | Landing page with Login and Sign Up | 📋 Renderer exists, template missing |
| 2 | About Us | `/about-us` | guest | About the clinic and team | 📋 Renderer exists, template missing |
| 3 | Contact Us | `/contact-us` | guest | Contact information and form | 📋 Renderer exists, template missing |
| 4 | FAQ | `/faq` | guest | Frequently asked questions | 📋 Renderer exists, template missing |
| 5 | Privacy Policy | `/legal/privacy` | guest | Privacy policy | 📋 Renderer exists, template missing |
| 6 | Terms & Conditions | `/legal/terms` | guest | Terms of service | 📋 Renderer exists, template missing |
| 7 | Refund Policy | `/refund` | guest | Refund policy | 📋 Renderer exists, template missing |
| 8 | Sign Up Options | `/auth/signup-options` | guest | Choose Patient or Doctor | 📋 Planned |
| 9 | Login | `/auth/login` | guest | Email + password authentication | 📋 Planned |
| 10 | Patient Registration | `/auth/register/patient` | guest | Name, email, password, phone | 📋 Planned |
| 11 | Doctor Registration | `/auth/register/doctor` | guest | Doctor details + Medical Syndicate ID upload | 📋 Planned |
| 12 | Forgot Password | `/auth/forgot-password` | guest | Request a password reset email | 📋 Planned |
| 13 | Reset Password | `/auth/reset-password/:token` | guest | Set a new password from the email link | 📋 Planned |
| 14 | Email Verification | `/auth/verify-email/:token` | guest | Confirm the account email | 📋 Planned |
| 15 | 2FA Verification | `/auth/2fa/verify` | guest / login flow | Authenticator app code entry | 📋 Planned |
| 16 | Doctor Search / Listing | `/doctors` | guest | Browse doctors by specialty, name, availability | 📋 Planned |
| 17 | Public Doctor Profile | `/doctors/:id` | guest | Public portfolio, services, reviews, working hours | 📋 Planned |

### 👤 Patient Pages

| # | Page | Path | Role | Purpose | Status |
|---|------|------|------|---------|--------|
| 18 | Patient Dashboard | `/patient/dashboard` | patient | Upcoming appointment, doctor, specialty, date, time, queue number, status | 📋 Planned |
| 19 | Waiting Queue | `/patient/waiting-queue` | patient | Queue number, current number, patients ahead, estimated wait, progress | 📋 Planned |
| 20 | Turn Notification | `/patient/turn-notification` | patient | "Your turn is now" with Confirm / Decline | 📋 Planned |
| 21 | First Decline Warning | `/patient/decline-warning` | patient | First decline notice, remaining attempts | 📋 Planned |
| 22 | Appointment Cancelled | `/patient/appointment-cancelled` | patient | Cancellation notice with reason | 📋 Planned |
| 23 | Medical History | `/patient/medical-history` | patient | Chronic diseases, allergies, medications, past history | 📋 Planned |
| 24 | Medical Report | `/patient/medical-report` | patient | Doctor info, visit date, symptoms, diagnosis, prescription | 📋 Planned |
| 25 | Book Appointment / Select Service | `/book/:portfolioId` | patient | Pick a service and a slot for a doctor | 📋 Planned |
| 26 | Patient Profile / Settings | `/patient/settings` | patient | Edit personal data, change password, request data deletion | 📋 Planned |
| 27 | Submit Review | `/patient/review/:bookingItemId` | patient | Rate a doctor after a completed visit | 📋 Planned |
| 28 | Notifications Center | `/notifications` | patient | List in-app notifications, mark as read | 📋 Planned |

### 👨‍⚕️ Doctor Pages

| # | Page | Path | Role | Purpose | Status |
|---|------|------|------|---------|--------|
| 29 | Doctor Login | `/doctor/login` | doctor | Sign in with mandatory 2FA | 📋 Planned |
| 30 | Doctor Dashboard | `/doctor/dashboard` | doctor | Pending bookings count, waiting list, shortcuts | 📋 Planned |
| 31 | Pending Bookings | `/doctor/bookings/pending` | doctor | Review requests, Accept / Reject | 📋 Planned |
| 32 | Booking Details | `/doctor/bookings/:id` | doctor | Only the patient data needed for the decision | 📋 Planned |
| 33 | Waiting List | `/doctor/waiting-list` | doctor | Today's queue for this doctor | 📋 Planned |
| 34 | Patient Visit / Clinical Summary | `/doctor/visits/:id/clinical-summary` | doctor | Authorized clinical context | 📋 Planned |
| 35 | Diagnosis Editor | `/doctor/visits/:id/diagnosis` | doctor | Create or modify the diagnosis | 📋 Planned |
| 36 | Prescription Editor | `/doctor/visits/:id/prescription` | doctor | Write the prescription | 📋 Planned |
| 37 | Doctor Verification Status | `/doctor/verification-status` | doctor | Pending / Approved / Rejected, resubmit Medical ID | 📋 Planned |
| 38 | Doctor Portfolio Editor | `/doctor/portfolio` | doctor | Edit profile, working hours, and services | 📋 Planned |

### 🛡️ Admin Pages

| # | Page | Path | Role | Purpose | Status |
|---|------|------|------|---------|--------|
| 39 | Admin Dashboard | `/admin/dashboard` | admin | Stat cards, charts, recent activity | 📋 Planned |
| 40 | Doctor Verification | `/admin/doctors/verification` | admin | Doctors awaiting Medical ID review | 📋 Planned |
| 41 | Doctor Verification Details | `/admin/doctors/verification/:id` | admin | Zoomable Medical ID, Approve / Reject | 📋 Planned |
| 42 | Doctors | `/admin/doctors` | admin | All doctors with filters | 📋 Planned |
| 43 | Doctor Profile | `/admin/doctors/:id` | admin | Doctor details, patients, sessions, services | 📋 Planned |
| 44 | Patients | `/admin/patients` | admin | Search and filter patients | 📋 Planned |
| 45 | Patient Profile | `/admin/patients/:id` | admin | Patient data and booking history | 📋 Planned |
| 46 | Users & Admins | `/admin/users` | admin | Manage users, roles, activation, soft delete | 📋 Planned |
| 47 | User Details | `/admin/users/:id` | admin | Login control: suspend, force logout, reset password, reset 2FA | 📋 Planned |
| 48 | Bookings | `/admin/bookings` | admin | Exams and consultations with filters | 📋 Planned |
| 49 | Booking Details | `/admin/bookings/:id` | admin | Session and its patients | 📋 Planned |
| 50 | Waiting List | `/admin/waiting-list` | admin | Doctor daily queue — waiting / completed / removed | 📋 Planned |
| 51 | Doctor Services | `/admin/services` | admin | Approve or reject doctor services | 📋 Planned |
| 52 | Audit Log | `/admin/audit-log` | admin | Read-only operation log | 📋 Planned |
| 53 | Deletion Requests | `/admin/deletion-requests` | admin | Handle data-deletion requests (Law 151/2020) | 📋 Planned |
| 54 | Error Pages | `/403`, `/404`, `/500` | all | Clear message with a return button | 📋 Renderers exist, templates missing |

---

## 📋 Page Documentation Template

Every page is documented using this template:

```
PAGE: [Page Name]
PATH: [route path]
ROLE: [guest | patient | doctor | admin]
PURPOSE: [goal of the page]
STATE: [user state data passed to the page]
APIS: [APIs consumed by the page]
UI COMPONENTS: [components used on the page]
STATES: [loading / empty / error / success]
ACTIONS: [available user actions]
REDIRECTS: [where users are redirected after actions]
```

---

## 🔌 APIs

> **Status: all endpoints below are the target design.** The `routes/` files that should serve them are currently **empty placeholders**, and `routes/index.js` mounts only the static and error routers. **No API endpoint is live yet.**

### 🔐 Authentication APIs — 📋 Planned

| Method | Path | Role | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/register/patient` | guest | Register a patient account |
| POST | `/api/auth/register/doctor` | guest | Register a doctor (PENDING status + Medical ID upload) |
| POST | `/api/auth/login` | guest | Authenticate, issue Access + Refresh tokens in HTTP-Only Cookies |
| POST | `/api/auth/2fa/verify` | guest / login flow | Verify the TOTP code (speakeasy) |
| POST | `/api/auth/refresh` | guest | Issue a new Access Token from a valid Refresh Token |
| GET | `/api/auth/me` | authenticated | Current authenticated user |
| POST | `/api/auth/logout` | authenticated | Revoke the Refresh Token and clear cookies |
| POST | `/api/auth/forgot-password` | guest | Send a reset link by email |
| POST | `/api/auth/reset-password` | guest | Set a new password with a valid reset token |
| POST | `/api/auth/change-password` | authenticated | Change the password from Settings |
| POST | `/api/auth/verify-email` | guest | Confirm the account email address |

### 🔔 Notification APIs — 📋 Planned

| Method | Path | Role | Purpose |
|--------|------|------|---------|
| GET | `/api/notifications` | authenticated | List the user's in-app notifications (paginated, filter by `is_read`) |
| PATCH | `/api/notifications/:id/read` | authenticated | Mark one notification as read |
| PATCH | `/api/notifications/read-all` | authenticated | Mark all of the user's notifications as read |
| DELETE | `/api/notifications/:id` | authenticated | Delete one notification |

### 👨‍⚕️ Doctor APIs — 📋 Planned

| Method | Path | Role | Purpose |
|--------|------|------|---------|
| GET | `/api/doctor/dashboard` | doctor | Dashboard summary |
| GET | `/api/doctor/bookings?status=pending` | doctor | Pending bookings for the authenticated doctor |
| GET | `/api/doctor/bookings/:bookingId` | doctor | Booking details with limited patient data |
| PATCH | `/api/doctor/bookings/:bookingId/accept` | doctor | Accept → `confirmed`, add to queue, notify patient |
| PATCH | `/api/doctor/bookings/:bookingId/reject` | doctor | Reject → `rejected`, free the slot, notify patient |
| GET | `/api/doctor/waiting-list` | doctor | The doctor's current waiting list |
| GET | `/api/doctor/visits/:visitId/clinical-summary` | doctor | Authorized clinical information |
| PUT | `/api/doctor/visits/:visitId/diagnosis` | doctor | Create or update the diagnosis |
| POST | `/api/doctor/visits/:visitId/prescriptions` | doctor | Create a prescription |
| GET | `/api/doctor/visits/:visitId/prescriptions` | doctor | List prescriptions |
| GET | `/api/doctor/profile/verification-status` | doctor | Own verification status |
| GET | `/api/doctor/portfolio` | doctor | Own portfolio for editing |
| PATCH | `/api/doctor/portfolio` | doctor | Update profile, working hours |

### 🛡️ Admin APIs — 📋 Planned

| Method | Path | Role | Purpose |
|--------|------|------|---------|
| GET | `/api/admin/stats` | admin | Dashboard statistics |
| GET | `/api/admin/doctors/pending` | admin | Doctors pending verification |
| GET | `/api/admin/doctors/:id/verification` | admin | Verification details |
| PATCH | `/api/admin/doctors/:id/approve` | admin | Approve a doctor (email + audit log) |
| PATCH | `/api/admin/doctors/:id/reject` | admin | Reject a doctor (reason required, email + audit log) |
| GET | `/api/admin/doctors` | admin | All doctors |
| GET | `/api/admin/doctors/:id` | admin | Doctor profile |
| GET | `/api/admin/doctors/:id/patients` | admin | A doctor's patients |
| GET | `/api/admin/patients` | admin | Patients with search and filters |
| GET | `/api/admin/patients/:id` | admin | Patient profile and booking history |
| GET | `/api/admin/users` | admin | All users |
| POST | `/api/admin/users` | admin | Create a user (password set via email link) |
| PATCH | `/api/admin/users/:id` | admin | Update user data |
| PATCH | `/api/admin/users/:id/role` | admin | Change role (revokes refresh tokens) |
| PATCH | `/api/admin/users/:id/status` | admin | Suspend / activate (cancels all sessions) |
| DELETE | `/api/admin/users/:id` | admin | Soft delete |
| PATCH | `/api/admin/users/:id/restore` | admin | Restore a soft-deleted user |
| POST | `/api/admin/users/:id/force-logout` | admin | Revoke all refresh tokens |
| POST | `/api/admin/users/:id/reset-password` | admin | Send a reset-password email |
| POST | `/api/admin/users/:id/reset-2fa` | admin | Clear `secure_key` and disable 2FA |
| GET | `/api/admin/bookings` | admin | Bookings (exams and consultations) |
| GET | `/api/admin/bookings/:id` | admin | Booking details |
| PATCH | `/api/admin/bookings/:id` | admin | Update a booking |
| DELETE | `/api/admin/bookings/:id` | admin | Soft delete a booking |
| PATCH | `/api/admin/booking-items/:id` | admin | Update a patient inside a session |
| GET | `/api/admin/waiting-list` | admin | Waiting list for a doctor on a date |
| GET | `/api/admin/services` | admin | Doctor services |
| PATCH | `/api/admin/services/:id/status` | admin | Approve or reject a service |
| GET | `/api/admin/audit-logs` | admin | Read audit log entries |
| GET | `/api/admin/deletion-requests` | admin | Data-deletion requests |
| PATCH | `/api/admin/deletion-requests/:id` | admin | Approve or reject a deletion request |

### 🏥 Queue & Consultation APIs — 📋 Planned

| Method | Path | Role | Purpose |
|--------|------|------|---------|
| GET | `/queue/:bookingItemId` | patient | Current queue information |
| POST | `/queue/:bookingItemId/call` | doctor / system | Call the next eligible patient |
| PATCH | `/queue/:bookingItemId/confirm` | patient | Confirm readiness for the consultation |
| PATCH | `/queue/:bookingItemId/decline` | patient | Record a decline attempt |
| GET | `/patients/:patientId/medical-history` | doctor | Patient medical history |
| GET | `/patients/:patientId/allergies` | doctor | Patient allergies |
| GET | `/patients/:patientId/medications` | doctor | Current medications |
| POST | `/consultations` | doctor | Create a consultation |
| PATCH | `/consultations/:id` | doctor | Update a consultation |
| POST | `/consultations/:id/prescription` | doctor | Create a prescription |
| POST | `/consultations/:id/complete` | doctor | Complete the consultation and generate the report |

### API Rules

- Every `/api/admin/*` endpoint requires a valid JWT cookie and the `admin` role — `401` when unauthenticated, `403` when the role is wrong
- Every write action creates an `audit_logs` entry
- Users, doctors, and services are addressed by their external UUID (`user_id`, `portfolio_id`, `work_id`); bookings and booking items use the Mongo `ObjectId`
- List endpoints accept `page`, `limit`, `sort`, and `order`, and return `{ items, page, limit, total }`
- Soft-deleted records are hidden unless `include_deleted=true` is passed
- All responses follow a single shape: `{ success, data, message, error }`
- Every controller function is wrapped with `utils/catchError.js`

---

## 📝 API Documentation Template

```
type: API | RENDER
http method: GET | POST | PATCH | PUT | DELETE
path: /api/...
name: functionName
role: guest | patient | doctor | admin
description by arabic: [description in Arabic]
```

---

## 📋 Scenarios

### Scenario 1 — Patient Booking and Consultation

**Trigger:** a patient books and completes a medical consultation.

1. Patient registers and logs in
2. Patient browses doctors or uses AI routing, then books an appointment (`pending`)
3. Doctor reviews the booking
4. Doctor decides:
   - **Accept** → status `confirmed`, patient added to the waiting queue
   - **Reject** → status `rejected`, the appointment slot is freed
5. System notifies the patient when their turn approaches
6. Patient confirms or declines

**Case A — Patient confirms**
- The system records the confirmation and notifies the doctor
- Doctor opens the patient's medical information (chronic diseases, allergies, current medications, history)
- Doctor records symptoms and examination findings, enters the diagnosis, writes the prescription
- Doctor completes the consultation → the report and prescription are saved
- The patient can view the medical report and prescription

**Case B — Patient declines (first time)**
- The first decline is recorded; the appointment is **not** cancelled
- The patient stays eligible and is called again

**Case C — Patient declines (second time)**
- The second decline is recorded and the active queue entry is cancelled
- The cancellation reason is stored, the action is written to the audit log
- The patient receives an in-app notification and a cancellation email
- The system moves to the next eligible patient and notifies them

### Scenario 2 — Doctor Verification

1. Doctor registers, uploads the Egyptian Medical Syndicate ID → status `PENDING`
2. Admin reviews the data and the ID image
3. Admin decides:
   - **Approve** → status `APPROVED`, the doctor gains access to protected features, an email is sent
   - **Reject** → status `REJECTED` with a mandatory reason (minimum 10 characters); the account stays alive and the doctor can resubmit a new Medical ID, returning the request to `PENDING`
4. Every decision is written to the audit log and the doctor is notified in-app and by email

### Scenario 3 — Admin User Management

1. Admin adds a user with role, name, email, and phone → the system creates the account and emails a password-setup link
2. For the `admin` role, 2FA is enforced on first login
3. Admin edits user data, changes a role, suspends, soft-deletes, restores, or force-logs-out
4. Changing a role or suspending revokes all refresh tokens immediately
5. An admin cannot change their own role, suspend themselves, or delete themselves
6. The last active admin cannot be deleted or deactivated

### Scenario 4 — Waiting List

1. The admin picks a doctor and a date (defaults to today)
2. The system loads the doctor's bookings for that day and their items ordered by `queue_number`
3. Patients are split into three groups:
   - **Waiting** — `pending` or `accepted`, not yet completed
   - **Completed** — `completed`
   - **Removed** — `rejected`, `cancelled`, or soft-deleted
4. Each waiting patient shows `waiting_minutes` and `estimated_wait_minutes`
5. The admin can change a patient's status, soft-remove, or restore

### Scenario 5 — Data Deletion Request (Law 151/2020)

1. A patient requests deletion of their personal data → the request is stored as `pending`
2. Admin reviews it (the patient name is masked)
3. Admin decides:
   - **Approve** → the data is permanently deleted or anonymized and the patient is notified — the only exception to the soft-delete rule
   - **Reject** → a reason is given and the patient is notified
4. The decision is written to the audit log without sensitive patient data

---

## 🗄️ Database

**Engine:** MongoDB · **ODM:** Mongoose (`mongoose@9`)

Eleven collections are defined in `models/*.entity.js`. Every schema uses `timestamps: true` and declares explicit indexes.

> **Naming note:** Mongoose derives collection names from the model name and lowercases them, so the physical collections are `users`, `doctorportfolios`, `doctorworks`, `bookings`, `bookingitems`, `reviews`, `reports`, `auditlogs`, `deletionrequests`, `refreshtokens`, and `notifications`.

### ERD

```
users (1) ───< (N) doctorportfolios (1) ───< (N) doctorworks
   │                        │
   │                        └───< (N) bookings (1) ───< (N) bookingitems
   │
   ├──< (N) reviews
   ├──< (N) reports
   ├──< (N) notifications
   ├──< (N) refreshtokens
   ├──< (N) deletionrequests
   └──< (N) auditlogs
```

---

## 👥 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Patient** | Register and use the account immediately, browse doctors, book appointments, confirm or decline queue turns, view medical history and reports, submit a review after a completed visit, manage their own settings, request data deletion |
| **Doctor** | View the dashboard, review pending bookings (accept or reject), view the waiting list, read authorized clinical information, write and modify diagnoses, create prescriptions, manage their own portfolio and services, see their verification status. **Cannot** access a patient's full account data. Requires admin verification of the Egyptian Medical Syndicate ID before protected features are unlocked. |
| **Admin** | Verify and approve or reject doctors, manage all users and their roles, review and moderate doctor services, view statistics, read the audit log, decide data-deletion requests |

---

## 🔐 Authorization Rules

- **401 Unauthorized** — the user is not authenticated
- **403 Forbidden** — the user is authenticated but lacks permission for the resource
- A doctor never sees a patient's full account data (password hash, contact details beyond the visit, or unrelated records)
- An admin cannot change their own role, suspend their own account, or delete their own account
- The last active admin can never be deleted or deactivated
- Changing a role or suspending an account revokes every refresh token immediately
- The admin never sees a user's password and never sees medical report content
- Record-level authorization is enforced in addition to role checks — a doctor may only act on bookings belonging to their own portfolio

---

## 🔒 Security Mechanisms

| # | Mechanism | Status | Detail |
|---|-----------|--------|--------|
| 1 | **Physician Verification** | 📋 Planned | Medical Syndicate ID upload → admin review → approve or reject before protected features are unlocked |
| 2 | **JWT + HTTP-Only Cookies** | ✅ Middleware ready | `middleware/auth.js` verifies the `session_token` cookie (with a `Bearer` fallback), loads the user from MongoDB, and returns `401` for `/api/*` or redirects to `/auth/login` for pages |
| 3 | **Two-Factor Authentication** | 📦 `speakeasy` installed, ⏳ not wired | Google Authenticator TOTP — required for Doctor and Admin, optional for Patient |
| 4 | **RBAC** | ✅ Middleware ready | `middleware/roles.js` returns `403` when `req.user.role` is not in the allowed list |
| 5 | **Request Validation** | ✅ Middleware ready | `middleware/validate.js` validates body, params, and query with Joi and returns all errors at once |
| 6 | **File Upload Hardening** | ✅ Middleware ready | `middleware/upload.js` enforces a MIME allow-list, a 5 MB size cap, and sanitized filenames |
| 7 | **Security Headers** | ✅ **Enabled** | `middleware/helmet.js` sets CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, and the referrer policy; applied in `config/server-config.js` |
| 8 | **Suspicious Request Logging** | ✅ Enabled | `middleware/securityLogger.js` detects path traversal, SQL injection, XSS, and code-injection patterns and writes them to `logs/suspicious.log` |
| 9 | **Rate Limiting** | 📋 Planned | On `/api/auth/*` — window and max-request settings already exist in `env-config.js` |
| 10 | **Password Hashing** | ✅ Ready | bcrypt with a configurable cost factor (`SALT_ROUNDS`, default 12) |
| 11 | **Soft Delete + Audit Log** | ✅ Data layer ready | `deleted_at` / `deleted_by` on users, bookings, booking items, and doctor works; every sensitive write lands in `auditlogs` |
| 12 | **Data Deletion Requests** | 📋 Planned | A formal workflow for Egyptian Personal Data Protection Law No. 151 (2020) |
| 13 | **No SMS** | ✅ Policy | No SMS and no paid SMS gateway anywhere in the project — see Notifications Policy |
| 14 | **AI Safety** | ✅ Policy | AI output is always a suggestion; the physician keeps final authority |
| 15 | **Secret Management** | ✅ | `.env` is gitignored; `.env.example` carries no secrets |

---

## 🔔 Notifications Policy

### Channels

| Channel | Usage | Status |
|---------|-------|--------|
| **In-App** (web + mobile) | The default channel for all normal events. Stored in the `notifications` collection and shown in the Notifications Center | 📦 Model ready · ⏳ Service and APIs not written |
| **Email** (Nodemailer) | **Critical events only** | 📦 `utils/mailer.js` ready · ⏳ Service not written |
| **SMS** | **Not used** | ❌ Out of scope |
| **Paid SMS gateways** (Twilio, Vonage, MessageBird, …) | **Not used** | ❌ Out of scope |
| **Push / FCM** | Optional future enhancement | 📋 Not in current scope |

### Events → Channel

| Event | `type` | In-App | Email |
|-------|--------|:-----:|:-----:|
| Queue position changed | `queue_update` | ✅ | — |
| Doctor accepted a booking | `booking_accepted` | ✅ | ✅ |
| Doctor rejected a booking | `booking_rejected` | ✅ | ✅ |
| Turn is approaching (turn warning) | `turn_warning` | ✅ | — |
| Appointment cancelled | `appointment_cancelled` | ✅ | ✅ |
| Doctor verification approved | `doctor_verified` | ✅ | ✅ |
| Doctor verification rejected | `doctor_verified` | ✅ | ✅ |
| Deletion-request decision | `deletion_request_update` | ✅ | ✅ |
| Account email verification | *(system)* | ✅ | ✅ |
| Forgot / reset password | *(system)* | — | ✅ |
| Generic system notice | `system` | ✅ | — |

### Rules

1. **In-app first.** Every meaningful event creates a `notifications` document addressed to the affected user.
2. **Email is reserved for critical events only** — email verification, forgot/reset password, doctor verification approve/reject, final booking accept/reject, and deletion-request decisions.
3. **Never SMS.** No SMS channel and no paid third-party SMS gateway are used, configured, or planned.
4. **One writer.** All notifications are created through a single `services/notificationService.js` function so the policy stays in one place — this file is still an empty placeholder.
5. **Unread tracking.** `is_read` is the source of truth, indexed together with `user_id` for fast unread counters.
6. **Sensitive content.** A notification references its subject through `related_entity_type` and `related_entity_id` rather than embedding protected medical data.

---

## ✅ Checklist

### Infrastructure — ✅ Complete

- [x] Node.js + Express 5 project initialized
- [x] Folder structure for `config/`, `logicModels/`, `routes/`, `models/`, `middleware/`, `services/`, `utils/`, `views/`, `public/`, `scripts/`, `docs/`
- [x] Module folder pattern applied to all 15 modules (`auth`, `patient`, `doctor`, `admin`, `Notification`, `User`, `Booking`, `BookingItem`, `Review`, `Report`, `AuditLog`, `DeletionRequest`, `RefreshToken`, `DoctorPortfolio`, `DoctorWork`)
- [x] `config/database.js` — Mongoose connection with retry, timeouts, and connection events
- [x] `config/env-config.js` — centralized configuration from `process.env`
- [x] `config/server-config.js` — body parsers, cookie parser, static files, EJS engine, helmet, security logger
- [x] `server.js` — starts the server only after a successful database connection
- [x] TypeORM and `reflect-metadata` removed — Mongoose is the only ODM
- [x] `config/data-source.js` deleted
- [x] `.env.example` targets MongoDB — no MySQL variables
- [x] `.gitignore` protects `.env`, `node_modules/`, `logs/`, and `uploads/`
- [x] `Dockerfile` (production) and `Dockerfile.dev` (nodemon hot reload)
- [x] `docker-compose.yml` and `docker-compose.dev.yml` run `mongo:7` with a healthcheck and a named volume
- [x] Docker build and the full compose stack verified end to end
- [x] `npm install` succeeds — all dependencies present

### Data Layer — ✅ Complete

- [x] `User.entity.js`
- [x] `DoctorPortfolio.entity.js`
- [x] `DoctorWork.entity.js`
- [x] `Booking.entity.js`
- [x] `BookingItem.entity.js`
- [x] `Review.entity.js`
- [x] `Report.entity.js`
- [x] `AuditLog.entity.js`
- [x] `DeletionRequest.entity.js`
- [x] `RefreshToken.entity.js` — with a TTL index on `expires_at`
- [x] `Notification.entity.js` — new, with the full type enum and the notification policy documented
- [x] Enums, required fields, unique constraints, soft-delete fields, and indexes on every schema

### Middleware — ✅ Complete

- [x] `auth.js` — JWT verification from the HTTP-Only cookie, `Bearer` fallback, Mongoose user lookup, `401` vs. redirect
- [x] `roles.js` — RBAC with `403`
- [x] `upload.js` — Multer with a MIME allow-list, size cap, and sanitized filenames
- [x] `validate.js` — Joi validation wrapper returning all errors
- [x] `helmet.js` — enabled and applied
- [x] `securityLogger.js` — suspicious request detection and logging

### Utils — 🟡 Mostly

- [x] `catchError.js` — controller error wrapper
- [x] `checkLogin.js` — user-state helper for renders
- [x] `mailer.js` — Nodemailer transporter
- [x] `cronJobs.js` — refresh-token cleanup using Mongoose
- [x] `remove_password.js` — strips the password field
- [x] `payment.js` — Paymob integration
- [x] `validation.js` — Joi schemas for all models implemented

### Routes — ❌ Not implemented (Documented in route index comments)

- [ ] `routes/index.js` — mount all 15 modules
- [ ] `routes/auth/` — index.js, auth.apis.js, auth.render.js *(documented in index.js comments)*
- [ ] `routes/patient/` — index.js, patient.apis.js, patient.render.js *(documented in index.js comments)*
- [ ] `routes/doctor/` — index.js, doctor.apis.js, doctor.render.js *(documented in index.js comments)*
- [ ] `routes/admin/` — index.js, admin.apis.js, admin.render.js *(documented in index.js comments)*
- [ ] `routes/Notification/` — index.js, Notification.apis.js, Notification.render.js *(documented in index.js comments)*
- [ ] `routes/User/`, `routes/Booking/`, `routes/BookingItem/`, `routes/Review/`, `routes/Report/`
- [ ] `routes/AuditLog/`, `routes/DeletionRequest/`, `routes/RefreshToken/`
- [ ] `routes/DoctorPortfolio/`, `routes/DoctorWork/`


### Controllers & Renders — ❌ Not implemented

- [ ] `logicModels/auth/` — auth.controller.js, auth.render.js
- [ ] `logicModels/patient/` — patient.controller.js, patient.render.js
- [ ] `logicModels/doctor/` — doctor.controller.js, doctor.render.js
- [ ] `logicModels/admin/` — admin.controller.js, admin.render.js
- [ ] `logicModels/Notification/` — Notification.controller.js, Notification.render.js
- [ ] `logicModels/User/`, `Booking/`, `BookingItem/`, `Review/`, `Report/`
- [ ] `logicModels/AuditLog/`, `DeletionRequest/`, `RefreshToken/`
- [ ] `logicModels/DoctorPortfolio/`, `DoctorWork/`
- [ ] A single `auditLog` helper for automatic write logging

### Services — ❌ Not implemented

- [ ] `services/authService.js` — token issuance, refresh, revocation
- [ ] `services/emailService.js` — critical-event email templates
- [ ] `services/notificationService.js` — the single `createNotification()` entry point
- [ ] `services/queueService.js` — queue ordering and wait-time estimation
- [ ] `services/aiService.js` — symptom routing and prescription OCR

### Views — ❌ Not implemented

- [ ] `views/auth/` — login, signup options, register (patient and doctor), forgot/reset password, email verification, 2FA
- [ ] `views/patient/` — dashboard, waiting queue, turn notification, decline warning, cancellation, medical history, medical report, booking, settings, review
- [ ] `views/doctor/` — dashboard, pending bookings, booking details, waiting list, clinical summary, diagnosis, prescription, verification status, portfolio editor
- [ ] `views/admin/` — 16 admin pages
- [ ] `views/static/` — home, about, contact, FAQ, privacy, terms, refund
- [ ] `views/errors/` — 403, 404, 500
- [ ] `public/css/`, `public/js/`, `public/images/` — assets

### Scripts — ✅ Complete

- [x] `scripts/migrate.js` — Creates all Mongoose indexes on all collections
- [x] `scripts/seed.js` — Seeds sample data (admin, 2 doctors, 2 patients, bookings, reviews, reports, notifications)

### Authentication — ❌ Not implemented

- [ ] Patient registration endpoint
- [ ] Doctor registration endpoint with Medical ID upload
- [ ] Login, 2FA verification, refresh, logout, `GET /me`
- [ ] Forgot / reset / change password
- [ ] Email verification flow
- [ ] Rate limiting on `/api/auth/*`

### Feature Modules — ❌ Not implemented

- [ ] Patient module — dashboard, queue, confirm/decline (with MongoDB transactions), medical history, report
- [ ] Doctor module — dashboard, bookings, waiting list, diagnosis, prescription, verification status, portfolio editor
- [ ] Admin module — stats, doctor verification, users, patients, bookings, waiting list, services, audit log, deletion requests
- [ ] Notification module — service, APIs, Notifications Center page
- [ ] Doctor search and public doctor profile pages
- [ ] Booking flow — service selection, slot selection, booking creation

### AI Integration — ❌ Not implemented

- [ ] Symptom → specialty routing
- [ ] Prescription OCR
- [ ] Clinical analytics

### Testing — ❌ Not implemented

- [ ] Unit tests (Jest)
- [ ] Integration tests (Supertest)
- [ ] Security tests (OWASP checklist)
- [ ] Manual tests (Postman / Thunder Client)
- [ ] Load tests (Artillery or k6)

### Infrastructure — 📋 Planned

- [ ] Redis for caching and job queues
- [ ] Cloudinary storage for uploads
- [ ] Push notifications (optional future work)

---

## 🗺️ Roadmap to Tasks

| Phase | Duration | Focus | Deliverables | Status |
|-------|----------|-------|--------------|--------|
| **1. Research & Requirements** | 4 weeks | Requirements, database design, user flows, scenarios, API and page documentation, AI prompts | Requirements doc, data model, flow diagrams, API specs, page specs | ✅ Documentation complete |
| **2. Project Setup & Scaffolding** | 2 weeks | Project initialization, folder structure, MongoDB connection, EJS, Docker, env configuration, middleware | Runnable skeleton, middleware, error handling | ✅ **Complete** |
| **3. Data Layer** | 1 week | Mongoose schemas, enums, indexes, soft delete, notification collection | 11 validated entity files | ✅ **Complete** |
| **4. Authentication Module** | 3 weeks | Registration, login, JWT cookies, 2FA, refresh, password reset, email verification | Working auth with protected routes | ⬜ Next |
| **5. Notification Module** | 1 week | `notificationService`, in-app APIs, critical-event email service, Notifications Center | Unified notification delivery | ⬜ Next |
| **6. Patient Module** | 3 weeks | Dashboard, queue, confirm/decline, booking flow, medical history, report, settings, review | All patient-facing features | ⬜ Planned |
| **7. Doctor Module** | 4 weeks | Dashboard, bookings, waiting list, clinical summary, diagnosis, prescription, verification status, portfolio editor | All doctor-facing features | ⬜ Planned |
| **8. Admin Module** | 4 weeks | Stats, doctor verification, users, patients, bookings, waiting list, services, audit log, deletion requests | Complete admin panel | ⬜ Planned |
| **9. AI Integration** | 3 weeks | Symptom routing, prescription OCR, analytics | Clinical decision support | ⬜ Planned |
| **10. Mobile App (Flutter)** | 4 weeks | Patient app and doctor app | Flutter applications | ⬜ Planned |
| **11. Views (EJS)** | 3 weeks | All 54 page templates, shared layout, assets | Complete web UI | ⬜ Planned |
| **12. Testing & Optimization** | 2 weeks | Unit, integration, security, load testing; fixes | Tested and optimized application | ⬜ Planned |
| **13. Documentation & Delivery** | 2 weeks | Final README, API docs, user manual, presentation | Complete handover | ⬜ Planned |

**Total estimated timeline:** approximately 32 weeks

---

## 🚀 Running the Project

### Prerequisites

- **Node.js 20+**
- **MongoDB** running locally, or Docker available

### Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
# then edit .env — at minimum set MONGO_URI and the JWT secrets

# 3. Make sure MongoDB is running
#    Option A — local MongoDB on the default port
#    Option B — with Docker:
docker run -d --name doctory_mongo -p 27017:27017 mongo:7

# 4. Run migrations (creates indexes on all collections)
npm run migrate

# 5. Seed sample data (optional but recommended for testing)
npm run seed

# 6. Start the development server (auto-reload)
npm run dev

# 7. Or start in production mode
npm start
```

The server listens on `http://localhost:3000` and only starts after a successful MongoDB connection.

> **Note:** at the current stage, pages return `500` because the EJS templates do not exist yet. The server itself starts and stays healthy.

### Docker

```bash
# Development — live code reload, MongoDB on host port 27017
docker compose -f docker-compose.dev.yml up --build

# Production — optimized image, MongoDB on host port 27017
docker compose up --build -d

# Stop and remove
docker compose down        # production
docker compose -f docker-compose.dev.yml down   # development
```

Both compose files run **MongoDB** (`mongo:7`) with a healthcheck, a named volume, and the app configured with the matching `MONGO_URI`.

The `docker-compose.dev.yml` also includes a `seed` service that automatically runs `npm run seed` after the app and MongoDB are healthy, so your development database comes pre-populated with sample data.

### Available npm scripts

| Script | Command | Status |
|--------|---------|--------|
| `npm start` | `node server.js` | ✅ Working |
| `npm run dev` | `nodemon server.js` | ✅ Working |
| `npm run migrate` | `node scripts/migrate.js` | ✅ Working |
| `npm run migrate:revert` | `node scripts/migrate.js --revert` | ⬜ Script exists but revert logic not implemented |
| `npm run seed` | `node scripts/seed.js` | ✅ Working |
| `npm run lint` | placeholder | ⬜ No linter configured |
| `npm test` | placeholder | ⬜ No test suite yet |

---

## 🤝 Contributing

1. Pull the latest changes from `main`
2. Create a branch: `dev/feature-name` for new work, `fix/bug-name` for bug fixes
3. Follow the existing code style — CommonJS, Express 5, Mongoose, `catchError` wrapper
4. Keep the module pattern: every domain gets a `routes/[module]/` folder and a `logicModels/[module]/` folder
5. Document new APIs using the API template and new pages using the page template
6. Document database changes in `docs/database/`
7. Open a pull request with a clear description of the change

**Branch naming:** `dev/branch-name` for features, `fix/branch-name` for bug fixes

**Commit messages:** `feat: short description`, `fix: short description`, `docs: short description`, `refactor: short description`

---

## 📄 License

ISC — for academic and graduation project use.

---

> Graduation Project — Faculty of Computers and Information  
> AI-Powered Smart Clinic System (نظام عيادات ذكي)  
> AI is clinical decision support only. The physician always makes the final decision.
