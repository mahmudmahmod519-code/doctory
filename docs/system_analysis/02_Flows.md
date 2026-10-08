# Doctory — Admin Module Documentation  
## 2. Flow Documentation

Same template as the team's flow doc: the admin journey, one flow per task, then numbered scenarios.  
**Every write action in these flows also creates an Audit Log entry.**

---

### 2.1 Admin flow (main journey)

```
Admin يسجل دخول بحساب (/auth/login)
    ↓
يدخل كود 2FA (إجباري للأدمن)
    ↓
يدخل /admin/dashboard
    ↓
يشوف الإحصائيات
    ↓
يذهب للتحقق من الدكاترة (/admin/doctors/verification)
    ├── يراجع الـ Medical ID
    ├── يوافق على الدكتور
    └── يرفض الدكتور (سبب إجباري)
    ↓
يذهب للدكاترة (/admin/doctors)
    ├── يفتح صفحة دكتور (/admin/doctors/:id)
    ├── يشوف مرضاه وجلساته وخدماته
    └── يفتح قائمة الانتظار بتاعته
    ↓
يذهب للمرضى (/admin/patients)
    ├── يبحث ويفلتر بفئة معينة
    └── يفتح بروفايل مريض
    ↓
يذهب لإدارة المستخدمين (/admin/users)
    ├── يضيف يوزر أو أدمن جديد
    ├── يعدل بياناته أو يغير دوره
    ├── يوقف / يفعل الحساب
    └── يحذف (Soft Delete) أو يسترجع
    ↓
يذهب للحجوزات (/admin/bookings)
    ├── فحوصات
    └── استشارات
    ↓
يذهب لقائمة الانتظار (/admin/waiting-list)
    ↓
يذهب لخدمات الدكاترة (/admin/services)
    ├── يوافق على خدمة
    ├── يرفض خدمة
    └── يعدل خدمة
    ↓
يذهب لسجل العمليات (/admin/audit-log)
    ↓
يذهب لطلبات الحذف (/admin/deletion-requests)
    ↓
يسجل خروج (Logout)
```

---

### 2.2 Login flow (admin)

```
Admin يفتح /auth/login
    ↓
يدخل email + password
    ↓
POST /api/auth/login
    ↓
Backend يتأكد من الحساب والباسورد
    ↓
الحساب محذوف أو suspended؟ → 403
    ↓
2FA مطلوب → POST /api/auth/2fa/verify
    ↓
Access Token + Refresh Token في HTTP-only Cookies
    ↓
role = admin → redirect إلى /admin/dashboard
    (أي دور تاني → /admin/* → 403 حتى لو فتح صفحته)
```

---

### 2.3 Doctor verification flow

```
Doctor يسجل ويرفع Egyptian Medical ID → verification = pending
    ↓
Admin يفتح /admin/doctors/verification
    ↓
GET /api/admin/doctors/pending
    ↓
يفتح طلب → GET /api/admin/doctors/:id/verification
    ↓
يراجع البيانات وصورة الـ Medical ID
    ↓
    ├── Approve → PATCH /api/admin/doctors/:id/approve
    │       ↓
    │   users.status = active + إيميل للدكتور
    │
    └── Reject (سبب إجباري) → PATCH /api/admin/doctors/:id/reject
            ↓
        verification = rejected + إيميل بالسبب
            ↓
        الدكتور يرجع يرفع Medical ID جديد → pending (نفس الحساب)
    ↓
كل قرار يتسجل في Audit Log
```

---

### 2.4 User management flow

```
Admin يفتح /admin/users
    ↓
إضافة: يدخل role + name + email + phone → POST /api/admin/users
    ↓
Backend يعمل الحساب ويبعت إيميل بلينك لتعيين الباسورد (نفس Reset Password flow)
    ↓
لو الدور admin → يفعّل 2FA في أول دخول (إجباري)

تعديل: PATCH /api/admin/users/:id

تغيير دور: PATCH /api/admin/users/:id/role
    ↓
Backend يتحقق: مش نفسه، الدور مسموح (admin أو patient)، مش أدمن آخر
    ↓
يلغي الـ Refresh Token فوراً عشان الدور الجديد يشتغل

إيقاف: PATCH /api/admin/users/:id/status { suspended }
    ↓
يلغي كل الجلسات → أي Login بعد كده = 403

حذف: DELETE /api/admin/users/:id → deleted_at (Soft Delete)
استرجاع: PATCH /api/admin/users/:id/restore
```

---

### 2.5 Login control flow

```
Admin يفتح /admin/users/:id
    ↓
يشوف: last_login، حالة 2FA، مفعّل ولا لأ
    ↓
    ├── Force Logout → POST .../force-logout (يلغي كل الـ Refresh Tokens)
    ├── Reset Password → POST .../reset-password (إيميل لينك، الأدمن مش بيشوف الباسورد)
    ├── Reset 2FA → POST .../reset-2fa (يمسح secure_key ويقفل enable_2fa)
    └── Suspend / Activate → PATCH .../status
    ↓
كل زر بيطلب confirm وبيتسجل في Audit Log
```

---

### 2.6 Patients search and filter flow

```
Admin يفتح /admin/patients
    ↓
يكتب في البحث (اسم / تليفون / إيميل)
    ↓
يفتح الفالتر ويختار فئة معينة:
    - فئة عمرية (طفل < 18 / بالغ 18-59 / كبير +60) أو مدى عمر
    - دكتور أو تخصص (مرضى حجزوا عنده)
    - حالة الحجز
    - العنوان
    - تاريخ التسجيل
    - عنده تقرير ولا لأ
    ↓
GET /api/admin/patients?... (الفلاتر بتتجمع بـ AND)
    ↓
يتحدث الجدول + chips للفالتر النشطة + زر Reset
    ↓
يفتح مريض → /admin/patients/:id → يشوف حجوزاته مع كل دكتور
```

