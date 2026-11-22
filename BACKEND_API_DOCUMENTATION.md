# Backend Routes & APIs Documentation — Read-Only Audit

**Project:** Doctory — AI-Powered Smart Clinic System  
**File:** `BACKEND_API_DOCUMENTATION.md`  
**Purpose:** Primary reference for frontend-to-backend integration  
**Status:** Documentation only — no source code was modified  
**Generated from:** Read-only audit of the existing backend repository

---

## 1. Backend Architecture Overview

Doctory is a Node.js + Express 5 backend using MongoDB (Mongoose) as the database and EJS for server-side rendering. The frontend is planned as Flutter (mobile) with EJS views for the web admin/patient/doctor dashboards.

### Core Design Principles

- **Separation of concerns:** Route files declare endpoints; logicModels (controllers/renders) contain business logic; services handle external integrations; utils provide shared helpers.
- **Authentication:** JWT-based via HTTP-Only cookies (`session_token`) with optional `Bearer` token fallback.
- **Authorization:** Role-based access control (RBAC) via `roles.js` middleware supporting `admin`, `doctor`, `patient` roles.
- **Validation:** Joi schemas in `utils/validation.js` covering all models.
- **Error handling:** `catchError.js` wrapper for controllers; centralized 404/500 error rendering.
- **File uploads:** Multer with MIME allow-list and size cap via `middleware/upload.js`.
- **Notifications:** In-app only (Nodemailer email reserved for critical events). No SMS.

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Web Framework | Express.js 5 |
| Database | MongoDB (Mongoose) |
| Template Engine | EJS |
| Authentication | JWT (jsonwebtoken), bcrypt, speakeasy (2FA/TOTP) |
| Validation | Joi |
| File Upload | Multer |
| Email | Nodemailer |
| Scheduling | node-cron |
| Payment | Paymob (in `utils/payment.js`) |

---

## 2. Application Entry Point and Routing Configuration

### 2.1 Entry Point

**File:** `server.js`

The application bootstrap sequence:

1. `require('./config/server-config')(app)` — applies global middleware and configures EJS.
2. `require('./routes/index')(app)` — mounts all route modules.
3. `connectDB()` — connects to MongoDB with retry logic.
4. `app.listen(PORT)` — starts the HTTP server.

### 2.2 Global Middleware

**File:** `config/server-config.js`

Applied to all incoming requests before route matching:

| Middleware | Purpose |
|------------|---------|
| `helmet` | Security headers (CSP, referrer policy, etc.) |
| `securityLogger` | Detects and logs suspicious requests (XSS, SQL injection, path traversal) |
| `express.json()` | Parses JSON request bodies |
| `express.urlencoded({ extended: true })` | Parses URL-encoded form bodies |
| `cookieParser()` | Parses HTTP cookies (used for JWT session token) |
| `express.static()` | Serves static files from `public/` directory |
| `express.static("/uploads")` | Serves uploaded files from `public/uploads/` |
| EJS view engine | Sets `view engine` to `ejs`, `views` directory to `views/` |

### 2.3 Route Registration

**File:** `routes/index.js`

This is the **single point of route mounting**. Only 3 modules are currently registered:

```js
app.use('/', require('./static/index.js'));
app.use('/', require('./User/index.js'));
app.use('/', require('./errors/index.js'));
```

**Critical Finding:** All other route modules exist as files but are **NOT mounted** in `routes/index.js`. They are not reachable through the application:

| Route File | Mounted? | Status |
|------------|----------|--------|
| `routes/static/index.js` | ✅ Yes (`/`) | Implemented |
| `routes/User/index.js` | ✅ Yes (`/`) | Partially implemented |
| `routes/errors/index.js` | ✅ Yes (`/`) | Implemented (error handlers) |
| `routes/auth/index.js` | ❌ No | Declared in comments only |
| `routes/admin/index.js` | ❌ No | Declared in comments only |
| `routes/patient/index.js` | ❌ No | Empty file (0 lines) |
| `routes/doctor/index.js` | ❌ No | Empty file (0 lines) |
| `routes/Booking/index.js` | ❌ No | Empty file (0 lines) |
| `routes/BookingItem/index.js` | ❌ No | Empty file (0 lines) |
| `routes/DoctorPortfolio/index.js` | ❌ No | Empty file (0 lines) |
| `routes/DoctorWork/index.js` | ❌ No | Empty file (0 lines) |
| `routes/Notification/index.js` | ❌ No | Empty file (0 lines) |
| `routes/Review/index.js` | ❌ No | Empty file (0 lines) |
| `routes/Report/index.js` | ❌ No | Empty file (0 lines) |
| `routes/DeletionRequest/index.js` | ❌ No | Empty file (0 lines) |

### 2.4 Route Prefix Rules

All mounted routes use prefix `/` (root). Internal router prefixes are defined within each module's index file:

- `routes/User/index.js`: `router.use('/api/user', ...)` and `router.use('/user', ...)`
- `routes/static/index.js`: `router.use('/', ...)` (no additional prefix)
- `routes/errors/index.js`: Catch-all 404 and 500 handlers

---

## 3. Authentication and Authorization Overview

### 3.1 Authentication Middleware

**File:** `middleware/auth.js`

