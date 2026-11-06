# 🎨 Doctory — Pages Prompts for Google Stitch

هذا الملف يحتوي على **Prompts جاهزة** لكل صفحة في تطبيق Doctory، مستمدة من:
- التعليقات (comments) في ملفات `routes/*/index.js` (Render Routes)
- توثيق الصفحات في `README.md` (قسم Pages + Page-to-API Index)
- هيكل ملفات `.ejs` الموجودة في مجلد `views/`

يمكنك نسخ كل prompt وإرساله إلى **Google Stitch** (أو أي أداة AI توليد واجهات UI) للحصول على تصميم الصفحة الجاهز للتنفيذ كـ EJS template.

---

## 📋 كيف تستخدم هذا الملف

1. اختر الصفحة التي تريد تصميمها من الأقسام أدناه
2. انسخ 내용 الـ **Prompt** الخاص بتلك الصفحة
3. ألصقه في Google Stitch مع تحديد:
   - **Platform:** Web / Responsive
   - **Framework:** HTML + Tailwind CSS (أو EJS ready)
   - **Language:** Arabic (RTL support)
4. اطلب من Stitch توليد الكود completo مع المكونات التفاعلية

---

## 🎯 دليل التصميم الموحد (Design System)

جميع الصفحات تتبع هذا الدليل design system:

### الألوان (Colors)
- **Primary (طبي):** `#0EA5E9` (Sky Blue 500) — للأزرار الرئيسية والروابط
- **Primary Dark:** `#0284C7` — للحالة النشطة (hover/active)
- **Secondary:** `#64748B` (Slate 500) — للنصوص الثانوية
- **Success (موافق/مكتمل):** `#10B981` (Emerald 500)
- **Warning (تنبيه/في انتظار):** `#F59E0B` (Amber 500)
- **Danger (مرفوض/ملغي/خطأ):** `#EF4444` (Red 500)
- **Info (معلومات):** `#3B82F6` (Blue 500)
- **Background (خلفية):** `#F8FAFC` (Slate 50)
- **Surface (سطح البطاقات):** `#FFFFFF` (White)
- **Text Primary (نص رئيسي):** `#0F172A` (Slate 900)
- **Text Secondary (نص ثانوي):** `#475569` (Slate 600)
- **Border (حدود):** `#E2E8F0` (Slate 200)

### الخطوط (Typography)
- **العربية:** Cairo / Tajawal / Amiri (للحقول الطبية)
- **الإنجليزية:** Inter / System UI
- **الاتجاه:** RTL (Right-to-Left) للغة العربية

### المكونات المشتركة (Shared Components)
- **Navbar:** شريط علوي bevat شعار Doctory، قائمة التنقل، أيقونة الإشعارات، صورة المستخدم
- **Sidebar:** قائمة جانبية لل admins والأطباء والمرضى حسب الدور
- **Footer:** تذييل enthält روابط قانونية وحقوق النشر
- **Flash Messages:** رسائل نجاح/خطأ تظهر أعلى المحتوى
- **Modal Confirm:** نافذة تأكيد للحذف/الرفض/الإلغاء
- **Pagination:** ترقيم الصفحات للجداول الطويلة
- **Notification Bell:** جرس الإشعارات مع عداد غير المقروء

### التخطيط العام (Layout)
- **Desktop:** Sidebar على اليسار، محتوى رئيسي في الوسط، عرض كامل
- **Tablet/Mobile:** Sidebar يختفي، showing navbar مع زر قائمة (hamburger)، المحتوى يأخذ العرض الكامل

---

## 🏠 القسم الأول: الصفحات العامة (Public / Guest Pages)

### 1. الصفحة الرئيسية — Home / Landing Page
**المسار:** `/`  
**الدور:** Guest (زائر)  
**الواجهة:** `views/layouts/guest-layout.ejs` + `views/static/home.ejs`  
**الـ APIs:** `GET /api/auth/me` (للتحقق من حالة تسجيل الدخول)

**عناصر واجهة المستخدم:**
- شريط Navbart (Guest) يحتوي على شعار Doctory، روابط (حول، اتصل بنا، الأسئلة الشائعة، تسجيل الدخول، تسجيل حساب)
- قسم Hero كبير يحتوي على عنوان رئيسي: "نظام عيادات ذكي لإدارة الحجوزات ودعم القرار الطبي السريري"
- أزرار دعوة للعمل: "تسجيل دخول"، "تسجيل مريض جديد"، "تسجيل طبيب جديد"
- بطاقات الميزات الرئيسية: حجز مواعيد، إدارة الطابور، تقارير طبية، تذكيرات ذكية
- عرض أطباء مميزين (Featured Doctors) مع التخصص والتقييم
- شريط شهادات المرضى (Testimonials)
- تذييل الصفحة (Footer) يحتوي على روابط قانونية وسياسات

**Prompt لـ Google Stitch:**
```
Design a modern healthcare clinic landing page in Arabic (RTL) for "Doctory" - AI-Powered Smart Clinic System. 
Use Tailwind CSS with color scheme: Primary Sky Blue #0EA5E9, Background #F8FAFC, White cards #FFFFFF.
Components needed:
- Guest Navbar (top): Doctory logo on left, nav links (About, Contact, FAQ, Login, Sign Up) on right, mobile hamburger menu
- Hero section: Large heading "نظام عيادات ذكي - إدارة الحجوزات ودعم القرار الطبي", subheading about booking and AI clinical decision support, two CTAs (Login button primary, Sign Up secondary)
- Feature cards grid (3 columns): Appointment Booking, Queue Management, Medical Reports, Smart Reminders
- Featured doctors section: doctor cards with photo, name, specialty, rating, "Book Now" button
- Testimonials slider with patient quotes
- Footer with legal links (Privacy, Terms, Refund), copyright, social icons
- Arabic language support (RTL), Cairo font, responsive design for mobile/tablet/desktop
- Clean, professional, trustworthy medical aesthetic
```

---

### 2. حول العيادة — About Us
**المسار:** `/about-us`  
**الدور:** Guest  
**الواجهة:** `views/static/about.ejs`  
**الـ APIs:** None (صفحة ثابتة)

**عناصر واجهة المستخدم:**
- encabezاد الصفحة مع شعار Doctory
- نبذة عن نظام Doctory وأهدافه (تحسين تجربة المريض، تقليل أوقات الانتظار، دعم القرار الطبي)
- عرض أعضاء الفريق الطبي (الأطباء، الإداريون)
- قيم العيادة والالتزام بالجودة
- معلومات الاتصال وال موقع العيادة

**Prompt لـ Google Stitch:**
```
Design an About Us page for Doctory clinic system in Arabic (RTL). Tailwind CSS, professional medical style.
Components:
- Guest Navbar at top
- Page header with page title "حول النظام" and subtitle
- Mission and vision section with icons
- Team section: grid of doctor/staff cards with photos, names, roles, specialties
- Clinic values section with 3-4 value cards
- Contact info: address, phone, email, working hours
- Footer with legal links
- Arabic (RTL), Cairo font, responsive, clean healthcare aesthetic
```

---

### 3. اتصل بنا — Contact Us
**المسار:** `/contact-us`  
**الدور:** Guest  
**الواجهة:** `views/static/contact.ejs`  
**الـ APIs:** None (صفحة ثابتة)

**عناصر واجهة المستخدم:**
- نموذج اتصال (Contact Form): الاسم، البريد الإلكتروني، الهاتف، الرسالة، زر الإرسال
- معلومات اتصال العيادة (عنوان، هاتف، إيميل، ساعات العمل)
- خريطة موقع العيادة (اختياري)
- روابط وسائل التواصل الاجتماعي

**Prompt لـ Google Stitch:**
```
Design a Contact Us page for Doctory clinic in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Contact form on left or center: name, email, phone, subject dropdown, message textarea, submit button (primary Sky Blue)
- Contact info card on right: clinic address, phone, email, working hours, map placeholder
- Footer
- Arabic (RTL), Cairo font, responsive, validation styles for form fields
```

---

### 4. الأسئلة الشائعة — FAQ
**المسار:** `/faq`  
**الدور:** Guest  
**الواجهة:** `views/static/faq.ejs`  
**الـ APIs:** None (صفحة ثابتة)

**عناصر واجهة المستخدم:**
- قائمة أسئلة شائعة مع إجابات قابلة للطي (Accordion)
- تصنيف الأسئلة حسب الفئة (حساب، حجز، دفع، طبي، تقني)
- شريط بحث للأسئلة

**Prompt لـ Google Stitch:**
```
Design an FAQ page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Page title "الأسئلة الشائعة" with subtitle
- Search bar for filtering questions
- Accordion component: question clickable, answer expands below
- FAQ categories: Account, Booking, Payment, Medical, Technical
- Each FAQ item: question in bold, answer in regular text, chevron icon
- Footer
- Arabic (RTL), Cairo font, responsive, smooth animations for accordion
```

