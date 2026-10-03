# Authentication & Authorization

This module handles user registration, login, authentication, 2FA, password recovery, password change, and role-based access.

The system has three roles:

* **Patient**
* **Doctor**
* **Admin**

---

# 0. Main Site and Sign Up Flow

## 0.1 Main Site / Home Page

The site has a normal public main page that anyone can open without logging in.

### Scenario

**لو أي حد دخل الموقع، هيبدأ من الـ Main Page عادي. ولو عايز يعمل حساب، هيدوس Sign Up.**

```text
Main Page
    ↓
User chooses:
    Login       → Login Page
    Sign Up     → Sign Up Options Page
```

## 0.2 Sign Up Options Page

بعد ما المستخدم يدوس **Sign Up**، يروح لصفحة بتسأله هو عايز يسجل بإيه.

### Scenario

**لو المستخدم عايز يعمل حساب جديد، هيشوف اختيارات التسجيل: **

```text
Sign Up Options Page
        ↓
   ┌────┴───────────────┐
                 Continue with  Email
                         ↓
                 Choose account type
                    /          \
                   ↓            ↓
               Patient       Doctor
                   ↓            ↓
          Patient Register   Doctor Register
```


## 0.3 Choose Account Type

لو المستخدم اختار التسجيل بالإيميل، لازم يحدد نوع الحساب: **Patient** أو **Doctor**.

### Scenario

**مثلاً لو المستخدم اختار Patient:**

```text
Sign Up Options
      ↓
Email
      ↓
Patient
      ↓
Patient Registration Page
```

**ولو اختار Doctor:**

```text
Sign Up Options
      ↓
Email
      ↓
Doctor
      ↓
Doctor Registration Page
```

> Admin is not presented as a normal public sign-up option in the current specification.

---

# 1. User Registration

## 1.1 Patient Registration

### Scenario

**لو العميل عايز يعمل حساب Patient، هيعمل الآتي:**

```text
يفتح صفحة Register
      ↓
يختار Patient
      ↓
يدخل Name + Email + Password + Phone
      ↓
POST /api/auth/register/patient
      ↓
السيستم يعمل الحساب
      ↓
الـ Patient يقدر يعمل Login
```

### Endpoint

```http
POST /api/auth/register/patient
```

### Success

**201 Created** — Patient account created successfully.

### Common errors

- **400 Bad Request** — required data is missing or invalid.
- **409 Conflict** — email is already registered.

### Required data

* Name
* Email
* Password
* Phone

Patients can use their account after registration without Admin approval.

---

## 1.2 Doctor Registration

### Scenario

**لو العميل عايز يعمل حساب Doctor، هيعمل الآتي:**

```text
يفتح صفحة Register
      ↓
يختار Doctor
      ↓
يدخل بياناته
      ↓
يرفع Egyptian Medical ID
      ↓
POST /api/auth/register/doctor
      ↓
الحساب يتعمل بحالة PENDING
      ↓
الـ Admin يراجع بيانات الدكتور والـ Medical ID
```

### Endpoint

```http
POST /api/auth/register/doctor
```

### Success

**201 Created** — Doctor account created with `PENDING` status.

### Common errors

- **400 Bad Request** — required data or Medical ID is missing/invalid.
- **409 Conflict** — email is already registered.

The Doctor cannot access protected Doctor features until the Admin approves the account.

---

# 2. Login

### Scenario

**لو العميل عايز يعمل Login، هيحصل الآتي:**

```text
يفتح صفحة Login
      ↓
يدخل Email + Password
      ↓
POST /api/auth/login
      ↓
السيستم يتأكد من الحساب والباسورد
      ↓
يتأكد من حالة الحساب
      ↓
لو 2FA مطلوب → يطلب كود الـ 2FA
      ↓
لو كل حاجة تمام → Login Success
      ↓
السيستم يجهز Access Token + Refresh Token
      ↓
الـ Backend يحطهم في HTTP-only Cookies
      ↓
المستخدم يدخل التطبيق
```

### Endpoint

```http
POST /api/auth/login
```