| Aspect | Detail |
|--------|--------|
| Token source | HTTP-Only cookie `session_token` (primary), `Authorization: Bearer <token>` header (fallback) |
| Token type | JWT signed with `config.auth.jwt.secret` |
| Payload | `{ user_id, email, role }` |
| Expiration | `JWT_EXPIRES_IN` (default `1d`) |
| Success | Sets `req.user` (Mongoose user document, lean) and calls `next()` |
| Failure (API path) | Returns `401 JSON` `{ status: "error", message: "..." }` |
| Failure (page path) | Redirects to `/auth/login` |
| Missing token (API) | `401` JSON |
| Missing token (page) | Redirect to `/auth/login` |
| Invalid/expired token (API) | `401` JSON |
| Invalid/expired token (page) | Redirect to `/auth/login` |
| User not found (API) | `401` JSON |
| User not found (page) | Redirect to `/auth/login` |

**Does NOT enforce:** `email_verified`, `enable_2fa`, or role-specific restrictions (those are handled by individual controllers or `roles.js`).

### 3.2 Authorization Middleware

**File:** `middleware/roles.js`

```js
module.exports = (...roles) => { ... }
```

| Aspect | Detail |
|--------|--------|
| Usage | `roles('admin')`, `roles('admin', 'doctor')`, etc. |
| Missing `req.user` | Returns `401` JSON |
| Role not in allowed list | Returns `403` JSON `{ status: "error", message: "لا تملك صلاحية لهذا" }` |
| Success | Calls `next()` |

### 3.3 Refresh Token Model

**Model:** `RefreshToken.entity.js`

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | ObjectId → User | Required |
| `token` | String | Unique, required |
| `expires_at` | Date | Required, TTL index (`expireAfterSeconds: 0`) |
| `revoked_at` | Date | Default null |

Indexes: `user_id`, `token` (unique), `expires_at` (TTL).

---

## 4. API Modules

Only two modules have any actual mounted route code: **Static** and **User**. All other modules (Auth, Admin, Patient, Doctor, Booking, etc.) have route files with documentation comments but **zero implemented Express routes**.

### 4.1 Static Module

**Purpose:** Public informational pages (home, about, contact, FAQ, legal policies).  
**Route File:** `routes/static/static.render.js` (mounted at `/`)  
**Controller:** `logicModels/static/static.render.js`  
**Auth:** None required (guest accessible)  
**Endpoints:** 7 GET routes, all implemented.

### 4.2 User Module

**Purpose:** User profile management, 2FA, account settings, image upload.  
**Route File:** `routes/User/index.js` (mounted at `/`)  
**API Mount:** `router.use('/api/user', require('./User.apis.js'))` — **`User.apis.js` is empty (0 lines)**  
**Render Mount:** `router.use('/user', require('./User.render.js'))`  
**Controller:** `logicModels/User/User.controller.js`  
**Render Controller:** `logicModels/User/User.render.js`  
**Auth:** Required for API endpoints (via `middleware/auth.js`)  
**Endpoints:** 6 controller functions implemented, but only 2 have actual route wiring.

### 4.3 Unmounted Modules (Declared Only)

The following modules have route index files containing only documentation comments (no Express router code). Their `.apis.js` and `.render.js` files are empty (0 lines). Their controllers and renders are also empty:

- **Auth** — `routes/auth/index.js` (106 lines of comments only)
- **Admin** — `routes/admin/index.js` (251 lines of comments only)
- **Patient** — `routes/patient/index.js` (empty)
- **Doctor** — `routes/doctor/index.js` (empty)
- **Booking** — `routes/Booking/index.js` (empty)
- **BookingItem** — `routes/BookingItem/index.js` (empty)
- **DoctorPortfolio** — `routes/DoctorPortfolio/index.js` (empty)
- **DoctorWork** — `routes/DoctorWork/index.js` (empty)
- **Notification** — `routes/Notification/index.js` (empty)
- **Review** — `routes/Review/index.js` (empty)
- **Report** — `routes/Report/index.js` (empty)
- **DeletionRequest** — `routes/DeletionRequest/index.js` (empty)

### 4.4 Reference Implementation

**File:** `logicModels/module_name_ex/moduleName.controller.js`

This file contains a working reference implementation of the auth flow (register, login, forgot-password, reset-password, logout). It is **not connected to any route** — it serves as a template for Phase 2 implementation.

---

## 5. Detailed API Reference

### 5.1 Static Pages (Implemented)

#### 5.1.1 GET / — Home Page

| Attribute | Value |
|-----------|-------|
| **Method** | GET |
| **URL** | `/` |
| **Route File** | `routes/static/static.render.js` |
| **Controller** | `logicModels/static/static.render.js` → `getHomeRender` |
| **Service** | None |
| **Auth Required** | No |
| **Middleware** | `catchError` wrapper |
| **Purpose** | Renders the landing page (`static/home.ejs`) |

**Request:** None  
**Response:** HTML (EJS render of `static/home`)

---

#### 5.1.2 GET /about-us — About Page

| Attribute | Value |
|-----------|-------|
| **Method** | GET |
| **URL** | `/about-us` |
| **Controller** | `logicModels/static/static.render.js` → `getAboutRender` |
| **Auth Required** | No |

**Response:** HTML (EJS render of `static/about`)

---

#### 5.1.3 GET /contact-us — Contact Page

| Attribute | Value |
|-----------|-------|
| **Method** | GET |
| **URL** | `/contact-us` |
| **Controller** | `logicModels/static/static.render.js` → `getContactRender` |
| **Auth Required** | No |