---

### 5. سياسة الخصوصية — Privacy Policy
**المسار:** `/legal/privacy`  
**الدور:** Guest  
**الواجهة:** `views/static/privacy.ejs`  
**الـ APIs:** None (صفحة ثابتة)

**عناصر واجهة المستخدم:**
- عنوان الصفحة "سياسة الخصوصية"
- نص السياسة مقسم إلى فقرات وعناوين فرعية
- معلومات حول جمع البيانات واستخدامها وحمايتها
- تاريخ آخر تحديث للسياسة

**Prompt لـ Google Stitch:**
```
Design a Privacy Policy page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Page title "سياسة الخصوصية" 
- Content area with readable text, headings, paragraphs, bullet points
- Sections: Data Collection, Data Usage, Data Protection, User Rights, Contact for privacy concerns
- Last updated date
- Footer
- Arabic (RTL), Cairo font, responsive, high readability (good line height, contrast)
```

---

### 6. الشروط والأحكام — Terms & Conditions
**المسار:** `/legal/terms`  
**الدور:** Guest  
**الواجهة:** `views/static/terms.ejs`  
**الـ APIs:** None (صفحة ثابتة)

**عناصر واجهة المستخدم:**
- عنوان الصفحة "الشروط والأحكام"
- نص الشروط مقسم إلى أقسام
- شروط استخدام النظام، مسؤولية المستخدم، حقوق الملكية الفكرية

**Prompt لـ Google Stitch:**
```
Design a Terms & Conditions page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Page title "الشروط والأحكام"
- Content area with legal text, numbered sections, headings
- Sections: Acceptance of Terms, User Responsibilities, Intellectual Property, Limitation of Liability, Governing Law
- Footer
- Arabic (RTL), Cairo font, responsive, formal legal aesthetic
```

---

### 7. سياسة الاسترجاع — Refund Policy
**المسار:** `/refund`  
**الدور:** Guest  
**الواجهة:** `views/static/refund.ejs`  
**الـ APIs:** None (صفحة ثابتة)

**عناصر واجهة المستخدم:**
- عنوان الصفحة "سياسة الاسترجاع"
- شروط استرجاع المدفوعات، الحالات المؤهلة للاسترجاع، مدة معالجة الطلب

**Prompt لـ Google Stitch:**
```
Design a Refund Policy page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Page title "سياسة الاسترجاع والاسترداد"
- Content area with refund conditions, eligibility criteria, processing time, contact for refund requests
- Footer
- Arabic (RTL), Cairo font, responsive
```

---

### 8. خيارات التسجيل — Sign Up Options
**المسار:** `/auth/signup-options`  
**الدور:** Guest  
**الواجهة:** `views/auth/signup-options.ejs`  
**الـ APIs:** None (صفحة ثابتة)

**عناصر واجهة المستخدم:**
- عنوان الصفحة "اختر نوع الحساب"
- بطاقتان كبيرتان: "تسجيل مريض" و "تسجيل طبيب"
- كل بطاقة تحتوي على وصف قصير وأزرار للتوجيه لصفحة التسجيل المقابلة
- رابط العودة لتسجيل الدخول

**Prompt لـ Google Stitch:**
```
Design a Sign Up Options page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Page title "اختر نوع الحساب الذي تريد إنشاؤه"
- Two large cards side by side:
  1. Patient card: icon, title "تسجيل مريض جديد", description, button "تسجيل كمريض"
  2. Doctor card: icon, title "تسجيل طبيب جديد", description about Medical ID requirement, button "تسجيل كطبيب"
- Link to login page at bottom
- Footer
- Arabic (RTL), Cairo font, responsive, cards with hover effects
```

---

### 9. تسجيل الدخول — Login
**المسار:** `/auth/login`  
**الدور:** Guest  
**الواجهة:** `views/auth/login.ejs`  
**الـ APIs:** `POST /api/auth/login`

**عناصر واجهة المستخدم:**
- نموذج تسجيل الدخول: البريد الإلكتروني، كلمة المرور، checkbox "تذكرني"
- زر "تسجيل الدخول" (Primary)
- روابط: "تسجيل حساب جديد"، "نسيت كلمة المرور"
- رسائل خطأ إذا كانت البيانات غير صحيحة
- إعادة التوجيه للصفحة الرئيسية إذا كان المستخدم مسجل دخول بالفعل

**Prompt لـ Google Stitch:**
```
Design a Login page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top (minimal)
- Centered login card with shadow
- Page title "تسجيل الدخول" with subtitle "مرحباً بعودتك إلى نظام Doctory"
- Form fields: Email (with email icon), Password (with lock icon + show/hide toggle), Remember me checkbox
- Primary submit button "تسجيل الدخول" (Sky Blue)
- Error message area (red) for invalid credentials
- Links: "تسجيل حساب جديد" (patient/doctor options), "نسيت كلمة المرور؟"
- Footer (minimal)
- Arabic (RTL), Cairo font, responsive, clean form design with focus states
```

---

### 10. تسجيل مريض جديد — Patient Registration
**المسار:** `/auth/register/patient`  
**الدور:** Guest  
**الواجهة:** `views/auth/register-patient.ejs`  
**الـ APIs:** `POST /api/auth/register/patient`

**عناصر واجهة المستخدم:**
- نموذج التسجيل: الاسم، البريد الإلكتروني، كلمة المرور، تأكيد كلمة المرور، الهاتف، العنوان (اختياري)
- زر "إنشاء حساب"
- رابط "لديك حساب بالفعل؟ سجل دخول"
- إعادة التوجيه إذا كان المستخدم مسجل دخول

**Prompt لـ Google Stitch:**
```
Design a Patient Registration page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Centered registration card
- Page title "تسجيل مريض جديد" with subtitle "انضم إلى نظام Doctory كمريض"
- Form fields: Full Name, Email, Phone, Password, Confirm Password, Address (optional)
- Password strength indicator
- Primary submit button "إنشاء حساب"
- Link to login: "لديك حساب؟ تسجيل الدخول"
- Error messages for validation (email exists, weak password, etc.)
- Footer
- Arabic (RTL), Cairo font, responsive
```

---

### 11. تسجيل طبيب جديد — Doctor Registration
**المسار:** `/auth/register/doctor`  
**الدور:** Guest  
**الواجهة:** `views/auth/register-doctor.ejs`  
**الـ APIs:** `POST /api/auth/register/doctor`

**عناصر واجهة المستخدم:**
- نموذج التسجيل: الاسم، البريد الإلكتروني، كلمة المرور، الهاتف، التخصص، ساعات العمل
- رفع صورة بطاقة النقابة الطبية (Medical ID) — حقل إجباري
- زر "إرسال الطلب"
- رابط "لديك حساب بالفعل؟ سجل دخول"
- ملاحظة: الحساب ينشئ بحالة "في انتظار التحقق" ويحتاج موافقة المسؤول

**Prompt لـ Google Stitch:**
```
Design a Doctor Registration page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Centered registration card
- Page title "تسجيل طبيب جديد" with subtitle "انضم إلى شبكة أطباء Doctory"
- Form fields: Full Name, Email, Phone, Password, Confirm Password, Specialty (dropdown), Working Hours (text area)
- File upload section for Medical Syndicate ID (required): upload area, preview thumbnail, allowed types (image/jpeg, image/png, image/webp, application/pdf), max 5MB
- Notice: "سيتم إنشاء حسابك بحالة قيد الانتظار حتى تتم مراجعة بطاقة النقابة من قبل الإدارة"
- Primary submit button "إرسال طلب التسجيل"
- Link to login
- Footer
- Arabic (RTL), Cairo font, responsive, file upload styling with drag-and-drop visual
```

---

### 12. نسيت كلمة المرور — Forgot Password
**المسار:** `/auth/forgot-password`  
**الدور:** Guest  
**الواجهة:** `views/auth/forgot-password.ejs`  
**الـ APIs:** `POST /api/auth/forgot-password`

**عناصر واجهة المستخدم:**
- حقل البريد الإلكتروني فقط
- زر "إرسال رابط إعادة التعيين"
- رسالة نجاح بعد الإرسال (بدون الكشف عن وجود البريد من عدمه لأسباب أمنية)
- رابط العودة لتسجيل الدخول

**Prompt لـ Google Stitch:**
```
Design a Forgot Password page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Centered card
- Page title "نسيت كلمة المرور" with subtitle "أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور"
- Form field: Email
- Primary submit button "إرسال رابط إعادة التعيين"
- Success message after submission (generic, doesn't reveal if email exists)
- Link to login page
- Footer
- Arabic (RTL), Cairo font, responsive
```

---

### 13. إعادة تعيين كلمة المرور — Reset Password
**المسار:** `/auth/reset-password/:token`  
**الدور:** Guest  
**الواجهة:** `views/auth/reset-password.ejs`  
**الـ APIs:** `POST /api/auth/reset-password`