Used by Patients, Doctors, and Admins.

### Success

**200 OK** — Login successful.

### Common errors

- **400 Bad Request** — required login data is missing or invalid.
- **401 Unauthorized** — email/password is incorrect.
- **403 Forbidden** — account exists but its current status does not allow login/access, such as a rejected or pending Doctor where applicable.
- **429 Too Many Requests** — too many login attempts, if rate limiting is implemented.

---

# 3. 2FA

2FA means that a user must provide an additional code after the password when 2FA is required.

## 3.1 How 2FA works

The authenticator app is **not receiving a message from our backend every time**.

During 2FA setup, the backend and the authenticator app are linked using a shared secret. The authenticator app uses that secret and the current time to generate a changing code.

```text
First-time setup

Backend creates 2FA secret
        ↓
QR Code / setup information
        ↓
User scans it with Authenticator App
        ↓
Authenticator App stores the secret
```

Later, during login:

```text
User enters Email + Password
        ↓
Backend checks them
        ↓
2FA is required
        ↓
User opens Authenticator App
        ↓
App shows a code, e.g. 123456
        ↓
User types 123456 in the website
        ↓
POST /api/auth/2fa/verify
        ↓
Backend verifies the code
        ↓
If correct → Login continues
```

### 2FA rules

* **Patient:** 2FA is optional.
* **Doctor:** 2FA is required.
* **Admin:** 2FA is required.

### Endpoint

```http
POST /api/auth/2fa/verify
```

### Success

**200 OK** — 2FA code is valid and the login flow can continue.

### Common errors

- **400 Bad Request** — code is missing or malformed.
- **401 Unauthorized** — code is invalid or expired.

> The current authentication API only defines the verification endpoint. If the team later needs endpoints for enabling/disabling 2FA or generating the initial QR code, those endpoints must be added to the API specification.

---

# 4. Access Token and Refresh Token

## 4.1 Normal protected request

### Scenario

**لو المستخدم عامل Login وعايز يدخل على Endpoint محمي، هيحصل الآتي:**

```text
المستخدم يعمل Request
      ↓
الـ Browser يبعت الـ authentication cookies تلقائي
      ↓
الـ Backend يقرأ Access Token
      ↓
يتأكد إن الـ Access Token صحيح ولسه صالح
      ↓
لو تمام → يكمل الـ Request
```

### Result

- **200 OK** or another endpoint-specific success status when the request is accepted.
- **401 Unauthorized** if the user is not authenticated or the Access Token is invalid/expired.
- **403 Forbidden** if the user is authenticated but does not have permission for that endpoint.

## 4.2 Access Token expires

### Scenario

**لو الـ Access Token انتهت صلاحيته، المستخدم مش المفروض يعمل Login من أول وجديد طالما الـ Refresh Token لسه صالح:**

```text
المستخدم يطلب Endpoint محمي
      ↓
Access Token منتهي
      ↓
الـ Client يعمل POST /api/auth/refresh
      ↓
الـ Backend يقرأ Refresh Token
      ↓
Refresh Token صالح؟
     ↙          ↘
   أيوه          لأ
    ↓             ↓
New Access     لازم Login
Token           من جديد
```

### Endpoint

```http
POST /api/auth/refresh
```

### Success

**200 OK** — a new Access Token is issued.

### Common errors

- **401 Unauthorized** — Refresh Token is missing, expired, revoked, or invalid.

## 4.3 When does the Refresh Token become invalid?

The Refresh Token can become invalid when, for example:

- Its expiration time is reached.
- The user logs out and the refresh session/token is revoked.
- The backend explicitly revokes it for a security reason.

When the Refresh Token is no longer valid:

```text
Access Token expired
      ↓
Refresh Token invalid
      ↓
Cannot create new Access Token
      ↓
User must Login again
```

The exact Refresh Token lifetime and revocation rules must be agreed by the backend team before implementation.

---

# 5. Current User

### Scenario

**لو الـ Frontend عايز يعرف مين المستخدم اللي عامل Login دلوقتي، هيعمل الآتي:**

