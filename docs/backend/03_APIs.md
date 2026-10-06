# Doctory — Admin Module Documentation  
## 3. API Documentation

Same template as `README_APIs.md`, plus one extra line `path`, because the template has none and an endpoint is unusable without it.

### General rules

- **Access:** every `/api/admin/*` endpoint needs the JWT cookie and role `admin` (401 not authenticated, 403 wrong role). Every write also creates an Audit Log entry.
- **Ids:** `:id` of users, doctors and services is the external UUID (`user_id`, `portfolio_id`, `work_id`). `bookings` and `booking_items` have no UUID column, so their paths use the INT `id`.
- **Lists:** accept `page`, `limit`, `sort`, `order` and return `data: { items, page, limit, total }`. Soft-deleted rows are hidden unless `include_deleted=true`.
- **Case:** Express routing is case-insensitive by default, so `/api/admin/Doctors/pending` in the Auth spec and `/api/admin/doctors/pending` here are the same route. Declare `/doctors/pending` before `/doctors/:id`.
- **Already in the Auth spec (not repeated):** register patient / doctor, login, 2FA verify, refresh, me, logout, forgot / reset / change password. Items marked **(from Auth spec)** are admin endpoints it already defines; **(proposed)** means new.

---

### Admin – Dashboard

```
type: API
http method: GET
path: /api/admin/stats
name: getAdminStats
role: admin
description by arabic: بيرجع إحصائيات الـ Dashboard: عدد المرضى، الدكاترة حسب الحالة، حجوزات اليوم، المرضى المنتظرين اليوم، الحجوزات حسب النوع (فحص / استشارة) والحالة، أكتر التخصصات حجزًا، وعدد طلبات التحقق والحذف المعلقة. Query: from, to (اختياري).
```

---

### Admin – Doctor Verification

```
type: API
http method: GET
path: /api/admin/doctors/pending
name: getPendingDoctors
role: admin
description by arabic: (from Auth spec) قائمة الدكاترة اللي حالتهم pending ومستنيين مراجعة الـ Medical ID. Query: page, limit, q.
```

```
type: API
http method: GET
path: /api/admin/doctors/:id/verification
name: getDoctorVerification
role: admin
description by arabic: (proposed) تفاصيل طلب التحقق: بيانات الدكتور، رابط محمي (مش public) لصورة الـ Medical ID، وتاريخ المحاولات السابقة. 404 لو الدكتور مش موجود.
```

```
type: API
http method: PATCH
path: /api/admin/doctors/:id/approve
name: approveDoctor
role: admin
description by arabic: (from Auth spec) الموافقة على دكتور: الـ verification تبقى approved و users.status تبقى active، يتبعتله إيميل، وتتسجل في الـ Audit Log. 409 لو الدكتور مش pending.
```

```
type: API
http method: PATCH
path: /api/admin/doctors/:id/reject
name: rejectDoctor
role: admin
description by arabic: (from Auth spec) رفض دكتور. Body: { reason } (إجباري، 10 حروف على الأقل). الـ verification تبقى rejected والحساب يفضل موجود، والدكتور يقدر يرفع Medical ID جديد. 409 لو مش pending.
```

---

### Admin – Doctors

```
type: API
http method: GET
path: /api/admin/doctors
name: listDoctors
role: admin
description by arabic: قائمة كل الدكاترة (من view doctor_details): portfolio_id، الاسم، التخصص، الإيميل، الحالة، عدد الجلسات وعدد المرضى. Query: q, specialty, status, include_deleted, page, limit, sort.
```

```
type: API
http method: GET
path: /api/admin/doctors/:id
name: getDoctorProfile
role: admin
description by arabic: صفحة الدكتور: بيانات users و doctor_portfolios، ساعات العمل، وإحصائيات (عدد الجلسات، عدد المرضى، متوسط التقييم). :id = portfolio_id.
```