**عناصر واجهة المستخدم:**
- حقل كلمة المرور الجديدة
- حقل تأكيد كلمة المرور الجديدة
- زر "إعادة التعيين"
- التحقق من صحة التوكن (من الرابط المرسل عبر البريد)
- انتهاء صلاحية التوكن بعد ساعة واحدة

**Prompt لـ Google Stitch:**
```
Design a Reset Password page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Centered card
- Page title "إعادة تعيين كلمة المرور" with subtitle "أدخل كلمة المرور الجديدة"
- Form fields: New Password, Confirm New Password (with show/hide toggle)
- Password strength indicator
- Primary submit button "إعادة تعيين كلمة المرور"
- Error handling for invalid/expired token
- Link to login page
- Footer
- Arabic (RTL), Cairo font, responsive
```

---

### 14. التحقق من البريد الإلكتروني — Email Verification
**المسار:** `/auth/verify-email/:token`  
**الدور:** Guest  
**الواجهة:** `views/auth/email-verification.ejs`  
**الـ APIs:** `POST /api/auth/verify-email`

**عناصر واجهة المستخدم:**
- رسالة التحقق من البريد الإلكتروني
- زر "التحقق" أو التحقق التلقائي عند فتح الصفحة
- رسالة نجاح أو فشل
- رابط إعادة إرسال رابط التحقق (اختياري)

**Prompt لـ Google Stitch:**
```
Design an Email Verification page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Centered card
- Page title "التحقق من البريد الإلكتروني"
- Verification status area: success icon/checkmark or error icon
- Message: "تم التحقق من بريدك الإلكتروني بنجاح" or error message
- Button: "الذهاب إلى تسجيل الدخول"
- Link to resend verification email (optional)
- Footer
- Arabic (RTL), Cairo font, responsive, clean verification aesthetic
```

---

### 15. التحقق بخطوتين — 2FA Verification
**المسار:** `/auth/2fa/verify`  
**الدور:** Guest / تدفق تسجيل الدخول  
**الواجهة:** `views/auth/2fa-verify.ejs`  
**الـ APIs:** `POST /api/auth/2fa/verify`

**عناصر واجهة المستخدم:**
- حقل إدخال كود المصادقة (6 أرقام)
- زر "التحقق"
- رسالة إذا كان الكود غير صحيح
- ملاحظة: إجباري للأطباء والإداريين، اختياري للمرضى

**Prompt لـ Google Stitch:**
```
Design a 2FA Verification page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Centered card
- Page title "التحقق بخطوتين" with subtitle "أدخل رمز التحقق من تطبيق المصادقة"
- OTP input: 6 separate digit boxes or single input with masking
- Primary submit button "التحقق"
- Resend code option (optional)
- Error message for invalid code
- Link to login
- Footer
- Arabic (RTL), Cairo font, responsive, OTP inputs with focus states
```

---

### 16. البحث عن الأطباء — Doctor Search / Listing
**المسار:** `/doctors`  
**الدور:** Guest  
**الواجهة:** `views/patient/doctors/search.ejs`  
**الـ APIs:** `GET /api/admin/doctors` (planned)

**عناصر واجهة المستخدم:**
- شريط بحث: البحث بالاسم، التخصص، المدينة
- فلاتر: التخصص، الحالة (متاح/غير متاح)، التقييم
- قائمة الأطباء: بطاقات تحتوي على صورة الطبيب، الاسم، التخصص، سنوات الخبرة، التقييم، ساعات العمل، زر "حجز موعد"
- ترقيم الصفحات (Pagination)

**Prompt لـ Google Stitch:**
```
Design a Doctor Search/Listing page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Page title "البحث عن الأطباء"
- Search bar: search by name, specialty, location
- Filter chips: Specialty (Cardiology, Dermatology, Pediatrics, etc.), Status (Available/Busy), Rating
- Doctor cards grid: photo, name, specialty, experience years, rating stars, consultation fee, working hours, "Book Appointment" button
- Pagination at bottom
- No results state
- Footer
- Arabic (RTL), Cairo font, responsive, filter chips with active states
```

---

### 17. الملف الشخصي العام للطبيب — Public Doctor Profile
**المسار:** `/doctors/:id`  
**الدور:** Guest  
**الواجهة:** `views/patient/doctors/profile.ejs`  
**الـ APIs:** `GET /api/admin/doctors/:id` (planned)

**عناصر واجهة المستخدم:**
- صورة الغلاف وصورة الملف الشخصي للطبيب
- الاسم، التخصص، اللقب، سنوات الخبرة
- قائمة الخدمات المقدمة مع الأسعار والمدة
- ساعات العمل الأسبوعية
- التقييمات والمراجعات من المرضى
- زر "حجز موعد"

**Prompt لـ Google Stitch:**
```
Design a Public Doctor Profile page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Doctor header: cover image, profile photo, name, specialty, title, experience years, rating
- Services section: list of services with title, price, duration, "Book" button per service
- Working hours: weekly schedule table (Saturday to Thursday)
- Reviews section: patient reviews with ratings, comments, dates
- "Book Appointment" CTA button (sticky or prominent)
- Footer
- Arabic (RTL), Cairo font, responsive, professional doctor profile aesthetic
```

---

## 👤 القسم الثاني: صفحات المريض (Patient Pages)

### 18. لوحة تحكم المريض — Patient Dashboard
**المسار:** `/patient/dashboard`  
**الدور:** Patient  
**الواجهة:** `views/patient/dashboard.ejs`  
**الـ APIs:** `GET /api/auth/me`, `GET /api/admin/bookings` (planned)

**عناصر واجهة المستخدم:**
- بطاقات الإحصائيات: المواعيد القادمة، الطبيب، التخصص، التاريخ، الوقت، رقم الطابور، الحالة
- قائمة المواعيد القادمة
- أزرار إجراءات سريعة: حجز موعد جديد، عرض السجل الطبي، الإشعارات

**Prompt لـ Google Stitch:**
```
Design a Patient Dashboard page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Patient Layout: Sidebar (Dashboard, My Appointments, Medical History, Reports, Settings, Notifications), Top Navbar with notifications bell and user avatar
- Stat cards: Upcoming Appointments, Today's Queue Number, Completed Visits, Pending Bookings
- Upcoming appointments list: doctor name, specialty, date, time, queue number, status badge (pending/accepted/completed)
- Quick action buttons: "Book New Appointment", "View Medical History", "View Notifications"
- Welcome message with patient name
- Arabic (RTL), Cairo font, responsive, dashboard aesthetic with cards and tables
```

---

### 19. قائمة الانتظار — Waiting Queue
**المسار:** `/patient/waiting-queue`  
**الدور:** Patient  
**الواجهة:** `views/patient/waiting-queue.ejs`  
**الـ APIs:** `GET /api/admin/waiting-list` (planned)

**عناصر واجهة المستخدم:**
- رقم الطابور الخاص بالمريض
- الرقم الحالي الذي يتم الكشف عنه
- عدد المرضى أمام المريض في الطابور
- الوقت المقدر للانتظار
- شريط تقدم (Progress Bar) لموقع المريض في الطابور

**Prompt لـ Google Stitch:**
```
Design a Patient Waiting Queue page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Patient Layout with sidebar
- Page title "قائمة الانتظار"
- Big queue number display: "رقم دورك: 5"
- Current number being served: "الرقم الحالي: 3"
- Patients ahead count: "4 مرضى أمامك"
- Estimated wait time: "الوقت المقدر للانتظار: 20 دقيقة"
- Progress bar showing position in queue
- List of patients ahead with their queue numbers and status
- Auto-refresh indicator
- Arabic (RTL), Cairo font, responsive, queue aesthetic with progress visualization
```

---

### 20. إشعار الدور — Turn Notification
**المسار:** `/patient/turn-notification`  
**الدور:** Patient  
**الواجهة:** `views/patient/turn-notification.ejs`  
**الـ APIs:** `GET /api/queue/:bookingItemId` (planned), `PATCH /api/queue/:bookingItemId/confirm` (planned), `PATCH /api/queue/:bookingItemId/decline` (planned)

**عناصر واجهة المستخدم:**
- رسالة "دورك الآن!"
- اسم الطبيب والعيادة
- موعد الكشف
- زر "تأكيد الحضور" (Confirm)
- زر "رفض/تأجيل" (Decline) مع تحذير من المحاولات المتبقية

**Prompt لـ Google Stitch:**
```
Design a Turn Notification page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Patient Layout with sidebar
- Large notification card with animation/attention-grabbing style
- Title: "دورك الآن!" (Your turn is now!)
- Doctor name, clinic name, appointment date and time
- Queue number display
- Two action buttons: "تأكيد الحضور" (Confirm - Green), "تأجيل/رفض" (Decline - Red)
- Warning text about remaining attempts if declining
- Countdown timer (optional)
- Arabic (RTL), Cairo font, responsive, urgent notification aesthetic
```