**Response:** HTML (EJS render of `static/contact`)

---

#### 5.1.4 GET /faq — FAQ Page

| Attribute | Value |
|-----------|-------|
| **Method** | GET |
| **URL** | `/faq` |
| **Controller** | `logicModels/static/static.render.js` → `getFaqRender` |
| **Auth Required** | No |

**Response:** HTML (EJS render of `static/faq`)

---

#### 5.1.5 GET /privacy — Privacy Policy

| Attribute | Value |
|-----------|-------|
| **Method** | GET |
| **URL** | `/privacy` |
| **Controller** | `logicModels/static/static.render.js` → `getPrivacyRender` |
| **Auth Required** | No |

**Response:** HTML (EJS render of `static/privacy`)

---

#### 5.1.6 GET /terms — Terms & Conditions

| Attribute | Value |
|-----------|-------|
| **Method** | GET |
| **URL** | `/terms` |
| **Controller** | `logicModels/static/static.render.js` → `getTermsRender` |
| **Auth Required** | No |

**Response:** HTML (EJS render of `static/terms`)

---

#### 5.1.7 GET /refund — Refund Policy

| Attribute | Value |
|-----------|-------|
| **Method** | GET |
| **URL** | `/refund` |
| **Controller** | `logicModels/static/static.render.js` → `getRefundRender` |
| **Auth Required** | No |

**Response:** HTML (EJS render of `static/refund`)

---

### 5.2 User Profile APIs (Controller Implemented, Route Wiring Incomplete)

#### 5.2.1 PATCH /api/user/profile — Update User Profile

| Attribute | Value |
|-----------|-------|
| **Method** | PATCH |
| **URL** | `/api/user/profile` |
| **Route File** | `routes/User/User.apis.js` (EMPTY — route not wired) |
| **Controller** | `logicModels/User/User.controller.js` → `updateProfile` |
| **Service** | None |
| **Auth Required** | Yes (`middleware/auth.js`) |
| **Required Role** | Any authenticated user |
| **Purpose** | Updates user profile fields: name, email, phone, address, birth_date |

**Request Headers:**
- `Cookie: session_token=<JWT>` (or `Authorization: Bearer <JWT>`)

**Request Body:**
```json
{
  "name": "string (optional)",
  "email": "string (optional, must be unique)",
  "phone": "string (optional)",
  "address": "string (optional)",
  "birth_date": "ISO date string (optional)"
}
```

**Validation Rules:** Only `name`, `email`, `phone`, `address`, `birth_date` are allowed. Email must be unique (case-insensitive). At least one field must be provided.

**Success Response (200):**
```json
{
  "status": "success",
  "message": "تم تحديث البيانات بنجاح",
  "data": {
    "user_id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "birth_date": "date",
    "role": "admin\|doctor\|patient",
    "status": "active\|pending\|suspended",
    "image_profile": "string",
    "enable_2fa": true\|false
  }
}
```

**Error Responses:**
- `400` — No fields to update (`{ status: 'error', message: 'لا توجد بيانات للتحديث' }`)
- `409` — Email already in use (`{ status: 'error', message: 'البريد الإلكتروني مستخدم بالفعل' }`)
- `401` — Not authenticated
- `500` — Server error

**Frontend Integration:** Called from user settings/profile page when user edits personal information. Display success message after update; show field-level validation errors.

---

#### 5.2.2 DELETE /api/user/account — Soft Delete Account

| Attribute | Value |
|-----------|-------|
| **Method** | DELETE |
| **URL** | `/api/user/account` |
| **Controller** | `logicModels/User/User.controller.js` → `deleteAccount` |
| **Auth Required** | Yes |
| **Purpose** | Soft deletes user account (sets `deleted_at` and `deleted_by`), clears session cookie |

**Request Headers:**
- `Cookie: session_token=<JWT>`

**Request Body:** None

**Success Response (200):**
```json
{
  "status": "success",
  "message": "تم حذف الحساب بنجاح"
}
```

**Error Responses:**
- `401` — Not authenticated
- `500` — Server error

**Business Logic:** Sets `deleted_at = new Date()`, `deleted_by = req.user._id`. Clears `session_token` cookie. Data is preserved but hidden from lists.

**Frontend Integration:** Called from account deletion request. After success, redirect to home or login page.

---

#### 5.2.3 POST /api/user/upload-image — Upload Profile Image

| Attribute | Value |
|-----------|-------|
| **Method** | POST |
| **URL** | `/api/user/upload-image` |
| **Controller** | `logicModels/User/User.controller.js` → `uploadImage` |
| **Auth Required** | Yes |
| **Purpose** | Uploads profile image and updates `image_profile` field |

**Request Headers:**
- `Cookie: session_token=<JWT>`
- `Content-Type: multipart/form-data`

**Request Body:** `image` (file field)

**Constraints:**
- Max size: 5 MB (`config.upload.size_file`)
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
- Files stored in `public/uploads/`

**Success Response (200):**
```json
{
  "status": "success",
  "message": "تم رفع الصورة بنجاح",
  "data": {
    "image_profile": "/uploads/<filename>"
  }
}
```

**Error Responses:**
- `400` — No file uploaded (`{ status: 'error', message: 'يجب رفع صورة' }`)
- `401` — Not authenticated
- `500` — Server error