```
type: API
http method: GET
path: /api/admin/doctors/:id/patients
name: getDoctorPatients
role: admin
description by arabic: مرضى دكتور معين (من booking_items): الاسم، التليفون، السن، عدد الزيارات، آخر زيارة، وحالة آخر حجز. Query: q, status, type, date_from, date_to, page, limit.
```

---

### Admin – Patients

```
type: API
http method: GET
path: /api/admin/patients
name: listPatients
role: admin
description by arabic: قائمة المرضى مع بحث وفلتر بفئة معينة (الفلاتر بتتجمع بـ AND). السن بيتحسب من birth_date، وفلتر gender مش متاح لأن مفيش عمود.
Query:
  - q: اسم أو تليفون أو إيميل
  - age_group: child (أقل من 18) | adult (18 إلى 59) | senior (60+)، أو age_min و age_max
  - status: active | pending | suspended
  - address: بحث نصي في العنوان
  - doctor_id و specialty: المرضى اللي حجزوا عند دكتور أو تخصص
  - booking_status: pending | accepted | rejected | completed
  - has_report: true | false
  - created_from, created_to: تاريخ التسجيل
  - include_deleted, sort, order, page, limit
```

```
type: API
http method: GET
path: /api/admin/patients/:id
name: getPatientProfile
role: admin
description by arabic: بيانات مريض وتاريخ حجوزاته مع كل دكتور (النوع، التاريخ، رقم الدور، الحالة) وعدد التقارير فقط. محتوى التقارير الطبية مش بيظهر للأدمن (افتراض).
```

---

### Admin – Users & Admins

```
type: API
http method: GET
path: /api/admin/users
name: listUsers
role: admin
description by arabic: قائمة كل اليوزرز (أدمن / دكتور / مريض). Query: role, status, q, include_deleted, page, limit, sort.
```

```
type: API
http method: GET
path: /api/admin/users/:id
name: getUser
role: admin
description by arabic: بيانات يوزر وحالة الدخول: last_login، enable_2fa، email_verified، status. مفيش password_hash ولا secure_key في الـ Response.
```

```
type: API
http method: POST
path: /api/admin/users
name: createUser
role: admin
description by arabic: إضافة يوزر. Body: { role, name, email, phone } (ولو role = doctor يضاف doctor_name, specialty, title). الأدمن مش بيحدد باسورد: بيتبعت لينك لتعيين الباسورد للإيميل. الدكتور اللي الأدمن بيضيفه بيتفعل مباشرة (افتراض). 409 لو الإيميل مكرر.
```

```
type: API
http method: PATCH
path: /api/admin/users/:id
name: updateUser
role: admin
description by arabic: تعديل بيانات يوزر: name, email, phone, address, birth_date. تغيير الدور والحالة ليهم endpoints منفصلة.
```

```
type: API
http method: PATCH
path: /api/admin/users/:id/role
name: changeUserRole
role: admin
description by arabic: تغيير دور يوزر. Body: { role } (admin أو patient فقط، الدكتور بيتعمل بالتسجيل والتحقق). الأدمن مش بيغير دوره نفسه (403)، ومش بيشيل أدمن آخر فعّال (409). بيلغي الـ Refresh Tokens فوراً عشان الدور الجديد يشتغل.
```

```
type: API
http method: PATCH
path: /api/admin/users/:id/status
name: changeUserStatus
role: admin
description by arabic: إيقاف أو تفعيل حساب. Body: { status: "active" | "suspended", reason }. الإيقاف بيلغي كل الجلسات وأي Login بعده = 403. نفس حماية النفس وآخر أدمن.
```

```
type: API
http method: DELETE
path: /api/admin/users/:id
name: softDeleteUser
role: admin
description by arabic: حذف يوزر (Soft Delete): بيملي deleted_at و deleted_by ويلغي الجلسات، والبيانات المرتبطة (حجوزات، تقييمات، تقارير) تفضل زي ما هي. نفس حماية النفس وآخر أدمن.
```