```text
المستخدم فتح التطبيق
      ↓
GET /api/auth/me
      ↓
الـ Backend يتأكد من الـ authentication
      ↓
يحدد مين المستخدم الحالي
      ↓
يرجع بيانات المستخدم
```

### Endpoint

```http
GET /api/auth/me
```

### Success

**200 OK** — current authenticated user's information is returned.

### Common errors

- **401 Unauthorized** — user is not authenticated.

### Response

The exact response should contain the current user's basic account information:

```json
{
  "id": "user_id",
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "phone": "01000000000",
  "role": "patient",
  "status": "approved"
}
```

For a Doctor, the response can also include the Doctor verification status when applicable:

```json
{
  "id": "doctor_id",
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "phone": "01000000000",
  "role": "doctor",
  "status": "approved",
  "medicalIdStatus": "approved"
}
```

`/api/auth/me` means: **"هاتلي بيانات الشخص اللي عامل Login بالحساب الحالي."**

---

# 6. Logout

### Scenario

**لو المستخدم خلص وعايز يعمل Logout، هيحصل الآتي:**

```text
المستخدم يدوس Logout
      ↓
POST /api/auth/logout
      ↓
الـ Backend يلغي/يبطل الـ Refresh Session/Token
      ↓
الـ Backend يمسح authentication cookies
      ↓
المستخدم يرجع لحالة Logged Out
      ↓
لو عايز يدخل تاني → يعمل Login
```

### Endpoint

```http
POST /api/auth/logout
```

### Success

**204 No Content** — logout completed successfully.

### Common errors

- **401 Unauthorized** — no authenticated session exists, if the implementation requires authentication for logout.

Authentication is required according to this specification.

---

# 7. Forgot Password — From Login Page

This is different from changing a password while already logged in.

### Scenario

**لو المستخدم ناسي الباسورد ومش عامل Login أصلًا، هيعمل الآتي:**

```text
يفتح صفحة Login
      ↓
يدوس Forgot Password?
      ↓
يدخل Email
      ↓
POST /api/auth/forgot-password
      ↓
الـ Backend يبدأ Password Reset flow
      ↓
يبعت Email فيه Reset Link
      ↓
المستخدم يفتح الـ Link
      ↓
تفتح صفحة Reset Password
      ↓
يدخل New Password + Confirmation
      ↓
POST /api/auth/reset-password
      ↓
الباسورد يتغير
      ↓
المستخدم يعمل Login بالباسورد الجديد
```

## Request reset

```http
POST /api/auth/forgot-password
```

### Success

**200 OK** — reset request accepted and the reset email is sent/processed.

For security, the response should not reveal whether the email exists in the system.

### Common errors

- **400 Bad Request** — email is missing or invalid.
- **429 Too Many Requests** — too many reset requests, if rate limiting is implemented.

## Reset password

```http
POST /api/auth/reset-password
```

### Success

**200 OK** — password changed successfully.

### Common errors

- **400 Bad Request** — reset token/code or new password is missing/invalid.
- **401 Unauthorized** — reset token/code is invalid or expired.

This flow is for a user who **forgot the password and is not authenticated**.

---

# 8. Change Password — From Settings

This is a completely different flow from Forgot Password.

### Scenario

**لو المستخدم عامل Login وعارف الباسورد الحالي وعايز يغيّره من الـ Settings، هيعمل الآتي:**

```text
المستخدم عامل Login
      ↓
يفتح Settings
      ↓
يدوس Change Password
      ↓
يدخل Current Password
      ↓
يدخل New Password
      ↓
POST /api/auth/change-password
      ↓
الـ Backend يتأكد من الـ Current Password
      ↓
لو صح → يغيّر الباسورد
```

### Endpoint

```http
POST /api/auth/change-password
```

### Success

**200 OK** — password changed successfully.

### Common errors

- **400 Bad Request** — required password fields are missing/invalid.
- **401 Unauthorized** — user is not authenticated or current password is incorrect.

### Important difference

