# Admin Flow Documentation

## Admin Authentication Flow

Admin يفتح Login\
↓\
يدخل Email + Password\
↓\
POST /api/auth/login\
↓\
Backend يتحقق من الحساب\
↓\
Admin 2FA مطلوب\
↓\
POST /api/auth/2fa/verify\
↓\
Login Success\
↓\
Admin Dashboard

### Scenarios

-   Login ناجح → 2FA → Dashboard.
-   Login فاشل → رسالة خطأ.
-   2FA غير صحيح → رسالة خطأ.
-   Session غير صالحة → Redirect إلى Login.

------------------------------------------------------------------------

## Doctor Verification Flow

Admin Dashboard\
↓\
Doctor Verification\
↓\
GET /api/admin/Doctors/pending\
↓\
عرض الأطباء Pending\
↓\
Admin يختار Doctor\
↓\
مراجعة البيانات + Medical ID\
↓\
┌───────────────┐\
↓ ↓\
Approve Reject\
↓ ↓\
PATCH approve PATCH reject\
↓ ↓\
Doctor Approved Doctor Rejected

### Scenarios

-   Approve → حالة الطبيب تصبح Approved حسب الـ specification.
-   Reject → حالة الطبيب تصبح Rejected حسب الـ specification.
-   لا يوجد أطباء Pending → Empty State.
-   فشل API → Error State.

------------------------------------------------------------------------

## Authorization Flow

Admin Request\
↓\
Browser sends authentication cookies\
↓\
Backend validates Access Token\
↓\
Backend checks role\
↓\
role = admin ?

YES → Continue\
NO → 403 Forbidden

### Scenarios

-   401 Unauthorized → المستخدم غير authenticated أو الـ token غير
    صالح/منتهي.
-   403 Forbidden → المستخدم authenticated لكنه لا يملك صلاحية Admin.

------------------------------------------------------------------------

## Admin Access Scenarios

### Scenario 1: Successful Admin Login

1.  Admin يدخل Email وPassword.
2.  Backend يتحقق من الحساب.
3.  النظام يطلب 2FA.
4.  Admin يدخل كود Authenticator.
5.  Backend يتحقق من الكود.
6.  يتم توجيه Admin إلى Dashboard.

### Scenario 2: Doctor Approval

1.  Admin يدخل Dashboard.
2.  يفتح Doctor Verification.
3.  النظام يجلب الأطباء Pending.
4.  Admin يراجع بيانات الطبيب وMedical ID.
5.  Admin يضغط Approve.
6.  Backend ينفذ approval endpoint.
7.  يتم تحديث حالة الطبيب.

### Scenario 3: Doctor Rejection

1.  Admin يفتح Doctor Verification.
2.  يختار Doctor.
3.  يراجع البيانات.
4.  يضغط Reject.
5.  Backend ينفذ rejection endpoint.
6.  يتم تحديث حالة الطبيب.

------------------------------------------------------------------------

## Appointment Flows Relevant to the System

### Option 1: AI Appointment

Patient\
↓\
يكتب الأعراض + الوقت المطلوب\
↓\
AI يفهم الأعراض\
↓\
AI يحتاج Doctor Data + Patient Data\
↓\
يحدد التخصص المناسب\
↓\
يبحث عن Available Appointment\
↓\
AI يعرض Doctor + Specialty + Date + Time + Price\
↓\
Patient: تمام احجز\
↓\
Backend creates booking\
↓\
Appointment Details + Queue Number + QR Code

### Option 2: Manual Appointment Booking

Patient\
↓\
Main Page\
↓\
Browse Specialties / Doctors\
↓\
Select Doctor\
↓\
Available Dates\
↓\
Available Times\
↓\
Select Appointment\
↓\
Check missing Patient Data\
↓\
Confirm Appointment\
↓\
Create Booking\
↓\
Queue Number + QR Code

### Important

أسماء الـ APIs الخاصة بـ Appointment Availability وAppointment Creation
غير محددة في الـ source الحالي، لذلك يجب تأكيدها من فريق الـ Backend قبل
إضافتها كـ official APIs.