---

### 21. تحذير الرفض الأول — First Decline Warning
**المسار:** `/patient/decline-warning`  
**الدور:** Patient  
**الواجهة:** `views/patient/decline-warning.ejs`  
**الـ APIs:** `PATCH /api/queue/:bookingItemId/decline` (planned)

**عناصر واجهة المستخدم:**
- إشعار بالرفض الأول للموعد
- عدد المحاولات المتبقية قبل إلغاء الموعد تلقائيًا
- خيارات: تأكيد الموعد، إعادة جدولة

**Prompt لـ Google Stitch:**
```
Design a First Decline Warning page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Patient Layout with sidebar
- Warning card (amber/yellow style)
- Title: "تحذير - أول عملية رفض"
- Message explaining the decline and remaining attempts
- Attempts counter: "المحاولات المتبقية: 2 من 3"
- Action buttons: "تأكيد الموعد", "إعادة جدولة"
- Consequence warning: "بعد 3 محاولات رفض سيتم إلغاء الموعد تلقائياً"
- Arabic (RTL), Cairo font, responsive, warning aesthetic
```

---

### 22. الموعد ملغي — Appointment Cancelled
**المسار:** `/patient/appointment-cancelled`  
**الدور:** Patient  
**الواجهة:** `views/patient/appointment-cancelled.ejs`  
**الـ APIs:** `PATCH /api/queue/:bookingItemId/decline` (planned)

**عناصر واجهة المستخدم:**
- إشعار بإلغاء الموعد
- سبب الإلغاء
- خيارات: حجز موعد جديد، التواصل مع العيادة

**Prompt لـ Google Stitch:**
```
Design an Appointment Cancelled page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Patient Layout with sidebar
- Cancellation card (red style)
- Title: "تم إلغاء الموعد"
- Cancellation reason display
- Doctor and appointment details
- Action buttons: "حجز موعد جديد", "التواصل مع العيادة"
- Footer
- Arabic (RTL), Cairo font, responsive
```

---

### 23. السجل الطبي — Medical History
**المسار:** `/patient/medical-history`  
**الدور:** Patient  
**الواجهة:** `views/patient/medical-history.ejs`  
**الـ APIs:** `GET /api/patients/:patientId/medical-history` (planned)

**عناصر واجهة المستخدم:**
- الأمراض المزمنة (السكري، ضغط الدم، الربو، إلخ)
- الحساسيات
- الأدوية الحالية
- التاريخ الطبي السابق
- نموذج لإضافة/تعديل المعلومات الطبية

**Prompt لـ Google Stitch:**
```
Design a Medical History page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Patient Layout with sidebar
- Page title "السجل الطبي"
- Sections: Chronic Diseases (with checkboxes/tags), Allergies, Current Medications, Past Medical History
- Each section: add/edit buttons, list of items with remove option
- Form to add new medical condition or medication
- Save changes button
- Privacy notice about medical data protection
- Arabic (RTL), Cairo font, responsive, medical forms aesthetic
```

---

### 24. التقرير الطبي — Medical Report
**المسار:** `/patient/medical-report`  
**الدور:** Patient  
**الواجهة:** `views/patient/medical-report.ejs`  
**الـ APIs:** `GET /api/admin/bookings/:id` (planned)

**عناصر واجهة المستخدم:**
- معلومات الطبيب
- تاريخ الزيارة
- الأعراض
- التشخيص
- الوصفة الطبية
- زر تحميل/طباعة التقرير

**Prompt لـ Google Stitch:**
```
Design a Medical Report page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Patient Layout with sidebar
- Page title "التقرير الطبي"
- Report header: patient name, doctor name, specialty, visit date
- Report content sections: Symptoms, Diagnosis, Prescription, Doctor Notes
- Medication list with dosage and instructions
- Print/Download button (PDF)
- Official clinic stamp/header design
- Arabic (RTL), Cairo font, responsive, medical document aesthetic
```

---

### 25. حجز موعد / اختيار خدمة — Book Appointment
**المسار:** `/book/:portfolioId`  
**الدور:** Patient  
**الواجهة:** `views/patient/doctors/book-appointment.ejs`  
**الـ APIs:** `POST /api/admin/bookings` (planned), `GET /api/admin/services` (planned)

**عناصر واجهة المستخدم:**
- اختيار الخدمة من قائمة خدمات الطبيب
- اختيار التاريخ والوقت المتاح
- عرض المدة الافتراضية للكشف
- ملخص الحجز والتكلفة
- زر تأكيد الحجز
- نموذج وصف المشكلة الطبية (اختياري، مع الموافقة على استخدام البيانات للتنبؤ بالذكاء الاصطناعي)

**Prompt لـ Google Stitch:**
```
Design a Book Appointment page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Patient Layout with sidebar
- Page title "حجز موعد جديد"
- Doctor info header: name, specialty, rating
- Service selection: list of doctor services with title, price, duration
- Date picker: calendar for selecting appointment date
- Time slot selector: available time slots for the selected date
- Appointment summary: service, date, time, duration, total price
- Problem description textarea (optional): "وصف المشكلة الطبية Briefly"
- AI consent checkbox: "أوافق على استخدام بيانات الموعد للتنبؤ بمدة الكشف واحتمال الغياب"
- Primary button "تأكيد الحجز"
- Back button to doctor profile
- Arabic (RTL), Cairo font, responsive, booking flow aesthetic
```

---

### 26. الملف الشخصي / الإعدادات — Patient Profile / Settings
**المسار:** `/patient/settings`  
**الدور:** Patient  
**الواجهة:** `views/patient/settings.ejs`  
**الـ APIs:** `GET /api/auth/me`, `PATCH /api/admin/users/:id` (planned)

**عناصر واجهة المستخدم:**
- بيانات الحساب: الاسم، البريد الإلكتروني، الهاتف، العنوان، تاريخ الميلاد، الدور، الحالة
- تعديل البيانات الشخصية
- تغيير كلمة المرور
- تفعيل/إيقاف التحقق بخطوتين (2FA)
- صورة الملف الشخصي

**Prompt لـ Google Stitch:**
```
Design a Patient Profile/Settings page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Patient Layout with sidebar (Profile, Settings active)
- Page title "ملفي الشخصي والإعدادات"
- Profile section: avatar upload, name, email, phone, address, birth date, role badge, status badge
- Edit form: input fields for editable data
- Change password section: current password, new password, confirm password
- 2FA section: toggle switch for enable/disable, setup instructions
- Save changes button
- Delete account request button (danger zone)
- Arabic (RTL), Cairo font, responsive, settings aesthetic
```

---

### 27. إرسال تقييم — Submit Review
**المسار:** `/patient/review/:bookingItemId`  
**الدور:** Patient  
**الواجهة:** `views/patient/submit-review.ejs`  
**الـ APIs:** `POST /api/admin/reviews/:id` (planned)

**عناصر واجهة المستخدم:**
- تقييم الطبيب بالنجمات (1-5)
- مربع نص للتعليق
- زر إرسال التقييم
- عرض التقييمات السابقة للطبيب (اختياري)

**Prompt لـ Google Stitch:**
```
Design a Submit Review page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Patient Layout with sidebar
- Page title "تقييم الطبيب"
- Doctor name and visit info header
- Star rating: 5 stars (interactive, clickable)
- Comment textarea: "شارك تجربتك مع الطبيب"
- Submit button "إرسال التقييم"
- Success message after submission
- Previous reviews section (optional)
- Arabic (RTL), Cairo font, responsive, rating aesthetic with star visuals
```

---

### 28. مركز الإشعارات — Notifications Center
**المسار:** `/notifications`  
**الدور:** Patient  
**الواجهة:** `views/patient/notifications.ejs`  
**الـ APIs:** `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all`

**عناصر واجهة المستخدم:**
- قائمة الإشعارات الواردة للمريض
- تمييز الإشعارات غير المقروءة
- زر "تحديد الكل كمقروء"
- زر حذف إشعار فردي
- أنواع الإشعارات: تغيير موقع الطابور، قبول/رفض الحجز، تحذير الدور، إلغاء الموعد، موافقة على التحقق الطبي

**Prompt لـ Google Stitch:**
```
Design a Notifications Center page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Patient Layout with sidebar (Notifications active)
- Page title "مركز الإشعارات"
- Header actions: "تحديد الكل كمقروء", delete all option
- Notifications list: each item has icon (based on type), title, message, timestamp, read/unread dot
- Notification types: queue_update, booking_accepted, booking_rejected, turn_warning, appointment_cancelled, doctor_verified, system
- Unread items highlighted with background color
- Click to mark as read and view details
- Empty state when no notifications
- Arabic (RTL), Cairo font, responsive, notification list aesthetic
```

