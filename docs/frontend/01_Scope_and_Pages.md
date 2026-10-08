# Doctory — Admin Module Documentation

**Scope:** everything the Admin role does in the Doctory clinic system.  
**Sections:** 1) Pages, 2) Flows, 3) APIs, 4) Prompts.

---

## 0. Scope, Assumptions and DB Gaps

This doc is built on the real schema (7 tables, MySQL). Five things the leader asked for (soft delete, audit log, doctor verification, waiting time, force logout) have no table or column yet; the second table lists what to add.

### What the docs you sent tell us

- **Database:** use MySQL as in `databaseDoc.md`. The `database_schema.sql` file is PostgreSQL syntax mixed with MySQL `COMMENT` clauses, so treat it as stale.
- **No `doctors` table:** a doctor is a `users` row (`role = doctor`) plus a `doctor_portfolios` row. Endpoints use the external UUIDs (`users.user_id`, `doctor_portfolios.portfolio_id`), never the INT `id`.
- **Statuses follow the DB, not the README:**  
  - `bookings` = `pending` / `active` / `expired` / `cancelled`  
  - `booking_items` = `pending` / `accepted` / `rejected` / `completed`
- **Already defined in the Auth spec** (shared, not repeated here): login, 2FA verify, refresh, me, logout, forgot / reset / change password. **Admin 2FA is required.**
- **Hard delete is dangerous:** every foreign key is `ON DELETE CASCADE`, so deleting one `users` row also wipes its portfolio, bookings, items, reviews and reports. Admin "delete" must therefore be a **soft delete**.

### Assumptions (confirm with the leader)

- `"مامسحش / امسح"` = soft delete with restore. A real hard delete exists only for an approved legal data-deletion request.
- Admin pages follow the team's Render + API split: the render passes `checkLogin` state only, and data comes from the API through `fetch`.
- Admins log in from the shared `/auth/login` page; there is no separate admin login page. The first admin is seeded in the DB; later admins are created by an existing admin.
- **Exams (الفحوصات)** = `bookings.type = booking`  
  **Consultations (الاستشارات)** = `bookings.type = consulting`.

### Admin terms mapped to the DB

| Admin term                  | Where it lives                                      |
|-----------------------------|-----------------------------------------------------|
| Patient                     | `users.role = patient`                              |
| Doctor                      | `users.role = doctor` + `doctor_portfolios`         |
| Exam / Consultation session | `bookings` (`type`, `appointment_date`, `appointment_time`, `total_patients`) |
| Patient inside a session    | `booking_items` (`queue_number`, `status`, patient snapshot fields) |
| Doctor service              | `doctor_works` (`price`, `duration_session`, `status`) |
| Waiting list                | `booking_items` of one doctor on one date, ordered by `queue_number` |

### DB changes the admin module needs

| Need                        | Change                                                                 | Why |
|-----------------------------|------------------------------------------------------------------------|-----|
| Medical ID review           | New table `doctor_verifications`: `id`, `user_id`, `medical_id_image`, `status` (pending / approved / rejected), `rejection_reason`, `reviewed_by`, `reviewed_at`, `submitted_at` | No column stores the syndicate ID today; a table also keeps resubmission history |
| Soft delete + restore       | Add `deleted_at`, `deleted_by` to `users`, `bookings`, `booking_items`, `doctor_works` | Admin delete / restore, and the "removed" group in the Waiting List |
| Audit log                   | New table `audit_logs`: `id`, `actor_id`, `action`, `entity_type`, `entity_id`, `ip`, `metadata` (JSON), `created_at`; insert-only | README requires it; not in the schema |
| Data-deletion requests      | New table `deletion_requests`: `id`, `user_id`, `status`, `reason`, `reviewed_by`, `reviewed_at`, `created_at` | Law 151/2020; proposed |
| Waiting time                | `booking_items`: add `completed_at`; add `cancelled` to the status CHECK | Actual wait for completed patients, and a clear "cancelled" state |
| Force logout                | A refresh-token store (Redis or a `refresh_tokens` table)             | The Auth spec revokes refresh tokens but nothing stores them |
| Gender filter (optional)    | `users.gender`                                                         | Patients cannot be filtered by gender today |