```
type: API
http method: PATCH
path: /api/admin/users/:id/restore
name: restoreUser
role: admin
description by arabic: استرجاع يوزر محذوف (Soft). الحالة بترجع suspended لحد ما الأدمن يفعّله.
```

```
type: API
http method: POST
path: /api/admin/users/:id/force-logout
name: forceLogoutUser
role: admin
description by arabic: إلغاء كل الـ Refresh Tokens لليوزر. الـ Access Token الحالي بيفضل شغال لحد ما ينتهي.
```

```
type: API
http method: POST
path: /api/admin/users/:id/reset-password
name: sendPasswordReset
role: admin
description by arabic: بيبعت إيميل بلينك Reset Password لليوزر (نفس Flow الـ Auth). الأدمن مش بيشوف ولا بيحدد الباسورد. 429 لو اتكرر كتير.
```

```
type: API
http method: POST
path: /api/admin/users/:id/reset-2fa
name: resetUser2fa
role: admin
description by arabic: مسح secure_key وقفل enable_2fa (لو اليوزر فقد الموبايل). الدكتور والأدمن لازم يفعّلوه تاني في أول دخول لأنه إجباري ليهم.
```

---

### Admin – Bookings (Exams & Consultations)

```
type: API
http method: GET
path: /api/admin/bookings
name: listBookings
role: admin
description by arabic: قائمة الجلسات: الفحوصات (type=booking) والاستشارات (type=consulting). كل صف فيه الدكتور، النوع، التاريخ، الميعاد، عدد المحجوزين من total_patients، والحالة. Query: type, status (pending | active | expired | cancelled), doctor_id, date_from, date_to, include_deleted, page, limit, sort.
```

```
type: API
http method: GET
path: /api/admin/bookings/:id
name: getBooking
role: admin
description by arabic: تفاصيل جلسة واحدة وكل booking_items فيها بترتيب queue_number (الاسم، التليفون، السن، الحالة). :id = INT id.
```

```
type: API
http method: PATCH
path: /api/admin/bookings/:id
name: updateBooking
role: admin
description by arabic: تعديل جلسة. Body (أي حقل): status, total_patients, appointment_date, appointment_time. total_patients مينفعش يبقى أقل من عدد المقبولين (409). لو status = cancelled: كل items الـ pending والـ accepted تبقى cancelled ويوصل إشعار للمرضى. تغيير التاريخ أو الميعاد بيبعت إشعار للمرضى.
```

```
type: API
http method: DELETE
path: /api/admin/bookings/:id
name: softDeleteBooking
role: admin
description by arabic: حذف جلسة (Soft Delete). لو فيها مرضى accepted: لازم تتلغي الجلسة الأول (409).
```

```
type: API
http method: PATCH
path: /api/admin/bookings/:id/restore
name: restoreBooking
role: admin
description by arabic: استرجاع جلسة محذوفة (Soft).
```

```
type: API
http method: PATCH
path: /api/admin/booking-items/:id
name: updateBookingItem
role: admin
description by arabic: تعديل مريض داخل جلسة. Body: { status, queue_number } (status: pending | accepted | rejected | completed | cancelled). queue_number لازم يفضل فريد جوه الجلسة (الـ Backend بيتحقق لأن الـ DB مش بتمنع التكرار). لما status = completed بيتسجل completed_at.
```

```
type: API
http method: DELETE
path: /api/admin/booking-items/:id
name: softDeleteBookingItem
role: admin
description by arabic: شيل مريض من جلسة (Soft Delete). بيظهر في مجموعة Removed في قائمة الانتظار.
```

```
type: API
http method: PATCH
path: /api/admin/booking-items/:id/restore
name: restoreBookingItem
role: admin
description by arabic: استرجاع مريض اتشال من جلسة. 409 لو الجلسة اتلغت أو اتمليت.
```

---

