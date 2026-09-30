# flow business logic

`use the same template to create docs`

## EX

## auth

### auth flow
```bash

Guest يدخل /auth/login
    ↓
يدخل email + password
    ↓
POST /auth/api/v1/login
    ↓
Backend يتحقق من البيانات
    ↓
يولد JWT ويحفظه في HTTP-Only Cookie
    ↓
يرجع user data للـ Frontend
    ↓
Frontend يحدث الـ UI (يظهر زر Profile + Logout)

```

### سيناريوهات
- ✅ Login ناجح → cookie + redirect
- ❌ Login فاشل → رسالة خطأ
- 🔑 Forgot Password → email برابط → reset password
- 🚪 Logout → حذف cookie





===========================================

# 📊 2. عدد الصفحات (Pages Count)

## إجمالي الصفحات: 22 صفحة

```bash
|----|----------|--------------------|----------------------------|
|    |النوع     |الصفحة              |المسار                      |
|----|----------|--------------------|----------------------------|
|1   |Static    |الرئيسية            |/                           |
|2   |Static    |من نحن              |/about-us                   |
|3   |Static    |اتصل بنا            |/contact-us                 |
|4   |Static    |الأسئلة الشائعة     |/faq                        |
|5   |Static    |الخصوصية            |/privacy                    |
|6   |Static    |الشروط              |/terms                      |
|7   |Static    |الاسترجاع            |/refund                     |
|8   |Auth      |تسجيل الدخول        |/auth/login                 |
|9   |Auth      |التسجيل             |/auth/register              |
|10  |Auth      |نسيت كلمة المرور    |/auth/forgot-password       |
|11  |Auth      |إعادة التعيين       |/auth/reset-password/:token |
|12  |Shop      |قائمة العطور        |/perfumes                   |
|13  |Shop      |تفاصيل عطر          |/perfumes/:id               |
|14  |Shop      |تصنيف معين          |/categories/:slug           |
|15  |Shop      |تقييمات عطر         |/perfumes/:id/reviews       |
|16  |User      |الملف الشخصي        |/users/profile              |
|17  |User      |تعديل الملف         |/users/profile/edit         |
|18  |Orders    |السلة               |/orders/cart                |
|19  |Orders    |الدفع               |/orders/:id/payment         |
|20  |Orders    |رفع إيصال           |/orders/:id/upload-receipt  |
|21  |Orders    |سجل الطلبات         |/orders/profile/orders      |
|22  |Errors    |404 / 500           |  -                         |
|-----------------------------------------------------------------|
```
======================================================

# user flow

## guest
```bash
يدخل الموقع (/)
    ↓
يتصفح الصفحة الرئيسية (Best Sellers)
    ↓
يذهب لصفحات (About|      FAQ|        Privacy|       Terms|         Refund|         Contact)
    ↓
يذهب لـ /perfumes (قائمة العطور)
    ↓
يفلتر ويبحث
    ↓
يدخل على /perfumes/:id (تفاصيل عطر)
    ↓
يضغط "Add to Cart"
    ↓
⚠️ يظهر له "Please Login"
    ↓
يذهب لـ /auth/login
    ↓
يسجل دخول أو ينشئ حساب جديد
    ↓
يتحول لـ Customer Flow ↓
```

## customer

```bash

يسجل دخول (/auth/login)
    ↓
يدخل الموقع (/)
    ↓
يشوف: Login button → Profile button + Cart button
    ↓
يتصفح العطور (/perfumes)
    ↓
يدخل على عطر (/perfumes/:id)
    ↓
يضيف للسلة (Add to Order) ✅
    ↓
يذهب للسلة (/orders/cart)
    ↓
يعدل الكميات أو يحذف عناصر
    ↓
يضغط "Checkout"
    ↓
يختار طريقة الدفع:
    ├── InstaPay → يرفع إيصال (/orders/:id/upload-receipt)
    ├── Paymob → يدفع مباشرة (Iframe)
    └── Cash → يطلب عند الاستلام
    ↓
يذهب لـ /orders/profile/orders (سجل الطلبات)
    ↓
يشوف حالة طلبه (Pending/Processing/Shipped)
    ↓
يذهب لـ /users/profile
    ↓
يعدل بياناته أو كلمة المرور
    ↓
يذهب لـ /perfumes/:id/reviews
    ↓
يكتب تقييم على عطر اشتراه
    ↓
يسجل خروج (Logout)
```