**Still missing in the Auth spec:** the endpoint where a rejected doctor uploads a new Medical ID, and the endpoints that create the 2FA QR code and enable it. The admin needs the second one on first login.

---

## 1. Pages Documentation

**Template:** `PAGE / PATH / ROLE / PURPOSE / STATE / APIS / UI COMPONENTS / STATES / ACTIONS / REDIRECTS`.

On every admin page:
- **ROLE** is `admin`
- **STATE** is `{ currentUser, login, status }`
- A guest is sent to `/auth/login`
- Any other role gets **403**

Pages the admin shares with everyone (Login, 2FA Verification, Forgot / Reset Password, Settings with Change Password) are defined in the Auth spec and not repeated.

**Pages count: 16 admin pages**

| #  | Page                              | Path                              |
|----|-----------------------------------|-----------------------------------|
| 1  | Dashboard                         | `/admin/dashboard`                |
| 2  | Doctor Verification (pending list)| `/admin/doctors/verification`     |
| 3  | Doctor Verification Details       | `/admin/doctors/verification/:id` |
| 4  | Doctors                           | `/admin/doctors`                  |
| 5  | Doctor Profile                    | `/admin/doctors/:id`              |
| 6  | Patients                          | `/admin/patients`                 |
| 7  | Patient Profile                   | `/admin/patients/:id`             |
| 8  | Users & Admins                    | `/admin/users`                    |
| 9  | User Details                      | `/admin/users/:id`                |
| 10 | Bookings (Exams & Consultations)  | `/admin/bookings`                 |
| 11 | Booking Details                   | `/admin/bookings/:id`             |
| 12 | Waiting List                      | `/admin/waiting-list`             |
| 13 | Doctor Services                   | `/admin/services`                 |
| 14 | Audit Log                         | `/admin/audit-log`                |
| 15 | Deletion Requests (proposed)      | `/admin/deletion-requests`        |
| 16 | Errors 403 / 404 / 500            | -                                 |

> In paths, `:id` of users, doctors and services is the external UUID (`user_id`, `portfolio_id`, `work_id`). Bookings and booking items have no UUID column, so their paths use the INT `id`.

---

### 1.1 Dashboard

```
PAGE: Admin Dashboard
PATH: /admin/dashboard
ROLE: admin
PURPOSE: نظرة سريعة على حالة النظام (مرضى، دكاترة، حجوزات، طلبات معلقة)
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/stats?from&to
  - GET /api/admin/doctors/pending?limit=5
  - GET /api/admin/audit-logs?limit=10
UI COMPONENTS:
  - Stat cards (patients, doctors by status, bookings today, waiting patients today, pending verifications, pending deletion requests)
  - Bookings-per-day chart + date range
  - Bookings by type and status chart
  - Top specialties chart
  - Latest 5 pending doctors, latest 10 audit events
STATES:
  - loading: skeleton cards
  - empty: "لا توجد بيانات بعد"
  - error: "فشل في تحميل الإحصائيات"
  - success: cards + charts
ACTIONS: تغيير الفترة الزمنية، الضغط على أي كارت للذهاب لصفحته
REDIRECTS:
  - /admin/doctors/verification (pending card)
  - /admin/waiting-list (waiting card)
  - /admin/audit-log (view all)
```

---

### 1.2 Doctor Verification

```
PAGE: Doctor Verification
PATH: /admin/doctors/verification
ROLE: admin
PURPOSE: عرض الدكاترة اللي مستنيين مراجعة الـ Medical ID
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/doctors/pending?page&limit&q
UI COMPONENTS: table (name, email, specialty, submitted at, attempt number), search, pagination
STATES:
  - loading: skeleton rows
  - empty: "لا توجد طلبات تحقق"
  - error: "فشل في تحميل الطلبات"
ACTIONS: بحث، فتح طلب
REDIRECTS: /admin/doctors/verification/:id
```