**Frontend Integration:** Profile settings page with image upload input. Display uploaded image URL after success.

---

#### 5.2.4 POST /api/user/2fa/enable — Enable Two-Factor Authentication

| Attribute | Value |
|-----------|-------|
| **Method** | POST |
| **URL** | `/api/user/2fa/enable` |
| **Controller** | `logicModels/User/User.controller.js` → `enable2fa` |
| **Auth Required** | Yes |
| **Purpose** | Generates TOTP secret, enables 2FA for user account |

**Request Headers:**
- `Cookie: session_token=<JWT>`

**Request Body:** None

**Success Response (200):**
```json
{
  "status": "success",
  "message": "تم تفعيل المصادقة الثنائية",
  "data": {
    "secret": "base32-encoded-secret",
    "otpauth_url": "otpauth://totp/Doctory%20(email)?secret=..."
  }
}
```

**Error Responses:**
- `400` — 2FA already enabled
- `401` — Not authenticated
- `500` — Server error

**Business Logic:** Uses `speakeasy.generateSecret()`. Sets `secure_key` and `enable_2fa = true` on user. Returns QR code setup URL.

**Frontend Integration:** Settings page. Display QR code from `otpauth_url` for user to scan with authenticator app. Store `secret` for verification.

---

#### 5.2.5 POST /api/user/2fa/disable — Disable Two-Factor Authentication

| Attribute | Value |
|-----------|-------|
| **Method** | POST |
| **URL** | `/api/user/2fa/disable` |
| **Controller** | `logicModels/User/User.controller.js` → `disable2fa` |
| **Auth Required** | Yes |
| **Purpose** | Disables 2FA, clears secure key |

**Restrictions:** Doctor and Admin roles **cannot** disable 2FA (returns 403).

**Success Response (200):**
```json
{
  "status": "success",
  "message": "تم إلغاء المصادقة الثنائية"
}
```

**Error Responses:**
- `403` — Doctor/Admin cannot disable 2FA
- `401` — Not authenticated
- `500` — Server error

---

#### 5.2.6 POST /api/user/change-role — Request Role Change

| Attribute | Value |
|-----------|-------|
| **Method** | POST |
| **URL** | `/api/user/change-role` |
| **Controller** | `logicModels/User/User.controller.js` → `changeRole` |
| **Auth Required** | Yes |
| **Purpose** | Request role change from patient to doctor |

**Status:** **NOT IMPLEMENTED** — Returns `501 Not Implemented`

```json
{
  "status": "error",
  "message": "لم يتم تنفيذ هذه الخاصية بعد"
}
```

**Business Logic (Planned):** Creates doctor registration request with pending verification status. Requires Egyptian Medical Syndicate ID upload. Admin reviews and approves/rejects.

---

### 5.3 User Pages (Render Routes — Implemented)

#### 5.3.1 GET /user/profile — Profile Page

| Attribute | Value |
|-----------|-------|
| **Method** | GET |
| **URL** | `/user/profile` |
| **Controller** | `logicModels/User/User.render.js` → `getProfileRender` |
| **Auth Required** | Yes |
| **View** | `patient/settings.ejs` |
| **Purpose** | Displays user account details (name, email, phone, address, birth date, role, status) |

**Response:** HTML (EJS render of `patient/settings` with `pageTitle: 'الملف الشخصي'` and user data)

---

#### 5.3.2 GET /user/settings — Settings Page

| Attribute | Value |
|-----------|-------|
| **Method** | GET |
| **URL** | `/user/settings` |
| **Controller** | `logicModels/User/User.render.js` → `getSettingsRender` |
| **Auth Required** | Yes |
| **View** | `patient/settings.ejs` |
| **Purpose** | Edit personal data, change password, enable/disable 2FA |

**Response:** HTML (EJS render of `patient/settings` with `pageTitle: 'الإعدادات'` and user data)

---

### 5.4 Error Pages (Implemented)

#### 5.4.1 404 Not Found

| Attribute | Value |
|-----------|-------|
| **Method** | Any (catch-all) |
| **URL** | Any unmatched path |
| **Route File** | `routes/errors/index.js` |
| **Handler** | Inline handler in route file |
| **Status Code** | 404 |
| **View** | `errors/404.ejs` |

**Response:** HTML with 404 status.

---

#### 5.4.2 500 Server Error

| Attribute | Value |
|-----------|-------|
| **Method** | Any (error handler) |
| **URL** | Any path where error occurs |
| **Route File** | `routes/errors/index.js` |
| **Handler** | Inline error handler (4 args: err, req, res, next) |
| **Status Code** | 500 |
| **View** | `errors/500.ejs` |

**Response:** HTML with 500 status and error message.

---

### 5.5 Declared but NOT Implemented APIs

The following endpoints are **documented in route index file comments** but have **zero Express route handlers** and **zero controller implementations**. They are NOT reachable.

#### 5.5.1 Authentication APIs (declared in `routes/auth/index.js` comments only)

| Method | Endpoint | Status |
|--------|----------|--------|
| POST | `/api/auth/register/patient` | DECLARED_ONLY |
| POST | `/api/auth/register/doctor` | DECLARED_ONLY |
| POST | `/api/auth/login` | DECLARED_ONLY |
| POST | `/api/auth/2fa/verify` | DECLARED_ONLY |
| POST | `/api/auth/refresh` | DECLARED_ONLY |
| GET | `/api/auth/me` | DECLARED_ONLY |
| POST | `/api/auth/logout` | DECLARED_ONLY |
| POST | `/api/auth/forgot-password` | DECLARED_ONLY |
| POST | `/api/auth/reset-password` | DECLARED_ONLY |
| POST | `/api/auth/change-password` | DECLARED_ONLY |
| POST | `/api/auth/verify-email` | DECLARED_ONLY |