### Admin – Waiting List

```
type: API
http method: GET
path: /api/admin/waiting-list
name: getWaitingList
role: admin
description by arabic: قائمة الانتظار لدكتور في يوم معين. Query: doctor_id (إجباري، portfolio_id)، date (إجباري، YYYY-MM-DD)، type (اختياري). بيجمع booking_items لكل جلسات الدكتور في اليوم بترتيب queue_number ويقسمها: waiting (pending / accepted)، completed، removed (rejected / cancelled / deleted_at مش فاضي). لكل منتظر waiting_minutes و estimated_wait_minutes (تعريفهم في قسم الـ Flow). 400 لو doctor_id أو date ناقص، 404 لو الدكتور مش موجود.

Response example (shortened):
{
  "doctor": { "id": "portfolio-uuid", "name": "Dr. Ahmed", "specialty": "Orthopedic" },
  "date": "2026-10-15",
  "summary": { "waiting": 12, "completed": 20, "removed": 3 },
  "waiting": [{ "itemId": 55, "bookingId": 7, "type": "booking", "queueNumber": 4, "patientName": "Mohamed", "patientPhone": "01009876543", "status": "accepted", "appointmentTime": "20:30", "waitingMinutes": 25, "estimatedWaitMinutes": 45 }],
  "completed": [{ "itemId": 51, "queueNumber": 1, "patientName": "Sara", "completedAt": "2026-10-15T20:50:00Z" }],
  "removed": [{ "itemId": 60, "queueNumber": 9, "patientName": "Omar", "status": "rejected", "deletedAt": null }]
}
```

---

### Admin – Doctor Services

```
type: API
http method: GET
path: /api/admin/services
name: listServices
role: admin
description by arabic: خدمات الدكاترة (doctor_works): العنوان، الدكتور، السعر، المدة، الحالة. Query: status (pending | active | rejected), doctor_id, q, include_deleted, page, limit.
```

```
type: API
http method: PATCH
path: /api/admin/services/:id
name: updateService
role: admin
description by arabic: تعديل خدمة: title, price, description, duration_session, working_time, image. :id = work_id.
```

```
type: API
http method: PATCH
path: /api/admin/services/:id/status
name: changeServiceStatus
role: admin
description by arabic: الموافقة على خدمة أو رفضها. Body: { status: "active" | "rejected", reason } (السبب إجباري عند الرفض).
```

```
type: API
http method: DELETE
path: /api/admin/services/:id
name: softDeleteService
role: admin
description by arabic: حذف خدمة (Soft Delete).
```

---

### Admin – Audit Log

```
type: API
http method: GET
path: /api/admin/audit-logs
name: listAuditLogs
role: admin
description by arabic: قراءة سجل العمليات (قراءة فقط، مفيش تعديل ولا حذف). Query: action, actor_id, actor_role, entity_type, entity_id, from, to, page, limit.
```

```
type: API
http method: GET
path: /api/admin/audit-logs/:id
name: getAuditLog
role: admin
description by arabic: تفاصيل عملية واحدة بما فيها الـ metadata الكاملة (القيمة القديمة والجديدة، سبب الرفض).

Log item example:
{
  "id": 101,
  "actorId": "user-uuid",
  "actorRole": "doctor",
  "action": "BOOKING_ACCEPTED",
  "entityType": "booking_item",
  "entityId": "55",
  "ip": "41.x.x.x",
  "metadata": { "from": "pending", "to": "accepted" },
  "createdAt": "2026-10-06T10:30:00Z"
}

Suggested actions: LOGIN, LOGIN_FAILED, USER_CREATED, USER_UPDATED, USER_ROLE_CHANGED, USER_SUSPENDED, USER_ACTIVATED, USER_DELETED, USER_RESTORED, FORCE_LOGOUT, PASSWORD_RESET_SENT, TWO_FA_RESET, DOCTOR_APPROVED, DOCTOR_REJECTED, BOOKING_ACCEPTED, BOOKING_REJECTED, BOOKING_UPDATED, BOOKING_CANCELLED, BOOKING_DELETED, BOOKING_ITEM_UPDATED, BOOKING_ITEM_DELETED, SERVICE_APPROVED, SERVICE_REJECTED, DELETION_APPROVED, DELETION_REJECTED.
```