---

### 1.3 Doctor Verification Details

```
PAGE: Doctor Verification Details
PATH: /admin/doctors/verification/:id
ROLE: admin
PURPOSE: مراجعة بيانات الدكتور وصورة الـ Medical ID ثم القبول أو الرفض
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/doctors/:id/verification
  - PATCH /api/admin/doctors/:id/approve
  - PATCH /api/admin/doctors/:id/reject  body { reason }
UI COMPONENTS: doctor info, zoomable Medical ID image, previous attempts, Approve button (confirm dialog), Reject button (reason textarea, min 10 chars)
STATES:
  - loading: skeleton
  - error: "فشل في تحميل الطلب" / 409 "تم البت في الطلب بالفعل"
  - success: status badge, buttons disabled
ACTIONS: Approve، Reject
REDIRECTS: /admin/doctors/verification (بعد القرار)
```

---

### 1.4 Doctors

```
PAGE: Doctors
PATH: /admin/doctors
ROLE: admin
PURPOSE: قائمة كل الدكاترة مع بحث وفلتر
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/doctors?q&specialty&status&include_deleted&page&limit
UI COMPONENTS: filters (specialty, status, include deleted), search, table (doctor id, name, specialty, email, status, sessions, patients)
STATES:
  - empty: "لا يوجد دكاترة مطابقين"
  - error: "فشل في تحميل الدكاترة"
ACTIONS: فتح بروفايل، تفعيل / إيقاف، حذف (soft)، استرجاع
REDIRECTS: /admin/doctors/:id
```

---

### 1.5 Doctor Profile

```
PAGE: Doctor Profile
PATH: /admin/doctors/:id
ROLE: admin
PURPOSE: صفحة لكل دكتور: بياناته ومرضاه وجلساته وخدماته
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/doctors/:id
  - GET /api/admin/doctors/:id/patients?q&status&date_from&date_to&page&limit
  - GET /api/admin/bookings?doctor_id=:id
  - GET /api/admin/services?doctor_id=:id
UI COMPONENTS: header (name, specialty, title, doctor id, status), tabs: Patients / Sessions / Services, button "Waiting List"
STATES:
  - loading: skeleton
  - empty: "لا يوجد مرضى لهذا الدكتور"
  - error: "فشل في تحميل بيانات الدكتور"
ACTIONS: تعديل، إيقاف، حذف (soft)، فتح قائمة الانتظار
REDIRECTS:
  - /admin/waiting-list?doctor_id=:id&date=today
  - /admin/patients/:id
```

---

### 1.6 Patients

```
PAGE: Patients
PATH: /admin/patients
ROLE: admin
PURPOSE: البحث عن المرضى وفلترتهم بفئة معينة
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/patients?q&age_group&age_min&age_max&status&address&doctor_id&specialty&booking_status&has_report&created_from&created_to&include_deleted&sort&page&limit
UI COMPONENTS:
  - Search box (name, phone, email)
  - Filter panel: age group (child < 18, adult 18-59, senior 60+) or custom age range, status, doctor, specialty, booking status, address, registration date, has report, include deleted
  - Active filter chips + Reset
  - Table (name, phone, age, address, status, bookings count, last booking)
STATES:
  - empty: "لا يوجد مرضى مطابقين للفلتر"
  - error: "فشل في تحميل المرضى"
ACTIONS: بحث، فلترة، ترتيب، فتح بروفايل، إضافة مريض، حذف (soft)، استرجاع
REDIRECTS: /admin/patients/:id
```

---

### 1.7 Patient Profile

```
PAGE: Patient Profile
PATH: /admin/patients/:id
ROLE: admin
PURPOSE: بيانات مريض وتاريخ حجوزاته مع الدكاترة
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/patients/:id
  - PATCH /api/admin/users/:id
  - DELETE /api/admin/users/:id
UI COMPONENTS: info card (age from birth_date), bookings history (doctor, date, type, queue number, status), reports count only (medical content is not shown to admin)
STATES:
  - empty: "لا توجد حجوزات"
  - error: "فشل في تحميل المريض"
ACTIONS: تعديل، إيقاف، حذف (soft)، استرجاع
REDIRECTS: /admin/doctors/:id (من صف الحجز)
```