---

### 2.7 Waiting list flow

```
Admin يفتح /admin/waiting-list
    ↓
يختار دكتور (بالاسم أو الـ id) ويختار اليوم (الافتراضي النهارده)
    ↓
GET /api/admin/waiting-list?doctor_id&date&type
    ↓
Backend يجيب كل bookings الدكتور في اليوم → booking_items بترتيب queue_number
    ↓
يقسمهم لثلاث مجموعات:
    ├── Waiting: pending أو accepted ولسه ما خلصش
    ├── Completed: completed
    └── Removed: rejected أو cancelled أو deleted_at مش فاضي
    ↓
لكل مريض منتظر بيظهر waiting_minutes و estimated_wait_minutes
    ↓
Admin يعدل حالة مريض أو يشيله (Soft) أو يرجعه

Definitions (assumption):
- waiting_minutes = now minus the appointment date and time, never below 0.
- estimated_wait_minutes = number of waiting patients ahead in the queue × average duration_session of that doctor's active services.
```

---

### 2.8 Bookings flow (exams and consultations)

```
Admin يفتح /admin/bookings → يختار تاب (فحوصات / استشارات)
    ↓
يفلتر بدكتور أو حالة أو تاريخ
    ↓
يفتح جلسة → /admin/bookings/:id
    ↓
    ├── يعدل الجلسة (status / total_patients / appointment_date / appointment_time)
    ├── يعدل مريض (status / queue_number)
    ├── يشيل مريض (Soft) أو يرجعه
    └── يلغي الجلسة → bookings.status = cancelled
            ↓
        كل items الـ pending والـ accepted → cancelled + إشعار للمرضى

Rules:
- total_patients cannot go below the number of accepted patients.
- changing date or time notifies the booked patients.
```

---

### 2.9 Data deletion request flow (proposed)

```
Patient يطلب حذف بياناته → deletion_requests.status = pending
    ↓
Admin يفتح /admin/deletion-requests
    ↓
    ├── Approve → إشعار للمريض → حذف نهائي أو إخفاء هوية
    └── Reject (سبب) → إشعار للمريض
    ↓
تتسجل في Audit Log (من غير بيانات المريض الحساسة)
```

---

### 2.10 سيناريوهات

#### Scenario 1: موافقة على دكتور
1. Admin يفتح `/admin/doctors/verification`
2. يفتح طلب دكتور ويراجع الـ Medical ID
3. يضغط Approve ويأكد
4. `users.status` تبقى `active` ويوصل إيميل للدكتور
5. الدكتور يقدر يدخل Doctor features

#### Scenario 2: رفض دكتور وإعادة المحاولة
1. Admin يضغط Reject ويكتب السبب (على الأقل 10 حروف)
2. `verification` تبقى `rejected` ويوصل إيميل بالسبب
3. الدكتور يرفع Medical ID جديد من نفس الحساب
4. الطلب يرجع `pending` في قائمة الأدمن (Attempt 2)

#### Scenario 3: تعيين أدمن جديد
1. Admin يدخل `/admin/users` ويضغط Add user
2. يختار `role = admin` ويدخل الاسم والإيميل
3. Backend يعمل الحساب ويبعت لينك تعيين الباسورد
4. الأدمن الجديد يعين الباسورد ويفعّل 2FA في أول دخول

#### Scenario 4: حماية الأدمن
1. Admin يحاول يغير دوره أو يوقف نفسه أو يحذفها
2. Backend يرفض بـ 403
3. Admin يحاول يوقف أدمن آخر فعّال
4. Backend يرفض بـ 409 "لازم يفضل أدمن واحد فعّال على الأقل"

#### Scenario 5: إيقاف يوزر
1. Admin يفتح `/admin/users/:id` ويضغط Suspend
2. Backend يغير `status` إلى `suspended` ويلغي الـ Refresh Tokens
3. لو اليوزر أونلاين: Access Token يفضل شغال لحد ما ينتهي ثم يتطرد
4. أي Login بعد كده = 403

#### Scenario 6: حذف مريض واسترجاعه
1. Admin يضغط حذف على مريض → `deleted_at` يتملي
2. المريض يختفي من القوائم ومن الـ Login
3. الحجوزات القديمة تفضل موجودة (مفيش CASCADE لأن Soft)
4. Admin يفتح `include_deleted=true` ويضغط Restore

#### Scenario 7: بحث عن فئة معينة
1. Admin يفتح `/admin/patients`
2. يختار فئة عمرية = كبير (+60) ودكتور = د. أحمد
3. الجدول يعرض كل مرضى د. أحمد فوق 60 سنة
4. يفتح مريض ويشوف حجوزاته

#### Scenario 8: قائمة انتظار دكتور في يوم معين
1. Admin يفتح `/admin/waiting-list`
2. يختار د. أحمد ويوم الخميس
3. يشوف منتظر 12، خلصوا 20، اتشالوا 3
4. يضغط على منتظر ويشيله (Soft) فينتقل لمجموعة Removed

#### Scenario 9: إلغاء جلسة فيها مرضى
1. Admin يفتح الجلسة ويضغط Cancel
2. Backend يغير `bookings.status` إلى `cancelled`
3. كل items الـ pending والـ accepted تبقى `cancelled`
4. المرضى يوصلهم إشعار

#### Scenario 10: صلاحيات غلط
1. Patient أو Doctor أي يفتح `/api/admin/*` → 403 Forbidden
2. حد من غير Login → 401 والـ Frontend يوديه `/auth/login`
3. Refresh Token منتهي → 401 ولازم Login جديد