---

## 👨‍⚕️ القسم الثالث: صفحات الطبيب (Doctor Pages)

### 29. تسجيل دخول الطبيب — Doctor Login
**المسار:** `/doctor/login`  
**الدور:** Doctor  
**الواجهة:** `views/doctor/login.ejs`  
**الـ APIs:** `POST /api/auth/login`

**عناصر واجهة المستخدم:**
- نموذج تسجيل الدخول: البريد الإلكتروني، كلمة المرور
- التحقق بخطوتين (إجباري للأطباء)
- رابط "نسيت كلمة المرور"
- رابط "تسجيل حساب طبيب جديد"

**Prompt لـ Google Stitch:**
```
Design a Doctor Login page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Guest Navbar at top
- Centered login card
- Page title "تسجيل دخول الطبيب" with subtitle "دخول إلى لوحة التحكم الطبية"
- Form fields: Email, Password, Remember me
- Primary button "تسجيل الدخول"
- 2FA notice: "التحقق بخطوتين إلزامي للأطباء"
- Links: "نسيت كلمة المرور؟", "تسجيل حساب طبيب جديد"
- Arabic (RTL), Cairo font, responsive
```

---

### 30. لوحة تحكم الطبيب — Doctor Dashboard
**المسار:** `/doctor/dashboard`  
**الدور:** Doctor  
**الواجهة:** `views/doctor/dashboard.ejs`  
**الـ APIs:** `GET /api/doctor/dashboard` (planned)

**عناصر واجهة المستخدم:**
- بطاقات الإحصائيات: عدد الحجوزات المعلقة، قائمة الانتظار، الاختصارات السريعة
- المواعيد القادمة اليوم
- زر عرض الحجوزات المعلقة للمراجعة

**Prompt لـ Google Stitch:**
```
Design a Doctor Dashboard page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Doctor Layout: Sidebar (Dashboard, Pending Bookings, Waiting List, Clinical Summary, Diagnosis, Prescription, Verification Status, Portfolio), Top Navbar
- Stat cards: Pending Bookings Count, Today's Patients, Waiting List Count, Completed Today
- Today's appointments: list with patient name, time, type, status
- Quick actions: "Review Pending Bookings", "View Waiting List", "Add Prescription"
- Welcome message with doctor name
- Arabic (RTL), Cairo font, responsive, dashboard aesthetic
```

---

### 31. الحجوزات المعلقة — Pending Bookings
**المسار:** `/doctor/bookings/pending`  
**الدور:** Doctor  
**الواجهة:** `views/doctor/bookings-pending.ejs`  
**الـ APIs:** `GET /api/doctor/bookings?status=pending` (planned)

**عناصر واجهة المستخدم:**
- قائمة طلبات الحجز في انتظار المراجعة
- إجراء: قبول أو رفض كل طلب
- عرض تفاصيل المريض المختصرة لاتخاذ القرار

**Prompt لـ Google Stitch:**
```
Design a Pending Bookings page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Doctor Layout with sidebar (Pending Bookings active)
- Page title "الحجوزات المعلقة"
- Table of booking requests: patient name, service type, date, time, status badge (pending)
- Action buttons per row: "قبول" (Accept - Green), "رفض" (Reject - Red)
- Reject reason input (required on rejection)
- Patient summary info for decision making
- Empty state when no pending bookings
- Arabic (RTL), Cairo font, responsive, table aesthetic
```

---

### 32. تفاصيل الحجز — Booking Details
**المسار:** `/doctor/bookings/:id`  
**الدور:** Doctor  
**الواجهة:** `views/doctor/booking-details.ejs`  
**الـ APIs:** `GET /api/doctor/bookings/:bookingId` (planned)

**عناصر واجهة المستخدم:**
- رأس الجلسة: الطبيب، النوع، التاريخ، الوقت، السعة
- جدول المرضى: رقم الطابور، المريض، الهاتف، العمر، الحالة
- نوافذ تعديل لحالة المريض ورقم الطابور

**Prompt لـ Google Stitch:**
```
Design a Booking Details page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Doctor Layout with sidebar
- Page title "تفاصيل الحجز"
- Session header card: doctor name, type (exam/consultation), date, time, capacity
- Patients table: queue number, patient name, phone, age, status badge
- Edit dialogs for patient status and queue number (modal)
- Status options: pending, accepted, rejected, completed, cancelled
- Back button to pending bookings list
- Arabic (RTL), Cairo font, responsive, details aesthetic
```

---

### 33. قائمة الانتظار — Waiting List
**المسار:** `/doctor/waiting-list`  
**الدور:** Doctor  
**الواجهة:** `views/doctor/waiting-list.ejs`  
**الـ APIs:** `GET /api/doctor/waiting-list` (planned)

**عناصر واجهة المستخدم:**
- طابور اليوم لهذا الطبيب
- مجموعات: في الانتظار، مكتمل، مُزال (مرفوض/ملغي/محذوف)
- لكل مريض في الانتظار: رقم الطابور، وقت الانتظار، الوقت المقدر للانتظار

**Prompt لـ Google Stitch:**
```
Design a Doctor Waiting List page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Doctor Layout with sidebar (Waiting List active)
- Page title "قائمة الانتظار - اليوم"
- Doctor picker + date picker (default today)
- Counters: Waiting count, Completed count, Removed count
- Three groups/tabs: Waiting (queue number, patient, waiting minutes, estimated wait), Completed (queue number, patient, completed at), Removed (rejected/cancelled/deleted)
- Each waiting patient card: queue number, name, waiting time, estimated wait, action buttons
- Arabic (RTL), Cairo font, responsive, queue management aesthetic
```

---

### 34. ملخص الزيارة السريرية — Patient Visit / Clinical Summary
**المسار:** `/doctor/visits/:id/clinical-summary`  
**الدور:** Doctor  
**الواجهة:** `views/doctor/clinical-summary.ejs`  
**الـ APIs:** `GET /api/doctor/visits/:visitId/clinical-summary` (planned)

**عناصر واجهة المستخدم:**
- السياق الطبي المصرح به للطبيب فقط
- معلومات المريض المختصرة
- ملخص الزيارة الحالية والسابقة

**Prompt لـ Google Stitch:**
```
Design a Clinical Summary page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Doctor Layout with sidebar
- Page title "ملخص الزيارة السريرية"
- Patient info header: name, age, chronic conditions summary
- Visit details: date, reason for visit, current symptoms
- Clinical context section (authorized for doctor only)
- Previous visits summary (dates, diagnoses)
- Navigation to Diagnosis Editor and Prescription Editor
- Arabic (RTL), Cairo font, responsive, clinical aesthetic
```

---

### 35. محرر التشخيص — Diagnosis Editor
**المسار:** `/doctor/visits/:id/diagnosis`  
**الدور:** Doctor  
**الواجهة:** `views/doctor/diagnosis-editor.ejs`  
**الـ APIs:** `PUT /api/doctor/visits/:visitId/diagnosis` (planned)

**عناصر واجهة المستخدم:**
- إنشاء أو تعديل التشخيص
- حفظ التشخيص

**Prompt لـ Google Stitch:**
```
Design a Diagnosis Editor page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Doctor Layout with sidebar
- Page title "محرر التشخيص"
- Patient visit info header
- Diagnosis text area: main diagnosis text
- Secondary diagnoses list (optional)
- ICD codes or diagnosis categories dropdown (optional)
- Save button "حفظ التشخيص"
- Cancel button
- Arabic (RTL), Cairo font, responsive, medical editor aesthetic
```

---

### 36. محرر الوصفة الطبية — Prescription Editor
**المسار:** `/doctor/visits/:id/prescription`  
**الدور:** Doctor  
**الواجهة:** `views/doctor/prescription-editor.ejs`  
**الـ APIs:** `POST /api/doctor/visits/:visitId/prescriptions` (planned)

**عناصر واجهة المستخدم:**
- كتابة الوصفة الطبية
- إضافة أدوية مع الجرعة ومدة الاستخدام
- تعليمات للمريض

**Prompt لـ Google Stitch:**
```
Design a Prescription Editor page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Doctor Layout with sidebar
- Page title "محرر الوصفة الطبية"
- Patient visit info header
- Prescription header: doctor name, date, patient name
- Medications table: drug name, dosage, frequency, duration, instructions
- Add medication button (add row to table)
- General instructions textarea
- Print prescription button
- Save prescription button
- Arabic (RTL), Cairo font, responsive, prescription aesthetic with formal medical layout
```

---

### 37. حالة التحقق الطبي — Doctor Verification Status
**المسار:** `/doctor/verification-status`  
**الدور:** Doctor  
**الواجهة:** `views/doctor/verification-status.ejs`  
**الـ APIs:** `GET /api/doctor/profile/verification-status` (planned)