---

### 1.8 Users & Admins

```
PAGE: Users & Admins
PATH: /admin/users
ROLE: admin
PURPOSE: إضافة وتعديل وحذف اليوزرز وتعيين أدمن جديد
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/users?role&status&q&include_deleted&page&limit
  - POST /api/admin/users
  - PATCH /api/admin/users/:id/role
  - PATCH /api/admin/users/:id/status
  - DELETE /api/admin/users/:id
  - PATCH /api/admin/users/:id/restore
UI COMPONENTS: role tabs (All / Admins / Doctors / Patients), table (name, email, role, status, 2FA, last login), "Add user" drawer (role, name, email, phone (the user gets a set-password email)), row actions menu
STATES:
  - empty: "لا يوجد مستخدمين"
  - error: "فشل في تحميل المستخدمين"
ACTIONS: إضافة، تعديل، تغيير الدور، تفعيل / إيقاف، حذف (soft)، استرجاع
RULES: الأدمن مش بيغير دوره ولا يوقف نفسه ولا يحذفها، وآخر أدمن فعّال لا يتحذف ولا يتوقف
REDIRECTS: /admin/users/:id
```

---

### 1.9 User Details (login control)

```
PAGE: User Details
PATH: /admin/users/:id
ROLE: admin
PURPOSE: التحكم في تسجيل دخول يوزر وبياناته
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/users/:id
  - PATCH /api/admin/users/:id
  - PATCH /api/admin/users/:id/status
  - POST /api/admin/users/:id/force-logout
  - POST /api/admin/users/:id/reset-password
  - POST /api/admin/users/:id/reset-2fa
UI COMPONENTS: account card (role, status, email verified, 2FA enabled, last login), Login control panel (suspend / activate, force logout, send reset-password email, reset 2FA), edit form, danger zone (soft delete)
STATES:
  - loading: skeleton
  - error: "فشل في تحميل المستخدم"
ACTIONS: كل أزرار التحكم بتطلب confirm وبتتسجل في Audit Log
REDIRECTS: /admin/users (بعد الحذف)
```

---

### 1.10 Bookings (Exams & Consultations)

```
PAGE: Bookings
PATH: /admin/bookings
ROLE: admin
PURPOSE: عرض الفحوصات والاستشارات والتعديل عليها
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/bookings?type&status&doctor_id&date_from&date_to&include_deleted&page&limit
  - PATCH /api/admin/bookings/:id
  - DELETE /api/admin/bookings/:id
  - PATCH /api/admin/bookings/:id/restore
UI COMPONENTS: tabs (Exams / Consultations / All), filters (doctor, status, date range), table (id, doctor, type, date, time, booked / total, status)
STATES:
  - empty: "لا توجد حجوزات"
  - error: "فشل في تحميل الحجوزات"
ACTIONS: فتح، تعديل الحالة أو السعة أو الميعاد، إلغاء، حذف (soft)، استرجاع
REDIRECTS: /admin/bookings/:id, /admin/waiting-list?doctor_id&date
```

---

### 1.11 Booking Details

```
PAGE: Booking Details
PATH: /admin/bookings/:id
ROLE: admin
PURPOSE: تفاصيل جلسة واحدة وكل المرضى المحجوزين فيها
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/bookings/:id
  - PATCH /api/admin/bookings/:id
  - PATCH /api/admin/booking-items/:id
  - DELETE /api/admin/booking-items/:id
  - PATCH /api/admin/booking-items/:id/restore
UI COMPONENTS: session header (doctor, type, date, time, capacity), items table (queue number, patient, phone, age, status), edit dialogs
STATES:
  - empty: "لا يوجد مرضى في هذه الجلسة"
  - error: "فشل في تحميل الجلسة"
ACTIONS: تعديل حالة مريض أو رقمه في الدور، إلغاء (soft)، حذف واسترجاع، إلغاء الجلسة كلها
REDIRECTS: /admin/patients/:id, /admin/doctors/:id
```

