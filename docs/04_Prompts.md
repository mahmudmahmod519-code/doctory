# Doctory — Admin Module Documentation  
## 4. Prompts

Two prompts, following the team's examples: a Google Stitch master prompt that generates all 16 admin pages with one design system, and a context prompt that gets any new member or AI tool up to speed on the admin module. The colors are a proposal because the docs define no Doctory brand colors.

---

### 4.1 Google Stitch master prompt (admin pages)

```
# Doctory Admin – Master Prompt for Google Stitch
# توليد كل صفحات الأدمن دفعة واحدة مع توحيد التصميم الكامل

---

## التعليمات الرئيسية للـ AI (اقرأها جيدًا قبل البدء)

أنت مصمم واجهات متخصص بخبرة +6 سنوات في لوحات التحكم (Admin Dashboards) للأنظمة الطبية.

مهمتك: توليد كل صفحات الأدمن التالية دفعة واحدة كمجموعة متناسقة تمامًا (Design System موحد).

### الثيم الموحد الإلزامي (على كل صفحة بدون استثناء)

Brand: Doctory (نظام طبيب) – نظام إدارة عيادات ذكي

الألوان (مقترحة، بدّلها لو عندكم هوية):
- Primary: Medical Teal #0F766E
- Secondary: Soft Mint #E6F4F1
- Background: Off-White #F7FAFC
- Text: Slate #0F172A
- Success #2E7D32 | Error #C62828 | Warning #F9A825

الخط: عربي عصري واضح (Tajawal أو Cairo أو IBM Plex Sans Arabic)
الاتجاه: Full RTL مع دعم الإنجليزية
الأسلوب: Clean Clinical، جداول واضحة، مساحات مريحة، Soft shadows، زوايا 12px

Status Badges (نفس الألوان في كل الصفحات):
- pending = Warning
- active / accepted / approved / completed = Success
- rejected / cancelled / suspended = Error
- expired / deleted = رمادي

### الحركة والانتقالات (إلزامية)
- السرعة 300ms – 450ms مع ease-out
- الأزرار: scale(1.02) + ظل أقوى عند hover
- صفوف الجداول: تظليل ناعم عند hover
- Modals و Drawers: fade + scale من 0.95
- لا Bounce ولا اهتزاز
- Loading: Skeleton shimmer

### التجاوب (Responsive)
- Desktop أولًا لأنها لوحة تحكم، ثم Tablet و Mobile
- Breakpoints: Mobile (<768px) | Tablet (768-1024px) | Desktop (>1024px)
- على الموبايل: الجداول تتحول إلى بطاقات، الفالتر يتحول إلى Drawer، Sidebar يتحول إلى Bottom Sheet

### الـ Layout المشترك
- Sidebar ثابت: Dashboard، التحقق من الدكاترة، الدكاترة، المرضى، المستخدمون والأدمنز، الحجوزات، قائمة الانتظار، خدمات الدكاترة، سجل العمليات، طلبات الحذف
- Top bar: Breadcrumbs + اسم الأدمن + Logout
- مكونات مشتركة متطابقة: كارت إحصائية، جدول (قائمة + Pagination + ترتيب + إجراءات للصف)، لوحة فالتر، Confirm Dialog (مع حقل سبب عند الرفض)، Toast، حالات Loading / Empty / Error، Tabs، Date Picker، Doctor Picker

### User Flow (فقط للأدمن)
Login (صفحة مشتركة، مش مطلوب تصميمها) → 2FA → /admin/dashboard → التحقق من الدكاترة / الدكاترة / المرضى / المستخدمون / الحجوزات / قائمة الانتظار / الخدمات / سجل العمليات / طلبات الحذف → Logout

---

## قائمة الصفحات المطلوبة (16 صفحة)

1. Dashboard /admin/dashboard
2. التحقق من الدكاترة /admin/doctors/verification
3. تفاصيل التحقق /admin/doctors/verification/:id
4. الدكاترة /admin/doctors
5. بروفايل دكتور /admin/doctors/:id
6. المرضى /admin/patients
7. بروفايل مريض /admin/patients/:id
8. المستخدمون والأدمنز /admin/users
9. تفاصيل مستخدم /admin/users/:id
10. الحجوزات (فحوصات واستشارات) /admin/bookings
11. تفاصيل حجز /admin/bookings/:id
12. قائمة الانتظار /admin/waiting-list
13. خدمات الدكاترة /admin/services
14. سجل العمليات /admin/audit-log
15. طلبات الحذف /admin/deletion-requests
16. صفحات الأخطاء 403 / 404 / 500

---

## تفاصيل كل صفحة (يجب الالتزام بها)

### 1. Dashboard
- كروت: المرضى، الدكاترة (فعّال / معلق / موقوف)، حجوزات اليوم، المنتظرين اليوم، طلبات التحقق، طلبات الحذف
- رسم خطي: الحجوزات لكل يوم مع اختيار فترة
- رسم أعمدة: الحجوزات حسب النوع والحالة، وأكتر التخصصات حجزًا
- جدول صغير: آخر 5 دكاترة معلقين، وقائمة آخر 10 عمليات

### 2-3. التحقق من الدكاترة
- جدول: الاسم، الإيميل، التخصص، تاريخ الطلب، رقم المحاولة
- صفحة التفاصيل: صورة الـ Medical ID كبيرة Zoom بجانبها بيانات الدكتور
- زر Approve (Confirm) وزر Reject يفتح نافذة بحقل سبب إجباري
- بعد القرار: Badge للحالة والأزرار معطلة

### 4-5. الدكاترة وبروفايل دكتور
- جدول: رقم الدكتور، الاسم، التخصص، الإيميل، الحالة، عدد الجلسات، عدد المرضى
- البروفايل: هيدر (صورة، اسم، تخصص، رقم الدكتور، حالة) + Tabs: المرضى / الجلسات / الخدمات + زر قائمة الانتظار

### 6-7. المرضى وبروفايل مريض
- شريط بحث (اسم / تليفون / إيميل) + لوحة فالتر: فئة عمرية (أطفال / بالغين / كبار السن)، دكتور، تخصص، حالة الحجز، العنوان، تاريخ التسجيل، عنده تقرير، إظهار المحذوفين
- Chips للفالتر النشطة + زر Reset
- جدول: الاسم، التليفون، السن، العنوان، الحالة، عدد الحجوزات، آخر حجز
- البروفايل: بيانات المريض + جدول تاريخ الحجوزات + عدد التقارير فقط

### 8-9. المستخدمون والتحكم في الدخول
- Tabs: الكل / الأدمنز / الدكاترة / المرضى، وزر إضافة مستخدم يفتح Drawer (دور، اسم، إيميل، تليفون)
- قائمة إجراءات الصف: تعديل، تغيير الدور، تفعيل / إيقاف، حذف، استرجاع
- صفحة التفاصيل: كارت الحساب (الدور، الحالة، 2FA، آخر دخول) + لوحة Login Control (Force Logout، إرسال رابط Reset Password، Reset 2FA، إيقاف) + منطقة خطر للحذف

### 10-11. الحجوزات
- Tabs: فحوصات / استشارات / الكل، وفالتر (دكتور، حالة، تاريخ)
- جدول: رقم، دكتور، نوع، تاريخ، ميعاد، محجوز / إجمالي، حالة
- التفاصيل: هيدر الجلسة + جدول المرضى (رقم الدور، الاسم، التليفون، السن، الحالة) مع تعديل وحذف واسترجاع

### 12. قائمة الانتظار
- شريط علوي: Doctor Picker (بحث بالاسم أو الرقم) + Date Picker (الافتراضي اليوم) + تبديل النوع
- عدادات: منتظر / خلص / اتشال
- مجموعة المنتظرين: رقم الدور، الاسم، دقائق الانتظار، الوقت المتوقع
- مجموعة الخالصين: رقم الدور، الاسم، وقت الإنهاء
- مجموعة المشالين: باهتة اللون مع السبب وزر استرجاع

### 13. خدمات الدكاترة
- Tabs: معلقة / مفعّلة / مرفوضة، جدول: العنوان، الدكتور، السعر، المدة، الحالة
- أزرار موافقة / رفض (سبب) / تعديل

### 14. سجل العمليات
- فالتر (نوع العملية، منفذ العملية، تاريخ) + جدول للقراءة فقط + صف قابل للتوسيع يعرض الـ metadata

### 15. طلبات الحذف
- جدول: المريض (اسم مقنّع)، تاريخ الطلب، الحالة + نافذة موافقة / رفض بسبب

### 16. الأخطاء
- تصميم أنيق مع الشعار + رسالة واضحة + زر الرجوع للـ Dashboard

---

## ملاحظات نهائية مهمة للـ AI

1. التناسق أولًا: كل الصفحات من نفس العائلة (نفس الألوان والأزرار والمسافات والحركات).
2. ابدأ بالـ Design System (Sidebar، Top bar، الفالتر، الجداول، Badges، Dialogs) ثم طبقه على كل الصفحات.
3. كل صفحة فيها حالات Loading / Empty / Error / Success.
4. استخدم بيانات تجريبية واقعية بأسماء مصرية بدل النصوص العشوائية.
5. التزم بالقائمة أعلاه فقط. لا تخترع صفحات إضافية.
6. صمم نسخة Desktop ونسخة Mobile لكل صفحة.

ابدأ الآن بتوليد المجموعة الكاملة.
```