**عناصر واجهة المستخدم:**
- حالة التحقق: قيد الانتظار / موافق عليه / مرفوض
- سبب الرفض (إن وجد)
- زر إعادة إرسال بطاقة النقابة الطبية (لإعادة التقديم)

**Prompt لـ Google Stitch:**
```
Design a Doctor Verification Status page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Doctor Layout with sidebar
- Page title "حالة التحقق الطبي"
- Status badge: Pending (amber), Approved (green), Rejected (red)
- Medical ID upload history: previous submissions with dates and status
- Rejection reason display (if rejected)
- Resubmit Medical ID button: upload area for new Medical ID image
- Timeline of verification process
- Arabic (RTL), Cairo font, responsive, verification aesthetic
```

---

### 38. محرر portfolio الطبيب — Doctor Portfolio Editor
**المسار:** `/doctor/portfolio`  
**الدور:** Doctor  
**الواجهة:** `views/doctor/portfolio-editor.ejs`  
**الـ APIs:** `GET /api/doctor/portfolio`, `PATCH /api/doctor/portfolio` (planned)

**عناصر واجهة المستخدم:**
- تعديل الملف الشخصي: الاسم، التخصص، اللقب، صورة الغلاف، صورة الملف الشخصي، رقم الهاتف، ساعات العمل
- إضافة/تعديل الخدمات (السعر، المدة، الوصف)

**Prompt لـ Google Stitch:**
```
Design a Doctor Portfolio Editor page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Doctor Layout with sidebar (Portfolio active)
- Page title "ملف الطبيب الشخصي"
- Profile editing: cover image upload, profile image upload, name, specialty, title, phone, working hours
- Services section: list of services with title, price, duration, description, status
- Add new service form
- Edit/delete service actions per row
- Save changes button
- Arabic (RTL), Cairo font, responsive, portfolio editor aesthetic
```

---

## 🛡️ القسم الرابع: صفحات المسؤول (Admin Pages)

### 39. لوحة تحكم المسؤول — Admin Dashboard
**المسار:** `/admin/dashboard`  
**الدور:** Admin  
**الواجهة:** `views/admin/dashboard.ejs`  
**الـ APIs:** `GET /api/admin/stats` (planned)

**عناصر واجهة المستخدم:**
- بطاقات الإحصائيات: عدد المرضى، عدد الأطباء حسب الحالة، الحجوزات اليوم، المرضى في الانتظار، طلبات التحقق المعلقة، طلبات الحذف المعلقة
- الرسوم البيانية: الحجوزات حسب اليوم، الحجوزات حسب النوع/الحالة، أهم التخصصات

**Prompt لـ Google Stitch:**
```
Design an Admin Dashboard page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout: Sidebar (Dashboard, Doctors Verification, Doctors, Patients, Users, Bookings, Waiting List, Services, Audit Log, Deletion Requests), Top Navbar
- Stat cards: Total Patients, Doctors by Status, Bookings Today, Waiting Patients, Pending Verifications, Pending Deletion Requests
- Charts area: bookings per day (line chart), bookings by type/status (pie/donut), top specialties (bar chart)
- Recent activity feed
- Quick action buttons for common admin tasks
- Arabic (RTL), Cairo font, responsive, admin dashboard aesthetic with charts and cards
```

---

### 40. التحقق من الأطباء — Doctor Verification
**المسار:** `/admin/doctors/verification`  
**الدور:** Admin  
**الواجهة:** `views/admin/doctors/verification-list.ejs`  
**الـ APIs:** `GET /api/admin/doctors/pending` (planned)

**عناصر واجهة المستخدم:**
- قائمة الأطباء في انتظار مراجعة بطاقة النقابة الطبية
- فلاتر: البحث، التخصص، الحالة
- ترقيم الصفحات

**Prompt لـ Google Stitch:**
```
Design a Doctor Verification page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar (Doctors Verification active)
- Page title "التحقق من الأطباء - قيد المراجعة"
- Search bar: search by name, specialty
- Table of pending doctors: portfolio_id, name, specialty, email, registration date, Medical ID status
- Action buttons: "عرض التفاصيل" (View Details) per doctor
- Pagination
- Empty state
- Arabic (RTL), Cairo font, responsive, verification list aesthetic
```

---

### 41. تفاصيل التحقق الطبي — Doctor Verification Details
**المسار:** `/admin/doctors/verification/:id`  
**الدور:** Admin  
**الواجهة:** `views/admin/doctors/verification-details.ejs`  
**الـ APIs:** `GET /api/admin/doctors/:id/verification` (planned)

**عناصر واجهة المستخدم:**
- صورة بطاقة النقابة الطبية قابلة للتكبير (Zoomable)
- إجراءات: موافقة أو رفض (مع سبب مطلوب للرفض)

**Prompt لـ Google Stitch:**
```
Design a Doctor Verification Details page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar
- Page title "تفاصيل التحقق الطبي للطبيب"
- Doctor info: name, specialty, email, registration date
- Medical ID image: large display with zoom capability, download option
- Previous attempts history (if resubmitted)
- Action buttons: "موافق" (Approve - Green), "مرفوض" (Reject - Red)
- Reject reason textarea (required on rejection)
- Approve effect: sets verification=approved, user status=active, sends email
- Arabic (RTL), Cairo font, responsive, verification details aesthetic
```

---

### 42. قائمة الأطباء — Doctors
**المسار:** `/admin/doctors`  
**الدور:** Admin  
**الواجهة:** `views/admin/doctors/list.ejs`  
**الـ APIs:** `GET /api/admin/doctors` (planned)

**عناصر واجهة المستخدم:**
- جدول لجميع الأطباء مع فلاتر: التخصص، الحالة، البحث
- ترقيم الصفحات
- إجراءات: عرض الملف الشخصي، تفعيل/تعليق، حذف ناعم (soft delete)

**Prompt لـ Google Stitch:**
```
Design a Doctors Management page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar (Doctors active)
- Page title "إدارة الأطباء"
- Search and filters: specialty dropdown, status dropdown, search input
- Doctors table: ID, name, specialty, email, status badge, sessions count, patients count
- Row actions: View Profile, Activate/Suspend, Soft Delete
- Pagination
- Add doctor button (optional)
- Arabic (RTL), Cairo font, responsive, management table aesthetic
```

---

### 43. ملف الطبيب الشخصي — Doctor Profile
**المسار:** `/admin/doctors/:id`  
**الدور:** Admin  
**الواجهة:** `views/admin/doctors/profile.ejs`  
**الـ APIs:** `GET /api/admin/doctors/:id` (planned)

**عناصر واجهة المستخدم:**
- تفاصيل الطبيب، ساعات العمل، الجلسات، المرضى، الخدمات
- زر قائمة الانتظار

**Prompt لـ Google Stitch:**
```
Design a Doctor Profile page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar
- Page title "ملف الطبيب الشخصي"
- Doctor header: photo, name, specialty, title, status badge
- Tabs: Overview, Working Hours, Sessions, Patients, Services
- Overview: working hours, total patients, average rating
- Sessions list: service title, price, duration, status
- Patients assigned: patient names, booking counts
- Waiting list button
- Arabic (RTL), Cairo font, responsive, profile aesthetic with tabs
```

---

### 44. قائمة المرضى — Patients
**المسار:** `/admin/patients`  
**الدور:** Admin  
**الواجهة:** `views/admin/patients/list.ejs`  
**الـ APIs:** `GET /api/admin/patients` (planned)

**عناصر واجهة المستخدم:**
- البحث والفلترة للمرضى حسب: الاسم، الهاتف، البريد الإلكتروني، مجموعة العمر، الطبيب، الحالة، العنوان، تاريخ التسجيل، لديه تقرير

**Prompt لـ Google Stitch:**
```
Design a Patients Management page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar (Patients active)
- Page title "إدارة المرضى"
- Advanced filters: name, phone, email, age group, doctor, status, address, registration date, has report
- Patients table: name, email, phone, age, status badge, doctor, registration date, has report indicator
- Row actions: View Profile, Edit, Suspend/Activate, Soft Delete
- Pagination
- Export option (optional)
- Arabic (RTL), Cairo font, responsive, patient management table aesthetic
```

---

### 45. ملف المريض الشخصي — Patient Profile
**المسار:** `/admin/patients/:id`  
**الدور:** Admin  
**الواجهة:** `views/admin/patients/profile.ejs`  
**الـ APIs:** `GET /api/admin/patients/:id` (planned)

**عناصر واجهة المستخدم:**
- معلومات المريض
- سجل الحجوزات مع الأطباء (النوع، التاريخ، رقم الطابور، الحالة)
- عدد التقارير فقط (محتوى التقرير الطبي غير معروض للمسؤول)

