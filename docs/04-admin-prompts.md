# Admin / AI Prompt Documentation

## AI Appointment Recommendation

### Purpose

مساعدة الـ Patient في اختيار التخصص والطبيب والموعد المناسب بناءً على
الأعراض والوقت المطلوب.

### Inputs

-   Patient Data
-   Symptoms
-   Preferred Date
-   Preferred Time
-   Doctor Data
-   Available Appointments

### AI Responsibilities

1.  فهم وصف الأعراض.
2.  تحديد التخصص الطبي المناسب.
3.  مطابقة بيانات الأطباء المتاحين.
4.  البحث عن المواعيد المتاحة.
5.  عرض الخيارات المناسبة للمريض.
6.  عدم إنشاء الحجز قبل تأكيد المريض.

### Example Input

Patient:

"أنا حاسس بوجع في ضهري احجز معاد للدكتور يوم الخميس بعد الساعة 7"

### Expected AI Response

"في معاد لدكتور أحمد، طبيب عظام، يوم الخميس الساعة 8:30 مساءً. الحجز 200
جنيه. هل تريد تأكيد الحجز؟"

### Confirmation

Patient:

"تمام احجز"

↓

Backend creates booking.

### Important Rule

الـ AI يقوم بالتحليل والاقتراح فقط. إنشاء الـ Booking يتم من الـ Backend
بعد تأكيد المريض، وليس بمجرد اقتراح الموعد.

------------------------------------------------------------------------

## Manual Appointment Logic

Patient\
↓\
Browse medical specialties or doctors\
↓\
Select specialty / doctor\
↓\
System displays available dates and times\
↓\
Patient selects appointment\
↓\
System checks missing personal information\
↓\
Patient confirms\
↓\
Create booking\
↓\
Queue Number + QR Code

------------------------------------------------------------------------

## AI Data Requirements

### Doctor Data

يحتاج الـ AI إلى بيانات الأطباء المتاحة للمطابقة، مثل:

-   Doctor
-   Specialty
-   Available appointments
-   Appointment time
-   Appointment price

### Patient Data

يستخدم النظام بيانات المريض المتاحة من عملية Sign Up عند توفرها.

إذا كانت بيانات مطلوبة للحجز غير موجودة، يتم طلبها من المريض قبل إتمام
الحجز.

------------------------------------------------------------------------

## Prompt Safety / Business Rules

-   لا يتم تنفيذ الحجز قبل تأكيد المريض.
-   لا يتم اقتراح موعد غير متاح.
-   يجب أن يعتمد اختيار الموعد على بيانات Availability القادمة من
    النظام.
-   لا يقوم الـ AI بتغيير بيانات الطبيب أو المريض.
-   إنشاء وتعديل الـ Booking مسؤولية الـ Backend.
-   الـ AI لا يعتبر نفسه مصدرًا لبيانات المواعيد؛ البيانات تأتي من
    النظام.

------------------------------------------------------------------------

## Documentation Note

الـ source الحالي يحدد فكرة AI Appointment Flow لكنه لا يحدد اسم Prompt
النهائي ولا API endpoints الخاصة بالـ AI أو Appointment Availability.
لذلك يجب اعتماد النص النهائي والـ endpoints مع فريق الـ Backend/AI قبل
اعتبارها official implementation.
