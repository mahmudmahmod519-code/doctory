# 📜 توثيق واجهات البرمجة (APIs) والصفحات (### Renders) - عطور أم القرى

`use the same template to create docs`

هذا المستند يوثق جميع نقاط النهاية (Endpoints) والصفحات المعروضة (Server-Side ### Rendering) في المنصة.


## template
---
## (name module)
### type (API) or (RENDER)
#### http method: (GET,POST,PATCH,PUT,DELETE,OPTIONS,TRACE,HEAD)
#### name : (name function in backend)
#### role : (guest,admin,doctor,pation,*)
#### description by arabic : ()
---

# EX

## 🔐 1. المصادقة (Auth)

### API
#### http method: POST
#### name: register
#### role: guest
#### desciption by arabic: إنشاء حساب مستخدم جديد (عميل) وحفظ البيانات مشفرة في قاعدة البيانات.

--------

### RENDER
#### page: /auth/login
#### name: login_render
#### role: guest
#### description: صفحة تسجيل الدخول تحتوي على حقول البريد وكلمة المرور ورابط "نسيت كلمة المرور" و "إنشاء حساب".
---------