---

### 1.12 Waiting List

```
PAGE: Waiting List
PATH: /admin/waiting-list?doctor_id=&date=
ROLE: admin
PURPOSE: قائمة الانتظار لدكتور في يوم معين: مين مستني ومين خلص ومين اتشال
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/waiting-list?doctor_id&date&type
  - PATCH /api/admin/booking-items/:id
  - DELETE /api/admin/booking-items/:id
UI COMPONENTS:
  - Doctor picker (searchable, shows doctor id) + date picker (default today) + type toggle (All / Exams / Consultations)
  - Counters: waiting / completed / removed
  - Group Waiting: queue number, patient, waiting minutes, estimated wait
  - Group Completed: queue number, patient, completed at
  - Group Removed: rejected, cancelled or soft-deleted, with who and when
STATES:
  - empty: "لا توجد حجوزات لهذا الدكتور في هذا اليوم"
  - error: "فشل في تحميل قائمة الانتظار"
ACTIONS: تغيير الدكتور أو اليوم، تعديل حالة مريض، حذف (soft) واسترجاع، تحديث تلقائي كل 30 ثانية
REDIRECTS: /admin/doctors/:id, /admin/patients/:id
```

---

### 1.13 Doctor Services

```
PAGE: Doctor Services
PATH: /admin/services
ROLE: admin
PURPOSE: مراجعة خدمات الدكاترة (doctor_works) والموافقة عليها أو رفضها
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/services?status&doctor_id&q&page&limit
  - PATCH /api/admin/services/:id
  - PATCH /api/admin/services/:id/status
  - DELETE /api/admin/services/:id
UI COMPONENTS: status tabs (pending / active / rejected), table (title, doctor, price, duration, status), edit drawer
STATES:
  - empty: "لا توجد خدمات"
  - error: "فشل في تحميل الخدمات"
ACTIONS: موافقة، رفض (سبب)، تعديل، حذف (soft)
REDIRECTS: /admin/doctors/:id
```

---

### 1.14 Audit Log

```
PAGE: Audit Log
PATH: /admin/audit-log
ROLE: admin
PURPOSE: سجل كل العمليات الحساسة (قراءة فقط)
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/audit-logs?action&actor_id&actor_role&entity_type&from&to&page&limit
  - GET /api/admin/audit-logs/:id
UI COMPONENTS: filters, table (time, actor, action, entity, ip), expandable metadata JSON
STATES:
  - empty: "لا توجد عمليات"
  - error: "فشل في تحميل السجل"
ACTIONS: فلترة، فتح التفاصيل (لا تعديل ولا حذف)
REDIRECTS: -
```

---

### 1.15 Deletion Requests (proposed)

```
PAGE: Deletion Requests
PATH: /admin/deletion-requests
ROLE: admin
PURPOSE: مراجعة طلبات حذف بيانات المرضى حسب قانون 151 لسنة 2020
STATE: { currentUser, login, status }
APIS:
  - GET /api/admin/deletion-requests?status&page&limit
  - PATCH /api/admin/deletion-requests/:id  body { decision, reason }
UI COMPONENTS: table (patient name masked, requested at, status), approve / reject dialog (reason)
STATES:
  - empty: "لا توجد طلبات حذف"
  - error: "فشل في تحميل الطلبات"
ACTIONS: موافقة (حذف نهائي أو إخفاء هوية)، رفض مع سبب
REDIRECTS: -
```

---

### 1.16 Error pages

```
PAGE: 403 / 404 / 500
ROLE: *
PURPOSE: لو الصفحة مش موجودة → 404، لو الدور مش admin → 403، لو خطأ في السيرفر → 500
UI COMPONENTS: رسالة واضحة + زر الرجوع للـ Dashboard
```