---

### 4.2 Context prompt for team members and AI tools

```
أنت مطور Full-Stack بتشتغل على جزء الأدمن في منصة Doctory (نظام طبيب)، نظام إدارة عيادات ذكي: المريض يحجز فحص أو استشارة، والدكتور يقبل أو يرفض، والأدمن يتحكم في النظام. الـ AI في المشروع أداة مساعدة بس، والقرار الطبي للدكتور.

## التقنيات المستخدمة
- Backend: Node.js + Express 5 (CommonJS)
- Database: MySQL عبر TypeORM (synchronize = false، تشغيله ممنوع)
- Auth: JWT (Access + Refresh) في HTTP-only Cookies، و2FA إجباري للدكتور والأدمن
- Validation: Joi، Uploads: Multer، Email: Nodemailer، Jobs: node-cron
- Docker و Docker Compose

## فلسفة المعمارية
1. فصل الـ Renders عن الـ APIs: الـ Render بيعرض الصفحة ويمرر حالة المستخدم (checkLogin) بس، والـ API بيرجع JSON والـ Frontend بيعمل fetch.
2. هيكل الملفات: routes/module/index.js يوجه لـ module.apis.js و module.render.js، والـ controllers في logicModels/module/.
3. كل مسار /api/admin/* محمي بـ auth.js ثم roles(admin) من middlewares/roles.js.
4. الـ Validation بـ Joi في validate.js، والأخطاء بـ catchError wrapper من utils/catchError.js.
5. كل عملية كتابة للأدمن بتتسجل في audit_logs (insert-only).

## قواعد البيانات المهمة
- مفيش جدول doctors: الدكتور = users (role = doctor) + doctor_portfolios.
- الـ API بيستخدم UUID (users.user_id و doctor_portfolios.portfolio_id و doctor_works.work_id)، مش الـ INT id. الـ bookings و booking_items ليهم INT id بس.
- كل الـ Foreign Keys بـ ON DELETE CASCADE، فالحذف من الأدمن دايمًا Soft Delete عن طريق deleted_at. الحذف النهائي بس لطلبات حذف البيانات المعتمدة.
- bookings.type: booking = فحص، consulting = استشارة.
- حالات booking_items: pending / accepted / rejected / completed.

## الأدوار
- guest: صفحات عامة
- patient: يحجز ويشوف تقاريره
- doctor: يدير الحجوزات والتقارير بعد موافقة الأدمن
- admin: يتحقق من الدكاترة، يدير اليوزرز والحجوزات والخدمات وقوائم الانتظار، ويقرأ الـ Audit Log

## قواعد حماية الأدمن
- الأدمن مش بيغير دوره نفسه ولا يوقفها ولا يحذفها (403).
- آخر أدمن فعّال لا يتحذف ولا يتوقف (409).
- تغيير الدور أو إيقاف الحساب بيلغي الـ Refresh Tokens.
- الأدمن مش بيشوف الباسورد ولا محتوى التقارير الطبية.

## المطلوب منك
نفّذ الجزء المطلوب في docs/backend/README_APIs.md (القالب: type / http method / path / name / role / description by arabic)، بدون ما تخالف القواعد أعلاه، وحدّث docs/database/ لو غيرت أي جدول.
```

---