```text
Forgot Password                  Change Password
─────────────────                ─────────────────
المستخدم ناسي الباسورد           المستخدم عارف الباسورد
ومش عامل Login                   وعامل Login
        ↓                                ↓
Login page                       Settings page
        ↓                                ↓
Forgot Password                  Change Password
        ↓                                ↓
Email                             Current Password
        ↓                                ↓
Reset Link                        New Password
        ↓                                ↓
Reset Password                    Password changed
```

---

# 9. Doctor Verification

Doctor verification is handled by the Admin.

## 9.1 View pending Doctors

### Scenario

**لو الـ Admin عايز يشوف الدكاترة اللي لسه مستنيين المراجعة، هيحصل الآتي:**

```text
Admin يفتح Doctor Verification
      ↓
GET /api/admin/Doctors/pending
      ↓
الـ Backend يتأكد إن اللي بيطلب Admin
      ↓
يرجع قائمة الدكاترة اللي حالتهم PENDING
```

### Endpoint

```http
GET /api/admin/Doctors/pending
```

### Success

**200 OK** — pending Doctors returned.

### Common errors

- **401 Unauthorized** — not authenticated.
- **403 Forbidden** — authenticated user is not an Admin.

---

## 9.2 Approve Doctor

### Scenario

**لو الـ Admin راجع بيانات دكتور والـ Medical ID وعايز يعتمده، هيحصل الآتي:**

```text
Admin يفتح بيانات الدكتور
      ↓
يراجع البيانات والـ Medical ID
      ↓
PATCH /api/admin/Doctors/:id/approve
      ↓
حالة الدكتور تبقى APPROVED
      ↓
الدكتور يقدر يدخل الـ protected Doctor features
```

### Endpoint

```http
PATCH /api/admin/Doctors/:id/approve
```

### Success

**200 OK** — Doctor approved.

### Common errors

- **401 Unauthorized** — not authenticated.
- **403 Forbidden** — authenticated user is not an Admin.
- **404 Not Found** — Doctor does not exist.
- **409 Conflict** — Doctor cannot be approved because the current account state is not eligible for approval.

---

## 9.3 Reject Doctor

### Scenario

**لو الـ Admin راجع بيانات دكتور ورفض الـ Medical ID، هيحصل الآتي:**

```text
Admin يراجع الدكتور
      ↓
PATCH /api/admin/Doctors/:id/reject
      ↓
حالة الدكتور تبقى REJECTED
      ↓
الحساب نفسه يفضل موجود
      ↓
الدكتور يقدر يرفع Medical ID تاني
      ↓
الحساب يدخل المراجعة مرة تانية
```

الدكتور **مش محتاج يعمل Account جديد** لمجرد إن الـ verification اترفض.

### Endpoint

```http
PATCH /api/admin/Doctors/:id/reject
```

### Success

**200 OK** — Doctor rejected.

### Common errors

- **401 Unauthorized** — not authenticated.
- **403 Forbidden** — authenticated user is not an Admin.
- **404 Not Found** — Doctor does not exist.
- **409 Conflict** — Doctor cannot be rejected because the current account state is not eligible for rejection.

> The exact endpoint for submitting a new Medical ID after rejection is not defined in the current API specification. The backend team needs to add that endpoint before implementing this part.

---

# 10. Authorization

Authentication checks **who the user is**.

Authorization checks **what the user is allowed to do**.

```text
Patient → Patient features
Doctor  → Doctor features
Admin   → Admin features
```

### Not authenticated

If the user is not authenticated:

```text
401 Unauthorized
```

### Authenticated but not allowed

If the user is logged in but does not have permission:

```text
403 Forbidden
```

---

# 11. Extra Common Scenarios

## 11.1 User tries to access a protected page without being logged in

**لو المستخدم فتح صفحة المفروض إنها للمستخدمين اللي عاملين Login وهو مش عامل Login:**

```text
User opens protected page
      ↓
Frontend checks current authentication
      ↓
GET /api/auth/me
      ↓
Backend returns 401
      ↓
Frontend sends user to Login page
```

Expected API status:

**401 Unauthorized**

---

## 11.2 Patient tries to access an Admin endpoint