**Reference Implementation:** `logicModels/module_name_ex/moduleName.controller.js` contains working implementations of register, login, forgotPassword, resetPassword, and logout. These are **not wired to any route**.

#### 5.5.2 Admin APIs (declared in `routes/admin/index.js` comments only)

| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/api/admin/stats` | DECLARED_ONLY |
| GET | `/api/admin/doctors` | DECLARED_ONLY |
| GET | `/api/admin/doctors/:id` | DECLARED_ONLY |
| GET | `/api/admin/doctors/:id/patients` | DECLARED_ONLY |
| GET | `/api/admin/doctors/pending` | DECLARED_ONLY |
| GET | `/api/admin/doctors/:id/verification` | DECLARED_ONLY |
| PATCH | `/api/admin/doctors/:id/approve` | DECLARED_ONLY |
| PATCH | `/api/admin/doctors/:id/reject` | DECLARED_ONLY |
| GET | `/api/admin/patients` | DECLARED_ONLY |
| GET | `/api/admin/patients/:id` | DECLARED_ONLY |
| GET | `/api/admin/users` | DECLARED_ONLY |
| POST | `/api/admin/users` | DECLARED_ONLY |
| PATCH | `/api/admin/users/:id` | DECLARED_ONLY |
| PATCH | `/api/admin/users/:id/role` | DECLARED_ONLY |
| PATCH | `/api/admin/users/:id/status` | DECLARED_ONLY |
| DELETE | `/api/admin/users/:id` | DECLARED_ONLY |
| PATCH | `/api/admin/users/:id/restore` | DECLARED_ONLY |
| POST | `/api/admin/users/:id/force-logout` | DECLARED_ONLY |
| POST | `/api/admin/users/:id/reset-password` | DECLARED_ONLY |
| POST | `/api/admin/users/:id/reset-2fa` | DECLARED_ONLY |
| GET | `/api/admin/bookings` | DECLARED_ONLY |
| GET | `/api/admin/bookings/:id` | DECLARED_ONLY |
| PATCH | `/api/admin/bookings/:id` | DECLARED_ONLY |
| DELETE | `/api/admin/bookings/:id` | DECLARED_ONLY |
| PATCH | `/api/admin/booking-items/:id` | DECLARED_ONLY |
| DELETE | `/api/admin/booking-items/:id` | DECLARED_ONLY |
| PATCH | `/api/admin/booking-items/:id/restore` | DECLARED_ONLY |
| GET | `/api/admin/waiting-list` | DECLARED_ONLY |
| GET | `/api/admin/services` | DECLARED_ONLY |
| PATCH | `/api/admin/services/:id/status` | DECLARED_ONLY |
| DELETE | `/api/admin/services/:id` | DECLARED_ONLY |
| GET | `/api/admin/deletion-requests` | DECLARED_ONLY |
| PATCH | `/api/admin/deletion-requests/:id` | DECLARED_ONLY |

#### 5.5.3 Other Unmounted Modules

All endpoints for Patient, Doctor, Booking, BookingItem, DoctorPortfolio, DoctorWork, Notification, Review, Report, and DeletionRequest modules are declared only in README.md documentation (Page-to-API Index section) but have **no route files, no controllers, and no implementations**.

---

## 6. Database Entities and Relationships

### 6.1 Entity Summary

| Collection | Model File | Purpose |
|------------|-----------|---------|
| `users` | `User.entity.js` | Core user accounts (admin, doctor, patient) |
| `doctor_portfolios` | `DoctorPortfolio.entity.js` | Doctor profiles and specialty info |
| `doctor_works` | `DoctorWork.entity.js` | Doctor services/sessions with price and duration |
| `bookings` | `Booking.entity.js` | Booking sessions (exams/consultations) |
| `booking_items` | `BookingItem.entity.js` | Individual patient slots within a booking |
| `reviews` | `Review.entity.js` | Patient reviews/ratings for doctors |
| `reports` | `Report.entity.js` | Medical reports generated by doctors |
| `notifications` | `Notification.entity.js` | In-app notifications |
| `deletion_requests` | `DeletionRequest.entity.js` | GDPR/Law 151/2020 data deletion requests |
| `refresh_tokens` | `RefreshToken.entity.js` | JWT refresh tokens with TTL |

### 6.2 Key Relationships

```
User (1) ──< DoctorPortfolio (1)  [user_id → User._id]
User (1) ──< BookingItem (many)   [user_id → User._id]
User (1) ──< Report (many)        [user_id → User._id]
User (1) ──< Review (many)        [user_id → User._id]
User (1) ──< Notification (many)  [user_id → User._id]
User (1) ──< DeletionRequest (1)  [user_id → User._id]
User (1) ──< RefreshToken (many)  [user_id → User._id]