**Prompt لـ Google Stitch:**
```
Design a Patient Profile page for Admin in Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar
- Page title "ملف المريض الشخصي"
- Patient info card: name, email, phone, age, address, status, registration date
- Booking history table: doctor, type, date, queue number, status
- Reports count (only count, no medical content for admin privacy)
- Action buttons: Edit Patient, Suspend/Activate, Request Data Deletion
- Arabic (RTL), Cairo font, responsive, patient profile aesthetic
```

---

### 46. المستخدمين والإداريين — Users & Admins
**المسار:** `/admin/users`  
**الدور:** Admin  
**الواجهة:** `views/admin/users/list.ejs`  
**الـ APIs:** `GET /api/admin/users` (planned)

**عناصر وواجهة المستخدم:**
- تبويبات الأدوار: الكل / إداريون / أطباء / مرضى
- جدول مع إضافة مستخدم (Drawer)
- قائمة إجراءات لكل صف: تعديل، تغيير الدور، تفعيل/تعليق، حذف ناعم، استعادة

**Prompt لـ Google Stitch:**
```
Design a Users & Admins Management page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar (Users active)
- Page title "إدارة المستخدمين والإداريين"
- Role tabs: All / Admins / Doctors / Patients
- Users table: user_id, name, email, phone, role badge, status badge
- Add user drawer/modal: role, name, email, phone (admin doesn't set password; reset email sent)
- Row actions: Edit, Change Role, Activate/Suspend, Soft Delete, Restore
- Pagination
- Arabic (RTL), Cairo font, responsive, user management aesthetic
```

---

### 47. تفاصيل المستخدم — User Details
**المسار:** `/admin/users/:id`  
**الدور:** Admin  
**الواجهة:** `views/admin/users/details.ejs`  
**الـ APIs:** `GET /api/admin/users/:id` (planned)

**عناصر واجهة المستخدم:**
- بطاقة الحساب: الدور، الحالة، التحقق من البريد، تفعيل التحقق بخطوتين، آخر تسجيل دخول
- لوحة التحكم في تسجيل الدخول: تعليق/تفعيل، تسجيل خروج قسري، إرسال رابط إعادة تعيين كلمة المرور، إعادة تعيين التحقق بخطوتين، نموذج التعديل، منطقة الخطر (حذف ناعم)

**Prompt لـ Google Stitch:**
```
Design a User Details / Login Control Panel page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar
- Page title "تفاصيل المستخدم والتحكم في الدخول"
- Account card: role, status, email verified badge, 2FA enabled badge, last login date
- Login control panel: Suspend/Activate, Force Logout, Send Reset Password Email, Reset 2FA
- Edit form: name, email, phone, address, birth date
- Danger zone: Soft Delete (with confirmation)
- Role change and status change sections
- Arabic (RTL), Cairo font, responsive, control panel aesthetic with warning styles for danger zone
```

---

### 48. الحجوزات — Bookings
**المسار:** `/admin/bookings`  
**الدور:** Admin  
**الواجهة:** `views/admin/bookings/list.ejs`  
**الـ APIs:** `GET /api/admin/bookings` (planned)

**عناصر واجهة المستخدم:**
- صفحة الحجوزات (فحوصات واستشارات)
- علامات التبويب: فحوصات / استشارات / الكل
- فلاتر: الطبيب، الحالة، نطاق التاريخ
- جدول: المعرف، الطبيب، النوع، التاريخ، الوقت، المحجوز/الإجمالي، الحالة
- إجراءات: فتح التفاصيل، تعديل الحالة/السعة/الوقت، إلغاء، حذف ناعم، استعادة

**Prompt لـ Google Stitch:**
```
Design a Bookings Management page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar (Bookings active)
- Page title "إدارة الحجوزات"
- Tabs: Exams / Consultations / All
- Filters: doctor, status, date range
- Bookings table: ID, doctor, type, date, time, booked/total patients, status badge
- Row actions: Open Details, Modify Status/Capacity/Time, Cancel, Soft Delete, Restore
- Pagination
- Arabic (RTL), Cairo font, responsive, bookings table aesthetic
```

---

### 49. تفاصيل الحجز — Booking Details
**المسار:** `/admin/bookings/:id`  
**الدور:** Admin  
**الواجهة:** `views/admin/bookings/details.ejs`  
**الـ APIs:** `GET /api/admin/bookings/:id` (planned)

**عناصر واجهة المستخدم:**
- رأس الجلسة: الطبيب، النوع، التاريخ، الوقت، السعة
- جدول المرضى: رقم الطابور، المريض، الهاتف، العمر، الحالة
- نوافذ تعديل لحالة المريض ورقم الطابور

**Prompt لـ Google Stitch:**
```
Design a Booking Details page for Admin in Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar
- Page title "تفاصيل الحجز"
- Session header: doctor, type, date, time, capacity
- Patients table: queue number, patient name, phone, age, status badge
- Edit dialogs for patient status and queue number
- Status options: pending, accepted, rejected, completed, cancelled
- Back button to bookings list
- Arabic (RTL), Cairo font, responsive, details aesthetic
```

---

### 50. قائمة الانتظار — Waiting List
**المسار:** `/admin/waiting-list`  
**الدور:** Admin  
**الواجهة:** `views/admin/waiting-list.ejs`  
**الـ APIs:** `GET /api/admin/waiting-list` (planned)

**عناصر واجهة المستخدم:**
- طابور اليوم لكل طبيب
- مجموعات: في الانتظار، مكتمل، مُزال
- لكل مريض في الانتظار: رقم الطابور، المريض، دقائق الانتظار، الوقت المقدر للانتظار

**Prompt لـ Google Stitch:**
```
Design an Admin Waiting List page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar (Waiting List active)
- Page title "قوائم انتظار الأطباء"
- Doctor picker + date picker (default today)
- Counters: Waiting / Completed / Removed
- Groups: Waiting (queue number, patient, waiting minutes, estimated wait), Completed (queue number, patient, completed at), Removed (rejected/cancelled/deleted)
- Each waiting patient: queue number, name, phone, waiting time, estimated wait, action buttons
- Arabic (RTL), Cairo font, responsive, queue management aesthetic
```

---

### 51. خدمات الأطباء — Doctor Services
**المسار:** `/admin/services`  
**الدور:** Admin  
**الواجهة:** `views/admin/services.ejs`  
**الـ APIs:** `GET /api/admin/services` (planned)

**عناصر واجهة المستخدم:**
- علامات تبويب الحالة: قيد الانتظار / نشط / مرفوض
- جدول: العنوان، الطبيب، السعر، المدة، الحالة
- إجراءات: موافقة، رفض (سبب مطلوب)، تعديل، حذف ناعم

**Prompt لـ Google Stitch:**
```
Design a Doctor Services Management page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar (Services active)
- Page title "خدمات الأطباء"
- Status tabs: Pending / Active / Rejected
- Services table: title, doctor, price, duration, status badge
- Row actions: Approve (green), Reject (red with reason required), Edit, Soft Delete
- Reject reason input
- Pagination
- Arabic (RTL), Cairo font, responsive, services management table aesthetic
```

---

### 52. سجل العمليات — Audit Log
**المسار:** `/admin/audit-log`  
**الدور:** Admin  
**الواجهة:** `views/admin/audit-log.ejs`  
**الـ APIs:** `GET /api/admin/audit-logs` (planned)

**عناصر واجهة المستخدم:**
- سجل عمليات للقراءة فقط
- فلاتر: العملية، الفاعل، نوع الكيان، نطاق التاريخ
- جدول: الوقت، الفاعل، العملية، الكيان، الـ IP
- بيانات وصفية قابلة للطي (JSON). لا تعديل أو حذف.

**Prompt لـ Google Stitch:**
```
Design an Audit Log page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar (Audit Log active)
- Page title "سجل العمليات (Audit Log)"
- Notice: Read-only operation log, no edit/delete allowed
- Filters: action, actor, entity type, date range
- Audit table: time, actor name/role, action, entity type, entity ID, IP address
- Expandable metadata JSON column (click to expand)
- Pagination
- Export logs option (optional)
- Arabic (RTL), Cairo font, responsive, log/table aesthetic with monospace for JSON
```

---

### 53. طلبات الحذف — Deletion Requests
**المسار:** `/admin/deletion-requests`  
**الدور:** Admin  
**الواجهة:** `views/admin/deletion-requests.ejs`  
**الـ APIs:** `GET /api/admin/deletion-requests` (planned)

**عناصر واجهة المستخدم:**
- جدول: اسم المريض (مُقنّع لخصوصية البيانات)، تاريخ الطلب، الحالة
- إجراءات: موافقة (حذف كلي/إخفاء هوية) أو رفض (سبب مطلوب)