**لو Patient عامل Login وحاول يدخل حاجة خاصة بالـ Admin:**

```text
Patient is logged in
      ↓
Requests Admin endpoint
      ↓
Backend identifies the user as Patient
      ↓
Patient does not have Admin permission
      ↓
403 Forbidden
```

---

## 11.3 Doctor is still PENDING

**لو الدكتور سجل ولسه الـ Admin مراجعش الحساب وحاول يدخل Doctor features:**

```text
Doctor registered
      ↓
Status = PENDING
      ↓
Doctor tries to access protected Doctor feature
      ↓
Backend checks account status
      ↓
Access is denied until approval
```

The exact status code for this business rule should be agreed by the backend team based on the final authorization design; normally this is represented by an authorization/access-denied response.

---

## 11.4 Refresh Token is invalid

**لو الـ Access Token انتهى والـ Refresh Token نفسه انتهى أو اتلغى:**

```text
Access Token expired
      ↓
POST /api/auth/refresh
      ↓
Refresh Token invalid
      ↓
Backend cannot issue a new Access Token
      ↓
User must Login again
```

Expected API status:

**401 Unauthorized**

---

# 12. Pages / Screens We Need

## Public pages

1. **Main / Home Page**
   - Public main page of the site
   - Login button
   - Sign Up button

2. **Sign Up Options Page**
   - Continue with Google*
   - Continue with Email
   - Account type selection: Patient / Doctor

3. **Login**
   - Email
   - Password
   - Login button
   - Forgot Password link

4. **Patient Registration**
   - Name
   - Email
   - Password
   - Phone

5. **Doctor Registration**
   - Doctor information
   - Medical ID upload

6. **Forgot Password / Enter Email**
   - Email
   - Send reset email

7. **Reset Password**
   - New password
   - Confirm password
   - Opened from the email reset link

8. **2FA Verification**
   - Authenticator code
   - Used when 2FA is required

## Authenticated pages

9. **Patient Dashboard**

10. **Doctor Dashboard**

11. **Admin Dashboard**

12. **Settings**
    - Account information
    - Change Password
    - Logout

13. **Doctor Verification / Pending Doctors** — Admin only
    - List pending Doctors
    - View submitted Medical ID
    - Approve
    - Reject

14. **Doctor Verification Status**
    - Show Pending / Approved / Rejected
    - If rejected, provide the UI for submitting another Medical ID once the corresponding backend endpoint is defined

---
# 13. Authentication Endpoints Summary

| Endpoint | Purpose | Authentication | Success Status | Common Error Statuses |
|---|---|---|---|---|
| `POST /api/auth/register/patient` | Register Patient | No | **201 Created** | 400, 409 |
| `POST /api/auth/register/doctor` | Register Doctor | No | **201 Created** | 400, 409 |
| `POST /api/auth/login` | Login | No | **200 OK** | 400, 401, 403, 429 |
| `POST /api/auth/2fa/verify` | Verify 2FA code | Login flow | **200 OK** | 400, 401 |
| `POST /api/auth/refresh` | Get a new Access Token | Refresh Token | **200 OK** | 401 |
| `GET /api/auth/me` | Get current user | Yes | **200 OK** | 401 |
| `POST /api/auth/logout` | Logout | Yes | **204 No Content** | 401 |
| `POST /api/auth/forgot-password` | Start Forgot Password flow | No | **200 OK** | 400, 429 |
| `POST /api/auth/reset-password` | Set password using reset flow | Reset Token | **200 OK** | 400, 401 |
| `POST /api/auth/change-password` | Change password from Settings | Yes | **200 OK** | 400, 401 |
| `GET /api/admin/Doctors/pending` | View pending Doctors | Admin only | **200 OK** | 401, 403 |
| `PATCH /api/admin/Doctors/:id/approve` | Approve Doctor | Admin only | **200 OK** | 401, 403, 404, 409 |
| `PATCH /api/admin/Doctors/:id/reject` | Reject Doctor | Admin only | **200 OK** | 401, 403, 404, 409 |


---


