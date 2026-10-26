// render

// dashboard
// doctors services
// accounts
// operations
// workspace doctor
// booking 
// reviews
// reports
// create admin



//apis
// GET
//  /dashboard
//  /booking?search=(doctor_name,total_patients)&q=&p=&s=&portfolio_id=optional&patient_id=optional&type=&status=&appointment_time=&appointment_date=&Isdefault=get current booking in this day
//  /accounts?search=(add role or any attre for user here and search [role,name,email,phone,address])&q=&p=&s=&user_id=&status=[pending,active,suspended]&date=&isEnaple2FA=
//  /reports?search=(name user ,description,medicines)&q=&p=&s=&user_id=optional
//  /doctors?search=(doctor_name,spechialty,title,phone_number)&q=&p=&s=&user_id=optionalCanGetFormInfoDoctor&working_hours=
//  /reviews?search=(userName,feedback)&q=&p=&s=&rating=&user_id=optional
//  /booking/:bookingItemsid?search=(patient_name,description,medicines,doctor_name)&q=&p=&s=
// POST
// /accounts create any account
// /accounts/:doctorid/approved
// /accounts/:doctorid/rejected
// /reports/:doctorId  generate report description and medicines replace doctor if need

// DELETE
// /report/:id
// /review/:id
// /account/:id
// /booking/:id
// /booking/patient/:bookingItemid deleted it from booking if need

// PUT&PATCH
// /report/:id update generating the report with ai take prompt and update it  
// /reviews/:id add rating and feedback
// /booking/:id type,total_patients
// /booking/patient/:BookingItemid type,status,name,patient_address,age,phone,
// /booking/patient/:BookingItemId/qr generate new qrcode as backend not take any data from frontend
// /account/:id can't change role from patent to doctor but change any thing in account