**Prompt لـ Google Stitch:**
```
Design a Deletion Requests page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Admin Layout with sidebar (Deletion Requests active)
- Page title "طلبات حذف البيانات (Law 151/2020)"
- Table: patient name (masked for privacy), requested at, status badge
- Row actions: Approve (hard delete/anonymize) or Reject (reason required)
- Approve effect: hard delete or anonymize patient data (exception to soft delete)
- Reject reason input
- Pagination
- Privacy notice about data protection law compliance
- Arabic (RTL), Cairo font, responsive, deletion requests aesthetic
```

---

## ❌ القسم الخامس: صفحات الأخطاء (Error Pages)

### 54. صفحة 403 — Forbidden
**المسار:** `/403`  
**الدور:** جميع الأدوار  
**الواجهة:** `views/errors/403.ejs`  
**الـ APIs:** None (صفحة ثابتة)

**عناصر واجهة المستخدم:**
- رسالة واضحة: "ليس لديك صلاحية للوصول إلى هذه الصفحة"
- زر العودة للصفحة الرئيسية أو الصفحة السابقة

**Prompt لـ Google Stitch:**
```
Design a 403 Forbidden error page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Minimal layout (no sidebar)
- Page title "403 - غير مصرح به"
- Error icon (lock/shield)
- Message: "ليس لديك صلاحية للوصول إلى هذه الصفحة"
- Buttons: "العودة للرئيسية", "الذهاب للخلف"
- Arabic (RTL), Cairo font, responsive, clean error aesthetic
```

---

### 55. صفحة 404 — Not Found
**المسار:** `/404`  
**الدور:** جميع الأدوار  
**الواجهة:** `views/errors/404.ejs`  
**الـ APIs:** None (صفحة ثابتة)

**عناصر واجهة المستخدم:**
- رسالة واضحة: "الصفحة غير موجودة"
- زر العودة للصفحة الرئيسية

**Prompt لـ Google Stitch:**
```
Design a 404 Not Found error page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Minimal layout (no sidebar)
- Page title "404 - الصفحة غير موجودة"
- Error icon (page with exclamation mark)
- Message: "عذراً، الصفحة التي تبحث عنها غير موجودة"
- Buttons: "العودة للرئيسية", "التواصل مع الدعم"
- Arabic (RTL), Cairo font, responsive, friendly error aesthetic
```

---

### 56. صفحة 500 — Server Error
**المسار:** `/500`  
**الدور:** جميع الأدوار  
**الواجهة:** `views/errors/500.ejs`  
**الـ APIs:** None (صفحة ثابتة)

**عناصر واجهة المستخدم:**
- رسالة واضحة: "خطأ في السيرفر"
- زر إعادة المحاولة أو العودة للصفحة الرئيسية

**Prompt لـ Google Stitch:**
```
Design a 500 Server Error page for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- Minimal layout (no sidebar)
- Page title "500 - خطأ في السيرفر"
- Error icon (server/warning)
- Message: "حدث خطأ غير متوقع في السيرفر، يرجى المحاولة لاحقاً"
- Buttons: "إعادة المحاولة", "العودة للرئيسية"
- Arabic (RTL), Cairo font, responsive, clean error aesthetic
```

---

## 🧩 القسم السادس: التخطيطات والقطع المشتركة (Layouts & Partials)

### التخطيط الرئيسي — Main Layout
**الملف:** `views/layouts/main-layout.ejs`  
**الاستخدام:** التخطيط الأساسي للصفحات العامة (Guest)

**عناصر واجهة المستخدم:**
- هيكل HTML أساسي مع head و body
- تضمين الـ Navbar Guest و Footer
- منطقة المحتوى الرئيسية (yield)

**Prompt لـ Google Stitch:**
```
Design a Main Layout template for Doctory clinic system in Arabic (RTL). Tailwind CSS.
Components:
- HTML5 structure with RTL direction (dir="rtl", lang="ar")
- Head with meta tags, Tailwind CDN, Cairo font import
- Body with guest navbar include, main content area (yield), footer include
- Flash messages area above main content
- Container with max-width and responsive padding
- Arabic (RTL), Cairo font
```

### تخطيط الضيف — Guest Layout
**الملف:** `views/layouts/guest-layout.ejs`  
**الاستخدام:** صفحات الضيوف (تسجيل دخول، تسجيل، نسيت كلمة مرور، إلخ)

**عناصر واجهة المستخدم:**
- Navbar مبسط للضيوف
- منطقة المحتوى المركزية

### تخطيط المريض — Patient Layout
**الملف:** `views/layouts/patient-layout.ejs`  
**الاستخدام:** صفحات المرضى

**عناصر واجهة المستخدم:**
- Sidebar للمريض (لوحة التحكم، مواعيدي، السجل الطبي، التقارير، الإعدادات، الإشعارات)
- Top Navbar مع جرس الإشعارات وصورة المستخدم

### تخطيط الطبيب — Doctor Layout
**الملف:** `views/layouts/doctor-layout.ejs`  
**الاستخدام:** صفحات الأطباء

**عناصر واجهة المستخدم:**
- Sidebar للطبيب (لوحة التحكم، الحجوزات المعلقة، قائمة الانتظار، الملخص السريري، التشخيص، الوصفة، حالة التحقق، المحفظة الشخصية)
- Top Navbar

### تخطيط المسؤول — Admin Layout
**الملف:** `views/layouts/admin-layout.ejs`  
**الاستخدام:** صفحات المسؤول

**عناصر واجهة المستخدم:**
- Sidebar للمسؤول (لوحة التحكم، التحقق من الأطباء، الأطباء، المرضى، المستخدمين، الحجوزات، قائمة الانتظار، الخدمات، سجل العمليات، طلبات الحذف)
- Top Navbar

### القطع المشتركة (Partials)
- `navbar-guest.ejs`: شريط navigate للضيوف
- `navbar-patient.ejs`: شريط navigate للمرضى
- `navbar-doctor.ejs`: شريط navigate للأطباء
- `navbar-admin.ejs`: شريط navigate للمسؤولين
- `sidebar-patient.ejs`: القائمة الجانبية للمرضى
- `sidebar-doctor.ejs`: القائمة الجانبية للأطباء
- `sidebar-admin.ejs`: القائمة الجانبية للمسؤولين
- `footer.ejs`: تذييل الصفحة
- `flash-messages.ejs`: رسائل النجاح/الخطأ
- `modal-confirm.ejs': نافذة تأكيد الحذف/الرفض
- `pagination.ejs`: ترقيم الصفحات
- `notification-bell.ejs`: جرس الإشعارات مع عداد

---

## 📊 ملخص سريع: عدد الصفحات حسب الفئة

| الفئة | عدد الصفحات | المسارات |
|-------|-------------|----------|
| الصفحات العامة (Guest) | 17 صفحة | `/`, `/about-us`, `/contact-us`, `/faq`, `/legal/privacy`, `/legal/terms`, `/refund`, `/auth/*`, `/doctors`, `/doctors/:id` |
| صفحات المريض (Patient) | 11 صفحة | `/patient/*`, `/book/:portfolioId`, `/notifications` |
| صفحات الطبيب (Doctor) | 10 صفحة | `/doctor/login`, `/doctor/dashboard`, `/doctor/bookings/*`, `/doctor/waiting-list`, `/doctor/visits/*`, `/doctor/verification-status`, `/doctor/portfolio` |
| صفحات المسؤول (Admin) | 15 صفحة | `/admin/dashboard`, `/admin/doctors/*`, `/admin/patients/*`, `/admin/users/*`, `/admin/bookings/*`, `/admin/waiting-list`, `/admin/services`, `/admin/audit-log`, `/admin/deletion-requests` |
| صفحات الأخطاء | 3 صفحات | `/403`, `/404`, `/500` |
| **الإجمالي** | **54 صفحة** | |

---

## 💡 نصائح للاستخدام مع Google Stitch

1. **ابدأ بالتخطيطات (Layouts):** صمّم `main-layout` أولًا، ثم البناؤين الفرعيين (patient, doctor, admin)
2. **الصمم بالتنسيق العربي (RTL):** تأكد من تحديد `dir="rtl"` و `lang="ar"` في كل تصميم
3. **استخدم Tailwind CSS:** جميع البروンبتمت written لـ Tailwind، يمكنك طلب من Stitch توليد HTML+native Tailwind
4. **الخطوط:** اطلب استخدام خط Cairo للغة العربية من Google Fonts
5. **الألوان:** استخدم التوزيع اللوني الموثق أعلاه (#0EA5E9 أساسي، #F8FAFC خلفية، إلخ)
6. **التصميم المتجاوب:** اطلب من Stitch جعل التصميم يعمل على mobile (320px+)، tablet (768px+)، desktop (1024px+)

---

**ملاحظة:** جميع الصفحات الحالية في مجلد `views/` هي ملفات Placeholder فارغة تحتوي على تعليق `<!-- TODO: implement [page name] view -->`. هذه البروンبتمت مخصصة لتوليد التصميم النهائي لكل صفحة ليتم تحويله لاحقًا إلى ملفات EJS فعلية.