## admin
```bash
يسجل دخول بحساب admin
    ↓
يدخل /admin/dashboard
    ↓
يشوف الإحصائيات
    ↓
يذهب لإدارة العطور (/perfumes/admin)
    ├── يضيف عطر جديد
    ├── يعدل عطر
    └── يحذف عطر (Soft Delete)
    ↓
يذهب لإدارة التصنيفات (/categories/admin)
    ├── يضيف تصنيف
    ├── يعدل تصنيف
    └── يحذف تصنيف
    ↓
يذهب لإدارة الماركات (/brands/admin)
    ├── يضيف ماركة
    ├── يعدل ماركة
    └── يحذف ماركة
    ↓
يذهب لإدارة الطلبات (/orders/admin)
    ├── يشوف كل الطلبات
    ├── يراجع إيصالات InstaPay
    ├── يوافق على طلب (يخصم المخزون)
    ├── يرفض طلب
    └── يحدّث حالة الشحن
    ↓
يذهب لإدارة المستخدمين (/users/admin/users)
    ├── يشوف المستخدمين
    └── يغير أدوارهم
    ↓
يذهب لإدارة التقييمات
    ├── يخفي تقييم مخالف
    └── يحذف تقييم
```


====================================


# Scenarios


## ✅ Scenario 1: شراء ناجح عبر Paymob


```bash
1. Customer يضيف عطور للسلة
2. يضغط Checkout → يختار Paymob
3. Backend يتكلم مع Paymob API → يأخذ payment_key
4. Frontend يفتح Iframe → العميل يدفع
5. Paymob يبعت Webhook → Backend يحدث الطلب + يخصم المخزون
6. Customer يشوف الطلب في سجله بحالة "Processing"
7. Admin يشوف الطلب ويحدّث الحالة لـ "Shipped"
```


## ✅ Scenario 2: شراء عبر InstaPay
```bash
1. Customer يضيف للسلة
2. Checkout → يختار InstaPay
3. Backend يغير الحالة لـ pending_approval
4. Customer يحوّل المبلغ ويرفع إيصال
5. Admin يراجع الإيصال ويوافق
6. Backend يخصم المخزون
```



## Scenario 3: فشل الدفع
```bash
1. Customer يحاول الدفع عبر Paymob
2. الدفع يفشل (رصيد غير كافٍ)
3. Webhook يرجع بـ success=false
4. Backend يرجع الطلب لحالة 'cart'
5. Customer يقدر يحاول تاني
```


## 🛑 Scenario 4: مخزون غير كافٍ
```bash
1. Customer يضيف عطر للسلة (مخزون = 5)
2. Customer آخر يشتري آخر 5 قطع
3. Customer الأول يحاول Checkout
4. Backend يرفض: "الكمية غير متوفرة"
5. Customer يعدل السلة
```


## ️ Scenario 5: سلة مهجورة (Cron Job)
```bash
1. Customer يضيف للسلة ويغادر الموقع
2. بعد 24 ساعة
3. Cron Job يشتغل (كل يوم 12 منتصف الليل)
4. يحذف كل orders بـ status='cart' عمرها > 24 ساعة
5. order_items تتمسح أوتوماتيك (CASCADE)
```


## Scenario 6: استعادة كلمة المرور
```bash
1. User ينسى كلمة المرور
2. يدخل /auth/forgot-password → يدخل إيميله
3. Backend يولد reset_token ويحفظه + expiry (ساعة)
4. يرسل إيميل بالرابط
5. User يضغط الرابط → /auth/reset-password/:token
6. يدخل كلمة مرور جديدة
7. Backend يتحقق من الرمز + الصلاحية → يحدث كلمة المرور
```

## ⚔️ Scenario 7: Admin يغير دور User
```bash
1. Admin يدخل /users/admin/users
2. يضغط "تغيير دور" على مستخدم
3. Backend يتحقق:
   - الأدمن مش بيغير دوره هو (أمان)
   - الدور الجديد valid (admin/customer)
4. يحدث role في DB
5. لو المستخدم كان online → الـ JWT القديم لسه شغال
   (يفضل نفس الدور لحد ما يعمل logout/login)
```
