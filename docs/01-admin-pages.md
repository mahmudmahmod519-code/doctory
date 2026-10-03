# Admin Pages Documentation

## 1. Admin Dashboard

PAGE: Admin Dashboard\
PATH: /admin/dashboard\
ROLE: admin\
PURPOSE: عرض لوحة التحكم الخاصة بالأدمن ومتابعة حالة النظام والعمليات
الإدارية المتاحة.\
STATE: { currentUser, login, role, status }

APIS: - GET /api/auth/me --- للتحقق من المستخدم الحالي والصلاحيات.

UI COMPONENTS: - Dashboard navigation - Statistics cards - Admin
actions - Doctor verification entry point

STATES: - loading: تحميل بيانات المستخدم/الإحصائيات - empty: لا توجد
بيانات للعرض - error: فشل تحميل البيانات - success: عرض لوحة التحكم

ACTIONS: - Admin: مراجعة الدكاترة المعلقين. - الانتقال إلى Doctor
Verification. - استخدام خصائص الأدمن.

REDIRECTS: - /auth/login عند عدم وجود جلسة مصادقة. -
/admin/doctors/pending عند اختيار Doctor Verification.

------------------------------------------------------------------------

## 2. Doctor Verification / Pending Doctors

PAGE: Doctor Verification / Pending Doctors\
PATH: /admin/doctors/pending\
ROLE: admin\
PURPOSE: عرض الأطباء الذين ما زالت حساباتهم PENDING ومراجعة بياناتهم
والـ Medical ID.\
STATE: { currentUser, login, role, doctors, status }

APIS: - GET /api/admin/Doctors/pending - PATCH
/api/admin/Doctors/:id/approve - PATCH /api/admin/Doctors/:id/reject

UI COMPONENTS: - Pending doctors list/table - Doctor information -
Medical ID viewer - Approve button - Reject button

STATES: - loading: تحميل قائمة الأطباء. - empty: لا يوجد أطباء
Pending. - error: فشل تحميل/تنفيذ العملية. - success: عرض القائمة أو
تحديث حالة الطبيب.

ACTIONS: - عرض بيانات الطبيب. - مراجعة Medical ID. - Approve Doctor. -
Reject Doctor.

REDIRECTS: - /auth/login عند عدم المصادقة. - منع الوصول عند role غير
admin.

------------------------------------------------------------------------

## 3. Settings

PAGE: Settings\
PATH: /settings\
ROLE: admin\
PURPOSE: إدارة بيانات الحساب وتغيير كلمة المرور وتسجيل الخروج.\
STATE: { currentUser, login, role }

APIS: - GET /api/auth/me - POST /api/auth/change-password - POST
/api/auth/logout

UI COMPONENTS: - Account information - Change Password form - Logout
button

STATES: - loading - error - success

ACTIONS: - تغيير كلمة المرور. - Logout.

REDIRECTS: - /auth/login بعد Logout. - /auth/login عند انتهاء/عدم وجود
المصادقة.

------------------------------------------------------------------------

## 4. 2FA Verification

PAGE: 2FA Verification\
PATH: /auth/2fa/verify\
ROLE: admin\
PURPOSE: إدخال كود Authenticator المطلوب للأدمن لإكمال تسجيل الدخول.\
STATE: { loginPending, role, twoFactorRequired }

APIS: - POST /api/auth/2fa/verify

UI COMPONENTS: - Authenticator code input - Verify button - Error
message

STATES: - loading - error: الكود غير صحيح أو منتهي. - success: إكمال
Login.

ACTIONS: - إدخال كود 2FA. - التحقق من الكود.

REDIRECTS: - /admin/dashboard بعد نجاح المصادقة.
