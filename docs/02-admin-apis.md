# Admin APIs Documentation

## Doctor Verification

### API

#### HTTP Method: GET

#### Name: getPendingDoctors

#### Role: admin

#### Endpoint: /api/admin/Doctors/pending

#### Description by Arabic:

جلب قائمة الأطباء الذين حالتهم PENDING لمراجعة بياناتهم والـ Medical ID.

#### Success:

200 OK

#### Errors:

-   401 Unauthorized
-   403 Forbidden

------------------------------------------------------------------------

### API

#### HTTP Method: PATCH

#### Name: approveDoctor

#### Role: admin

#### Endpoint: /api/admin/Doctors/:id/approve

#### Description by Arabic:

اعتماد حساب الطبيب بعد مراجعة بياناته والـ Medical ID وتحويل حالته إلى
APPROVED.

#### Success:

200 OK

#### Errors:

-   401 Unauthorized
-   403 Forbidden
-   404 Not Found
-   409 Conflict

------------------------------------------------------------------------

### API

#### HTTP Method: PATCH

#### Name: rejectDoctor

#### Role: admin

#### Endpoint: /api/admin/Doctors/:id/reject

#### Description by Arabic:

رفض اعتماد الطبيب بعد مراجعة بياناته والـ Medical ID مع بقاء الحساب
موجودًا وإتاحة إعادة التقديم حسب الـ backend specification.

#### Success:

200 OK

#### Errors:

-   401 Unauthorized
-   403 Forbidden
-   404 Not Found
-   409 Conflict

------------------------------------------------------------------------

## Authentication APIs Used by Admin

### API

#### HTTP Method: POST

#### Name: login

#### Role: admin

#### Description by Arabic:

تسجيل دخول الأدمن والتحقق من بيانات الحساب.

#### Endpoint:

POST /api/auth/login

------------------------------------------------------------------------

### API

#### HTTP Method: POST

#### Name: verify2FA

#### Role: admin

#### Description by Arabic:

التحقق من كود المصادقة الثنائية الخاص بالأدمن لإكمال عملية تسجيل الدخول.

#### Endpoint:

POST /api/auth/2fa/verify

------------------------------------------------------------------------

### API

#### HTTP Method: GET

#### Name: getCurrentUser

#### Role: admin

#### Description by Arabic:

الحصول على بيانات المستخدم الحالي والتحقق من حالة المصادقة والصلاحية.

#### Endpoint:

GET /api/auth/me

------------------------------------------------------------------------

### API

#### HTTP Method: POST

#### Name: refreshToken

#### Role: admin

#### Description by Arabic:

إصدار Access Token جديد عند انتهاء الـ Access Token الحالي حسب آلية
المصادقة المستخدمة.

#### Endpoint:

POST /api/auth/refresh

------------------------------------------------------------------------

### API

#### HTTP Method: POST

#### Name: logout

#### Role: admin

#### Description by Arabic:

تسجيل خروج الأدمن وإنهاء جلسة المصادقة.

#### Endpoint:

POST /api/auth/logout

------------------------------------------------------------------------

### API

#### HTTP Method: POST

#### Name: changePassword

#### Role: admin

#### Description by Arabic:

تغيير كلمة مرور حساب الأدمن من صفحة Settings.

#### Endpoint:

POST /api/auth/change-password

------------------------------------------------------------------------

## Notes

-   الـ Admin APIs الخاصة بالـ Doctor Verification هي الـ endpoints
    المحددة في الـ specification.
-   أسماء APIs الخاصة بإنشاء الـ Appointment أو البحث عن المواعيد
    المتاحة غير محددة في الـ source الحالي، لذلك لا يتم اختراع endpoints
    لها في هذه الوثيقة.
-   أي endpoint إضافي يجب تأكيده من فريق الـ Backend قبل إضافته إلى الـ
    documentation.