---

### Admin – Deletion Requests (proposed)

```
type: API
http method: GET
path: /api/admin/deletion-requests
name: listDeletionRequests
role: admin
description by arabic: (proposed) طلبات حذف بيانات المرضى. الاسم بيظهر مقنّع. Query: status, page, limit.
```

```
type: API
http method: PATCH
path: /api/admin/deletion-requests/:id
name: decideDeletionRequest
role: admin
description by arabic: (proposed) الموافقة أو الرفض. Body: { decision: "approved" | "rejected", reason }. الموافقة بتنفذ حذف نهائي أو إخفاء هوية للمريض (الاستثناء الوحيد من الـ Soft Delete) وبتبعت إشعار. 409 لو الطلب اتبت فيه قبل كده.
```

---

### Admin – Pages (RENDER)

Each render only passes the user state (`checkLogin`) to the page; data comes from the APIs above through `fetch`.

```
type: RENDER
page: /admin/dashboard
name: admin_dashboard_render
role: admin
description: صفحة الـ Dashboard: كروت إحصائيات ورسومات وآخر الطلبات والعمليات.
```

```
type: RENDER
page: /admin/doctors/verification
name: admin_doctor_verification_render
role: admin
description: قائمة الدكاترة المستنيين التحقق مع بحث.
```

```
type: RENDER
page: /admin/doctors/verification/:id
name: admin_doctor_verification_details_render
role: admin
description: مراجعة الـ Medical ID وأزرار الموافقة والرفض.
```

```
type: RENDER
page: /admin/doctors
name: admin_doctors_render
role: admin
description: جدول كل الدكاترة بفلتر التخصص والحالة.
```

```
type: RENDER
page: /admin/doctors/:id
name: admin_doctor_profile_render
role: admin
description: صفحة الدكتور: بياناته ومرضاه وجلساته وخدماته.
```

```
type: RENDER
page: /admin/patients
name: admin_patients_render
role: admin
description: جدول المرضى مع البحث وفلتر الفئات.
```

```
type: RENDER
page: /admin/patients/:id
name: admin_patient_profile_render
role: admin
description: بيانات المريض وتاريخ حجوزاته.
```

```
type: RENDER
page: /admin/users
name: admin_users_render
role: admin
description: إدارة اليوزرز والأدمنز: إضافة وتعديل وتغيير دور وإيقاف وحذف.
```

```
type: RENDER
page: /admin/users/:id
name: admin_user_details_render
role: admin
description: تفاصيل يوزر وأزرار التحكم في تسجيل الدخول.
```

```
type: RENDER
page: /admin/bookings
name: admin_bookings_render
role: admin
description: جدول الفحوصات والاستشارات مع فالتر.
```

```
type: RENDER
page: /admin/bookings/:id
name: admin_booking_details_render
role: admin
description: تفاصيل جلسة ومرضاها مع التعديل.
```

```
type: RENDER
page: /admin/waiting-list
name: admin_waiting_list_render
role: admin
description: قائمة الانتظار لدكتور في يوم معين.
```

```
type: RENDER
page: /admin/services
name: admin_services_render
role: admin
description: مراجعة خدمات الدكاترة والموافقة عليها.
```

```
type: RENDER
page: /admin/audit-log
name: admin_audit_log_render
role: admin
description: سجل العمليات للقراءة فقط.
```

```
type: RENDER
page: /admin/deletion-requests
name: admin_deletion_requests_render
role: admin
description: (proposed) مراجعة طلبات حذف بيانات المرضى.
```
