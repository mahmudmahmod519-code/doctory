
# pages

`use the same template to create docs`


## 📌 Template لكل صفحة:

```bash
PAGE: [اسم الصفحة]
PATH: [المسار]
ROLE: [مين يدخلها]
PURPOSE: [الهدف]
STATE: [checkLogin data]
APIS: [الـ APIs المستخدمة]
UI COMPONENTS: [المكونات]
STATES: [loading/empty/error/success]
ACTIONS: [الإجراءات المتاحة]
REDIRECTS: [التوجيهات]
```


-------
## EX 

### الصفحه الرأيسيه
```bash
PAGE: Home Page
PATH: /
ROLE: * (الجميع)
PURPOSE: عرض العطور المميزة وأحدث الإضافات
STATE: { currentUser, login, status }
APIS: 
  - GET /perfumes/api/v1?is_best_seller=true&limit=6
  - GET /perfumes/api/v1?sort_by=created_at&limit=8
UI COMPONENTS:
  - Hero section مع CTA
  - Best Sellers grid
  - Latest perfumes grid
  - Features section (شحن، أصالة، استرجاع)
STATES:
  - loading: spinner
  - empty: "لا توجد منتجات حالياً"
  - error: "فشل في تحميل المنتجات"
  - success: عرض المنتجات
ACTIONS:
  - Guest: تصفح، بحث، تسجيل دخول
  - Customer: إضافة للسلة
  - Admin: نفس الـ customer + زر admin panel
REDIRECTS:
  - /auth/login (لو guest ضغط Add to Cart)
  - /perfumes/:id (عند الضغط على عطر)
```