DoctorPortfolio (1) ──< DoctorWork (many)     [portfolio_id → DoctorPortfolio._id]
DoctorPortfolio (1) ──< Booking (many)        [portfolio_id → DoctorPortfolio._id]
DoctorPortfolio (1) ──< Review (many)         [portfolio_id → DoctorPortfolio._id]
DoctorPortfolio (1) ──< Report (many)         [portfolio_id → DoctorPortfolio._id]

Booking (1) ──< BookingItem (many)            [booking_id → Booking._id]
BookingItem (1) ──< BookingItem (1, self)     [rescheduled_from → BookingItem._id]
```

### 6.3 Fields Returned to Frontend (Safe User Object)

**File:** `logicModels/User/User.controller.js` — `safeUser()` function

```js
{
  user_id: string,
  name: string,
  email: string,
  phone: string,
  address: string,
  birth_date: date,
  role: 'admin' | 'doctor' | 'patient',
  status: 'active' | 'pending' | 'suspended',
  image_profile: string,
  enable_2fa: boolean
}
```

**Fields NOT exposed to frontend:** `password_hash`, `token`, `secure_key`, `deleted_at`, `deleted_by`, `last_login`, `_id` (MongoDB internal), `__v`.

---

## 7. Important Business Workflows

### 7.1 User Registration (Planned — Not Implemented)

Flow: Patient/Doctor submits registration → User created with role → Doctor defaults to `status: 'pending'` → JWT issued in HTTP-Only cookie → Admin verifies doctor's Medical ID → Doctor status changes to `active`.

### 7.2 Authentication (Planned — Not Implemented)

Flow: Login with email/password → JWT issued → Stored in `session_token` cookie → Subsequent requests send cookie → `auth.js` middleware validates → `req.user` populated.

### 7.3 2FA Workflow (Implemented for User Module)

Flow: User enables 2FA → `speakeasy` generates secret → `secure_key` and `enable_2fa=true` stored → QR code URL returned → User scans with authenticator app → Login requires TOTP code → Doctor/Admin roles cannot disable 2FA.

### 7.4 Booking Workflow (Planned — Not Implemented)

Flow: Patient selects doctor/service/date → Booking created → BookingItems created for each patient → Doctor reviews pending bookings → Accept/reject → Patient notified → Queue number assigned → Visit completed → Review/Report generated.

### 7.5 Data Deletion (Law 151/2020) (Planned — Not Implemented)

Flow: User requests deletion → DeletionRequest created with `status: 'pending'` → Admin approves/rejects → If approved: hard delete or anonymize patient data (exception to soft delete pattern).

---

## 8. Frontend Integration Guidelines

### 8.1 Authentication

- All API calls requiring authentication must include the `session_token` cookie (or `Authorization: Bearer <token>` header).
- The `auth.js` middleware does NOT enforce `email_verified` or `enable_2fa` — individual controllers handle these checks.
- On 401 response, redirect user to `/auth/login`.

### 8.2 API Base Path

- Mounted API routes use prefix `/api/user` (but route file `User.apis.js` is empty).
- All other API paths (`/api/auth/*`, `/api/admin/*`, etc.) are declared in comments but **not mounted** — they will return 404 if called.

### 8.3 Response Format

Implemented endpoints use this format:
```json
{
  "status": "success" | "error",
  "message": "Arabic message",
  "data": { ... }  // optional
}
```

Error format:
```json
{
  "status": "error",
  "message": "Arabic error message",
  "errors": ["field-level errors"]  // for validation errors
}
```

### 8.4 File Uploads

- Multipart/form-data with `image` field.
- Stored at `/uploads/<filename>`.
- URL returned as `/uploads/<filename>` for frontend display.

### 8.5 EJS Render Routes

- Server-side rendered pages return HTML directly.
- Auth-required pages redirect to `/auth/login` if not authenticated.
- `checkLogin.js` utility provides `currentUser`, `isLoggedIn`, `status` to views.

### 8.6 Language

- All API messages are in Arabic.
- Frontend should handle Arabic (RTL) layouts.

### 8.7 Important Limitations

1. **Only 17 endpoints are actually implemented** (7 static pages + 6 user APIs + 2 user pages + 2 error handlers).
2. **All auth, admin, patient, doctor, booking APIs are declared-only** — calling them returns 404.
3. **`routes/User/User.apis.js` is empty** — the `/api/user/*` mount exists but has no route handlers. The controller functions exist in `logicModels/User/User.controller.js` but are not wired to routes.
4. **No API versioning** — all routes are at root level.
5. **No CORS configuration in route files** — CORS settings exist in `config/env-config.js` but are not applied via `cors()` middleware (not found in codebase).

---

## 9. API Implementation Status

### 9.1 Status Classification Summary

| Classification | Count | Description |
|---------------|-------|-------------|
| **IMPLEMENTED** | 17 | Route mounted + controller logic exists + reachable |
| **PARTIALLY_IMPLEMENTED** | 0 | N/A |
| **DECLARED_ONLY** | ~55+ | Documented in comments but no Express route or controller |
| **NOT_REGISTERED** | 0 | N/A (all declared endpoints are in unmounted files) |

### 9.2 Implemented Endpoints (17)

| # | Method | Endpoint | Auth | Module | Status | Purpose |
|---|--------|----------|------|--------|--------|---------|
| 1 | GET | `/` | No | Static | IMPLEMENTED | Home page |
| 2 | GET | `/about-us` | No | Static | IMPLEMENTED | About page |
| 3 | GET | `/contact-us` | No | Static | IMPLEMENTED | Contact page |
| 4 | GET | `/faq` | No | Static | IMPLEMENTED | FAQ page |
| 5 | GET | `/privacy` | No | Static | IMPLEMENTED | Privacy policy |
| 6 | GET | `/terms` | No | Static | IMPLEMENTED | Terms & conditions |
| 7 | GET | `/refund` | No | Static | IMPLEMENTED | Refund policy |
| 8 | PATCH | `/api/user/profile` | Yes | User | IMPLEMENTED | Update user profile |
| 9 | DELETE | `/api/user/account` | Yes | User | IMPLEMENTED | Soft delete account |
| 10 | POST | `/api/user/upload-image` | Yes | User | IMPLEMENTED | Upload profile image |
| 11 | POST | `/api/user/2fa/enable` | Yes | User | IMPLEMENTED | Enable 2FA |
| 12 | POST | `/api/user/2fa/disable` | Yes | User | IMPLEMENTED | Disable 2FA |
| 13 | POST | `/api/user/change-role` | Yes | User | IMPLEMENTED | Request role change (returns 501) |
| 14 | GET | `/user/profile` | Yes | User | IMPLEMENTED | Profile page (EJS) |
| 15 | GET | `/user/settings` | Yes | User | IMPLEMENTED | Settings page (EJS) |
| 16 | Any | `/*` (404) | No | Errors | IMPLEMENTED | 404 Not Found |
| 17 | Any | Error handler (500) | No | Errors | IMPLEMENTED | 500 Server Error |

### 9.3 Declared-Only Endpoints (~55+)

All endpoints documented in `routes/auth/index.js` (11 APIs), `routes/admin/index.js` (31 APIs), and README.md Page-to-API Index (patient, doctor, booking, etc.) are **declared-only** — no route handlers, no controllers, not mounted.

### 9.4 Missing Implementations

| Module | Missing Routes | Missing Controllers |
|--------|---------------|---------------------|
| Auth | All 11 API routes + 8 render routes | All controllers |
| Admin | All 31 API routes + 16 render routes | All controllers |
| Patient | All API + render routes | All controllers |
| Doctor | All API + render routes | All controllers |
| Booking | All API + render routes | All controllers |
| BookingItem | All API + render routes | All controllers |
| DoctorPortfolio | All API + render routes | All controllers |
| DoctorWork | All API + render routes | All controllers |
| Notification | All API + render routes | All controllers |
| Review | All API + render routes | All controllers |
| Report | All API + render routes | All controllers |
| DeletionRequest | All API + render routes | All controllers |

---

## 10. Missing or Incomplete APIs

### 10.1 Critical Missing APIs

These are required for basic application functionality and are completely unimplemented:

1. **Authentication:** Login, register, logout, refresh, forgot password, reset password, email verification, 2FA verify, GET /me
2. **Admin:** All admin management APIs (doctors, patients, users, bookings, services, deletion requests)
3. **Patient:** Dashboard, queue, booking, medical history, reports, reviews, notifications
4. **Doctor:** Dashboard, pending bookings, waiting list, clinical summary, diagnosis, prescription, verification status, portfolio
5. **Booking:** Create booking, update booking, booking items management

### 10.2 Partially Missing

- `/api/user/change-role` — Route and controller exist but return `501 Not Implemented`
- `routes/User/User.apis.js` — File is empty; API routes under `/api/user/*` are not wired despite controller implementations existing

### 10.3 Inconsistencies

1. `routes/User/index.js` mounts `User.apis.js` (empty file) — API endpoints under `/api/user/*` are unreachable even though controllers exist.
2. `routes/auth/index.js` and `routes/admin/index.js` contain extensive documentation comments but no `require()` or `router.use()` calls — they are not Express routers at all.
3. Reference auth implementation exists in `logicModels/module_name_ex/` but is not connected to any route.
4. `middleware/auth.js` does not enforce `email_verified` or `enable_2fa` — individual controllers must handle these.

---

## 11. Known Issues and Important Notes

### 11.1 Route Mounting

- Only 3 of 16 route modules are mounted in `routes/index.js`.
- Unmounted modules will return **404 Not Found** for all their endpoints.
- The `errors/index.js` catch-all handler is mounted last and will catch all unmatched routes.

### 11.2 Authentication

- JWT is stored in HTTP-Only cookie `session_token`.
- `Bearer` token support exists as fallback but is not documented in frontend integration guidelines.
- No token refresh endpoint is implemented.
- `middleware/auth.js` does not verify `email_verified` or `enable_2fa`.

### 11.3 Database

- Mongoose models are defined but indexes may generate duplicate warnings (declaring both `index: true` in schema and `schema.index()`).
- `booking_items.status` enum uses `accepted` (DB authoritative), while documentation sometimes says `confirmed`.
- `BookingItem.type` is required (`booking` or `consulting`).

### 11.4 AI Scheduling Prediction

- `services/aiService.js` is implemented — boundary for Python prediction service.
- `models/BookingItem.entity.js` includes AI prediction fields (`prediction`, `confirmation_required`, `deposit_required`, `reminder_state`, `actual_duration_minutes`, `no_show`, etc.).
- `models/PredictionLog.entity.js` exists for prediction logging.
- `config/env-config.js` includes `prediction` configuration block.
- `docker-compose.dev.yml` includes `ai` service container.
- Python service code exists under `ml/` (FastAPI app, schemas, model loader, training scripts) but is not wired to the Node backend yet.
- No routes or controllers use `aiService.js` yet.

### 11.5 Notifications Policy

- In-app notifications only (stored in `notifications` collection).
- Email via Nodemailer reserved for critical events only.
- **No SMS** — explicitly out of scope.
- `utils/mailer.js` exists but no `notificationService.js` is implemented.
- `services/notificationService.js` does not exist (empty placeholder planned).

### 11.6 File Upload

- `middleware/upload.js` rejects non-image MIME types despite config allowing PDFs (`application/pdf` is in allowed list but storage logic checks `file.mimetype.startsWith("image/")`).
- Upload destination: `public/uploads/`.

---

## 12. API Summary Table

| Module | Method | Endpoint | Authentication | Status | Purpose |
|--------|--------|----------|----------------|--------|---------|
| Static | GET | `/` | No | IMPLEMENTED | Home page |
| Static | GET | `/about-us` | No | IMPLEMENTED | About page |
| Static | GET | `/contact-us` | No | IMPLEMENTED | Contact page |
| Static | GET | `/faq` | No | IMPLEMENTED | FAQ page |
| Static | GET | `/privacy` | No | IMPLEMENTED | Privacy policy |
| Static | GET | `/terms` | No | IMPLEMENTED | Terms & conditions |
| Static | GET | `/refund` | No | IMPLEMENTED | Refund policy |
| User | PATCH | `/api/user/profile` | Yes | IMPLEMENTED | Update user profile |
| User | DELETE | `/api/user/account` | Yes | IMPLEMENTED | Soft delete account |
| User | POST | `/api/user/upload-image` | Yes | IMPLEMENTED | Upload profile image |
| User | POST | `/api/user/2fa/enable` | Yes | IMPLEMENTED | Enable 2FA |
| User | POST | `/api/user/2fa/disable` | Yes | IMPLEMENTED | Disable 2FA |
| User | POST | `/api/user/change-role` | Yes | IMPLEMENTED | Request role change (501) |
| User | GET | `/user/profile` | Yes | IMPLEMENTED | Profile page (EJS) |
| User | GET | `/user/settings` | Yes | IMPLEMENTED | Settings page (EJS) |
| Errors | Any | `/*` (404) | No | IMPLEMENTED | 404 Not Found |
| Errors | Any | Error handler (500) | No | IMPLEMENTED | 500 Server Error |
| Auth | POST | `/api/auth/register/patient` | No | DECLARED_ONLY | Patient registration |
| Auth | POST | `/api/auth/register/doctor` | No | DECLARED_ONLY | Doctor registration |
| Auth | POST | `/api/auth/login` | No | DECLARED_ONLY | User login |
| Auth | POST | `/api/auth/2fa/verify` | No | DECLARED_ONLY | 2FA verification |
| Auth | POST | `/api/auth/refresh` | No | DECLARED_ONLY | Token refresh |
| Auth | GET | `/api/auth/me` | Yes | DECLARED_ONLY | Get current user |
| Auth | POST | `/api/auth/logout` | Yes | DECLARED_ONLY | User logout |
| Auth | POST | `/api/auth/forgot-password` | No | DECLARED_ONLY | Password reset request |
| Auth | POST | `/api/auth/reset-password` | No | DECLARED_ONLY | Password reset |
| Auth | POST | `/api/auth/change-password` | Yes | DECLARED_ONLY | Change password |
| Auth | POST | `/api/auth/verify-email` | No | DECLARED_ONLY | Email verification |
| Admin | GET | `/api/admin/stats` | Yes | DECLARED_ONLY | Dashboard statistics |
| Admin | GET | `/api/admin/doctors` | Yes | DECLARED_ONLY | List doctors |
| Admin | GET | `/api/admin/doctors/:id` | Yes | DECLARED_ONLY | Doctor profile |
| Admin | PATCH | `/api/admin/doctors/:id/approve` | Yes | DECLARED_ONLY | Approve doctor |
| Admin | PATCH | `/api/admin/doctors/:id/reject` | Yes | DECLARED_ONLY | Reject doctor |
| Admin | GET | `/api/admin/patients` | Yes | DECLARED_ONLY | List patients |
| Admin | GET | `/api/admin/users` | Yes | DECLARED_ONLY | List users |
| Admin | GET | `/api/admin/bookings` | Yes | DECLARED_ONLY | List bookings |
| Admin | GET | `/api/admin/waiting-list` | Yes | DECLARED_ONLY | Waiting list |
| Admin | GET | `/api/admin/services` | Yes | DECLARED_ONLY | Doctor services |
| Admin | GET | `/api/admin/deletion-requests` | Yes | DECLARED_ONLY | Deletion requests |

**Total endpoints documented:** ~72  
**Implemented:** 17  
**Declared-Only:** ~55+  
**Not Registered:** 0  
**Documentation file location:** `/home/mossad/Desktop/backend/doctory/BACKEND_API_DOCUMENTATION.md`

---

## 13. Verification Notes

- Every registered route in `routes/index.js` has been documented (3 modules: static, User, errors).
- All unmounted route files have been identified and classified as DECLARED_ONLY.
- Request/response examples for implemented endpoints are based on actual controller code in `logicModels/User/User.controller.js`.
- No source code was modified during this audit.
- No secrets, API keys, or sensitive environment variables are exposed in this document.