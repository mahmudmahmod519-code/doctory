# Graph Report - doctory  (2026-11-22)

## Corpus Check
- 233 files · ~82,957 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 4, .example 1, .dev 1)

## Summary
- 1203 nodes · 1191 edges · 234 communities (76 shown, 158 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dbe7e992`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- logicModels/static/static.render.js
- Backend Routes & APIs Documentation — Read-Only Audit
- Patient Pages
- validation.js
- app
- تفاصيل كل صفحة (يجب الالتزام بها)
- services
- Collections
- 1. Pages Documentation
- 2.10 سيناريوهات
- API
- User.controller.js
- 🗺️ Doctory — System Diagrams & Animation Prompts
- Scenarios
- Consultation
- moduleName.controller.js
- mongo
- Doctor Module — Pages
- 9.1 View pending Doctors
- package.json
- 🏥 Doctory — AI-Powered Smart Clinic System (نظام عيادات ذكي)
- database.js
- 3. API Documentation
- ✅ Checklist
- server-config.js
- mongoose
- factories.js
- seed
- dependencies
- 1.1 Patient Registration
- Patient Scenario
- Doctor Module — API
- 4.2 Access Token expires
- helpers/auth.js
- ⚙️ Environment Variables
- Auth_Final.md
- payment.js
- 7. Forgot Password — From Login Page
- Doctor Module — Flow
- upload.js
- RefreshToken.entity.js
- scripts
- Doctor Module — UI Design Prompt
- 0. Main Site and Sign Up Flow
- 🔌 APIs
- 🤖 AI Scheduling Prediction
- prompt to explain it for any member can't know any thing send it
- 3.1 How 2FA works
- 5. Current User
- 8. Change Password — From Settings
- train.py
- 📋 Scenarios
- db.js
- register-doctor.ejs
- 4. Prompts
- pages
- 11. Extra Common Scenarios
- 2. Login
- 6. Logout
- joi
- 📄 Pages
- 🚀 Running the Project
- Patient User Flow
- helmet.js
- 🔔 Notifications Policy
- env-config.js
- mainPageDoc.md
- ai
- depends_on
- 🎯 Project Overview
- environment
- static/index.js
- auth.test.js
- mailer.js
- BookingItem.entity.js
- DoctorPortfolio.entity.js
- DoctorWork.entity.js
- ref_crypto
- User.entity.js
- ml/README.md
- app
- healthcheck
- seed
- 🔗 Page-to-API Index
- build
- aiService.mock.js

## God Nodes (most connected - your core abstractions)
1. `🏥 Doctory — AI-Powered Smart Clinic System (نظام عيادات ذكي)` - 25 edges
2. `mongoose` - 18 edges
3. `تفاصيل كل صفحة (يجب الالتزام بها)` - 18 edges
4. `🗺️ Doctory — System Diagrams & Animation Prompts` - 17 edges
5. `✅ Checklist` - 16 edges
6. `1. Pages Documentation` - 16 edges
7. `Doctor Module — Pages` - 15 edges
8. `Backend Routes & APIs Documentation — Read-Only Audit` - 14 edges
9. `🤖 AI Scheduling Prediction` - 13 edges
10. `3. API Documentation` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Docker` --references--> `seed()`  [INFERRED]
  README.md → scripts/seed.js
- `2.1 Entry Point` --references--> `connectDB()`  [INFERRED]
  BACKEND_API_DOCUMENTATION.md → config/database.js
- `🤝 Contributing` --references--> `main()`  [INFERRED]
  README.md → ml/data/generate_synthetic.py
- `6.3 Fields Returned to Frontend (Safe User Object)` --references--> `safeUser()`  [INFERRED]
  BACKEND_API_DOCUMENTATION.md → logicModels/User/User.controller.js
- `5.2.1 PATCH /api/user/profile — Update User Profile` --references--> `updateProfile()`  [INFERRED]
  BACKEND_API_DOCUMENTATION.md → logicModels/User/User.controller.js

## Import Cycles
- None detected.

## Communities (234 total, 158 thin omitted)

### Community 0 - "logicModels/static/static.render.js"
Cohesion: 0.06
Nodes (29): 5.1.1 GET / — Home Page, 5.1.2 GET /about-us — About Page, 5.1.3 GET /contact-us — Contact Page, 5.1.4 GET /faq — FAQ Page, 5.1.5 GET /privacy — Privacy Policy, 5.1.6 GET /terms — Terms & Conditions, 5.1.7 GET /refund — Refund Policy, 5.1 Static Pages (Implemented) (+21 more)

### Community 1 - "Backend Routes & APIs Documentation — Read-Only Audit"
Cohesion: 0.04
Nodes (45): 10.1 Critical Missing APIs, 10.2 Partially Missing, 10.3 Inconsistencies, 10. Missing or Incomplete APIs, 11.1 Route Mounting, 11.2 Authentication, 11.3 Database, 11.4 AI Scheduling Prediction (+37 more)

### Community 2 - "Patient Pages"
Cohesion: 0.05
Nodes (43): 1. Patient Dashboard, 2. Waiting Queue, 3. Turn Notification, 4. First Decline Warning, 5. Appointment Cancelled, 6. Doctor - Patient Medical History, 7. Doctor Consultation, 8. Prescription (+35 more)

### Community 3 - "validation.js"
Cohesion: 0.04
Nodes (41): router, router, router, bookingItemIdParamSchema, changePasswordSchema, createBookingItemSchema, createBookingSchema, createDeletionRequestSchema (+33 more)

### Community 4 - "app"
Cohesion: 0.05
Nodes (37): build, container_name, depends_on, env_file, environment, networks, ports, restart (+29 more)

### Community 5 - "تفاصيل كل صفحة (يجب الالتزام بها)"
Cohesion: 0.05
Nodes (36): 12. قائمة العطور `/perfumes`, 13. تفاصيل العطر `/perfumes/:id`, 14. تصنيف `/categories/:slug`, 15. التقييمات, 16-17. الملف الشخصي وتعديله, 18. سجل الطلبات, 19. السلة, 1. الصفحات الثابتة (Static) (+28 more)

### Community 6 - "services"
Cohesion: 0.29
Nodes (6): driver, networks, doctory_net, services, volumes, mongo_data_dev

### Community 7 - "Collections"
Cohesion: 0.09
Nodes (22): 10. `notifications` — `Notification.entity.js` ✅, 1. Create Database and Collections, 1. `users` — `User.entity.js` ✅, 2. `doctorportfolios` — `DoctorPortfolio.entity.js` ✅, 2. Seed Sample Data (Optional), 3. `doctorworks` — `DoctorWork.entity.js` ✅, 3. Verify Collections, 4. `bookings` — `Booking.entity.js` ✅ (+14 more)

### Community 8 - "1. Pages Documentation"
Cohesion: 0.09
Nodes (22): 0. Scope, Assumptions and DB Gaps, 1.10 Bookings (Exams & Consultations), 1.11 Booking Details, 1.12 Waiting List, 1.13 Doctor Services, 1.14 Deletion Requests (proposed), 1.15 Error pages, 1.1 Dashboard (+14 more)

### Community 9 - "2.10 سيناريوهات"
Cohesion: 0.09
Nodes (22): 2.10 سيناريوهات, 2.1 Admin flow (main journey), 2.2 Login flow (admin), 2.3 Doctor verification flow, 2.4 User management flow, 2.5 Login control flow, 2.6 Patients search and filter flow, 2.7 Waiting list flow (+14 more)

### Community 10 - "API"
Cohesion: 0.10
Nodes (19): 🔐 1. المصادقة (Auth), API, desciption by arabic: إنشاء حساب مستخدم جديد (عميل) وحفظ البيانات مشفرة في قاعدة البيانات., description: صفحة تسجيل الدخول تحتوي على حقول البريد وكلمة المرور ورابط "نسيت كلمة المرور" و "إنشاء حساب"., EX, http method: (GET,POST,PATCH,PUT,DELETE,OPTIONS,TRACE,HEAD), http method: POST, name: login_render (+11 more)

### Community 11 - "User.controller.js"
Cohesion: 0.13
Nodes (19): 5.2.1 PATCH /api/user/profile — Update User Profile, 5.2.2 DELETE /api/user/account — Soft Delete Account, 5.2.3 POST /api/user/upload-image — Upload Profile Image, 5.2.4 POST /api/user/2fa/enable — Enable Two-Factor Authentication, 5.2.5 POST /api/user/2fa/disable — Disable Two-Factor Authentication, 5.2.6 POST /api/user/change-role — Request Role Change, 5.2 User Profile APIs (Controller Implemented, Route Wiring Incomplete), 6.1 Entity Summary (+11 more)

### Community 12 - "🗺️ Doctory — System Diagrams & Animation Prompts"
Cohesion: 0.11
Nodes (18): 10. Waiting List Management Flow (Scenario 4), 11. Data Deletion Request Flow — Law 151/2020 (Scenario 5), 12. Notification System Flow (Cross-Cutting), 13. Mongoose vs Previous Architecture (Migration Note Diagram), 1. Full System Architecture Diagram, 2. Entity-Relationship (ER) Diagram, 3. Authentication & 2FA Sequence Diagram, 4. Role-Based Access Control (RBAC) Matrix (+10 more)

### Community 13 - "Scenarios"
Cohesion: 0.10
Nodes (19): 📊 2. عدد الصفحات (Pages Count), admin, auth, auth flow, customer, EX, flow business logic, guest (+11 more)

### Community 14 - "Consultation"
Cohesion: 0.11
Nodes (17): Consultation, Consultation, GET /patients/:patientId/allergies, GET /patients/:patientId/medical-history, GET /patients/:patientId/medications, GET /queue/:bookingItemId, Medical History, PATCH /consultations/:id (+9 more)

### Community 15 - "moduleName.controller.js"
Cohesion: 0.18
Nodes (5): bcrypt, crypto, jwt, bcrypt@^6.0.0, bcrypt

### Community 16 - "mongo"
Cohesion: 0.18
Nodes (11): MONGO_INITDB_DATABASE, MONGO_INITDB_ROOT_PASSWORD, MONGO_INITDB_ROOT_USERNAME, container_name, environment, image, networks, ports (+3 more)

### Community 17 - "Doctor Module — Pages"
Cohesion: 0.12
Nodes (15): Doctor Module — Pages, P-01 — Doctor Login, P-02 — Doctor Dashboard, P-03 — Pending Bookings, P-04 — Booking Details, P-05 — Waiting List, P-06 — Patient Visit / Clinical Summary, P-07 — Diagnosis Editor (+7 more)

### Community 18 - "9.1 View pending Doctors"
Cohesion: 0.12
Nodes (16): 9.1 View pending Doctors, 9.2 Approve Doctor, 9.3 Reject Doctor, 9. Doctor Verification, Common errors, Common errors, Common errors, Endpoint (+8 more)

### Community 19 - "package.json"
Cohesion: 0.13
Nodes (15): allowScripts, bcrypt@6.0.0, author, description, devDependencies, nodemon@^3.1.0, directories, doc (+7 more)

### Community 20 - "🏥 Doctory — AI-Powered Smart Clinic System (نظام عيادات ذكي)"
Cohesion: 0.12
Nodes (16): 📝 API Documentation Template, Architectural Pattern, 🔐 Authorization Rules, 📊 Current Implementation Status, 🗄️ Database, 🏥 Doctory — AI-Powered Smart Clinic System (نظام عيادات ذكي), ERD, 📄 License (+8 more)

### Community 21 - "database.js"
Cohesion: 0.17
Nodes (13): 2.1 Entry Point, 2.2 Global Middleware, 2.3 Route Registration, 2.4 Route Prefix Rules, 2. Application Entry Point and Routing Configuration, attachConnectionEvents(), buildMongoUri(), connectDB() (+5 more)

### Community 22 - "3. API Documentation"
Cohesion: 0.14
Nodes (13): 3. API Documentation, Admin – Bookings (Exams & Consultations), Admin – Dashboard, Admin – Deletion Requests (proposed), Admin – Doctor Services, Admin – Doctor Verification, Admin – Doctors, Admin – Pages (RENDER) (+5 more)

### Community 23 - "✅ Checklist"
Cohesion: 0.12
Nodes (16): AI Integration — ❌ Not implemented, AI Scheduling Prediction — ❌ Not implemented, Authentication — ❌ Not implemented, ✅ Checklist, Controllers & Renders — ❌ Not implemented, Data Layer — ✅ Complete, Feature Modules — ❌ Not implemented, Infrastructure — ✅ Complete (+8 more)

### Community 24 - "server-config.js"
Cohesion: 0.14
Nodes (11): cookieParser, express, path, fs, logDir, logFile, path, cookie-parser@^1.4.7 (+3 more)

### Community 25 - "mongoose"
Cohesion: 0.17
Nodes (8): deletionRequestSchema, mongoose, mongoose, predictionLogSchema, mongoose, reviewSchema, mongoose, mongoose

### Community 26 - "factories.js"
Cohesion: 0.22
Nodes (5): bookingSchema, mongoose, createUser(), createDoctor(), crypto

### Community 27 - "seed"
Cohesion: 0.18
Nodes (9): mongoose, notificationSchema, mongoose, reportSchema, bcrypt, buildMongoUri(), crypto, mongoose (+1 more)

### Community 28 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, dotenv@^18.0.3, ejs@^6.0.1, mongodb@^7.7.0, mongoose@^9.11.2, node-cron@^4.6.0, speakeasy@^2.0.0, dotenv (+4 more)

### Community 29 - "1.1 Patient Registration"
Cohesion: 0.17
Nodes (12): 1.1 Patient Registration, 1.2 Doctor Registration, 1. User Registration, Common errors, Common errors, Endpoint, Endpoint, Required data (+4 more)

### Community 30 - "Patient Scenario"
Cohesion: 0.17
Nodes (11): Actor, Case 1: Patient Confirms, Case 2: Patient Declines for the First Time, Case 3: Patient Declines for the Second Time, Goal, If Patient Confirms, If Patient Declines Twice, Main Scenario (+3 more)

### Community 31 - "Doctor Module — API"
Cohesion: 0.20
Nodes (9): Accept Booking, Doctor Module — API, Illustrative Request, Illustrative Success Response, Proposed Endpoints, Questions to Confirm, Reject Booking, Security and Validation (+1 more)

### Community 32 - "4.2 Access Token expires"
Cohesion: 0.20
Nodes (10): 4.1 Normal protected request, 4.2 Access Token expires, 4.3 When does the Refresh Token become invalid?, 4. Access Token and Refresh Token, Common errors, Endpoint, Result, Scenario (+2 more)

### Community 33 - "helpers/auth.js"
Cohesion: 0.43
Nodes (6): authCookie(), authHeaders(), bcrypt, crypto, jwt, signAccessToken()

### Community 34 - "⚙️ Environment Variables"
Cohesion: 0.20
Nodes (10): Admin & Logging, AI (planned), Authentication & Security, CORS, Database (MongoDB only), Email (Nodemailer — critical events only), ⚙️ Environment Variables, Redis (planned — not implemented) (+2 more)

### Community 35 - "Auth_Final.md"
Cohesion: 0.22
Nodes (8): 10. Authorization, 12. Pages / Screens We Need, 13. Authentication Endpoints Summary, Authenticated but not allowed, Authenticated pages, Authentication & Authorization, Not authenticated, Public pages

### Community 36 - "payment.js"
Cohesion: 0.31
Nodes (6): crypto, getPaymentKey(), getPaymobAuthToken(), https, httpsRequest(), registerOrder()

### Community 37 - "7. Forgot Password — From Login Page"
Cohesion: 0.25
Nodes (8): 7. Forgot Password — From Login Page, Common errors, Common errors, Request reset, Reset password, Scenario, Success, Success

### Community 38 - "Doctor Module — Flow"
Cohesion: 0.25
Nodes (7): 1. Login and Access, 2. Booking Approval, 3. Waiting List and Clinical Work, 4. AI Decision Support, 5. Key Rules, 6. Unresolved Rule, Doctor Module — Flow

### Community 39 - "upload.js"
Cohesion: 0.25
Nodes (7): fs, multer, path, storage, uploadDir, multer@^2.4.0, multer

### Community 40 - "RefreshToken.entity.js"
Cohesion: 0.29
Nodes (5): mongoose, refreshTokenSchema, cleanupExpiredRefreshTokens(), cron, registerCronJobs()

### Community 41 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, dev, lint, migrate, migrate:revert, seed, start, test

### Community 42 - "Doctor Module — UI Design Prompt"
Cohesion: 0.29
Nodes (6): Doctor Module — UI Design Prompt, Expected Output, Integration, Permissions and Safety, Screens, Visual Requirements

### Community 43 - "0. Main Site and Sign Up Flow"
Cohesion: 0.29
Nodes (7): 0.1 Main Site / Home Page, 0.2 Sign Up Options Page, 0.3 Choose Account Type, 0. Main Site and Sign Up Flow, Scenario, Scenario, Scenario

### Community 44 - "🔌 APIs"
Cohesion: 0.29
Nodes (7): 🛡️ Admin APIs — 📋 Planned, API Rules, 🔌 APIs, 🔐 Authentication APIs — 📋 Planned, 👨‍⚕️ Doctor APIs — 📋 Planned, 🔔 Notification APIs — 📋 Planned, 🏥 Queue & Consultation APIs — 📋 Planned

### Community 45 - "🤖 AI Scheduling Prediction"
Cohesion: 0.12
Nodes (15): 🤖 AI Scheduling Prediction, Allowed Feature Groups, Configuration, Data Contract, Explicit Non-Goals, High-Risk Booking Policy, Node.js Backend Integration, Overview (+7 more)

### Community 46 - "prompt to explain it for any member can't know any thing send it"
Cohesion: 0.33
Nodes (5): prompt to explain it for any member can't know any thing send it, الأدوار (Roles):, التقنيات المستخدمة:, الفلسفة المعمارية (Architecture Philosophy):, الميزات الرئيسية:

### Community 47 - "3.1 How 2FA works"
Cohesion: 0.33
Nodes (6): 2FA rules, 3.1 How 2FA works, 3. 2FA, Common errors, Endpoint, Success

### Community 48 - "5. Current User"
Cohesion: 0.33
Nodes (6): 5. Current User, Common errors, Endpoint, Response, Scenario, Success

### Community 49 - "8. Change Password — From Settings"
Cohesion: 0.33
Nodes (6): 8. Change Password — From Settings, Common errors, Endpoint, Important difference, Scenario, Success

### Community 50 - "train.py"
Cohesion: 0.07
Nodes (18): generate_row(), main(), health(), model_info(), predict(), get_loaded_versions(), is_ready(), load_model() (+10 more)

### Community 51 - "📋 Scenarios"
Cohesion: 0.33
Nodes (6): Scenario 1 — Patient Booking and Consultation, Scenario 2 — Doctor Verification, Scenario 3 — Admin User Management, Scenario 4 — Waiting List, Scenario 5 — Data Deletion Request (Law 151/2020), 📋 Scenarios

### Community 53 - "register-doctor.ejs"
Cohesion: 0.53
Nodes (4): clearError(), clearFileSelection(), handleFile(), showError()

### Community 54 - "4. Prompts"
Cohesion: 0.40
Nodes (4): 4.1 Google Stitch master prompt (admin pages), 4.2 Context prompt for team members and AI tools, 4. Prompts, Doctory — Admin Module Documentation

### Community 55 - "pages"
Cohesion: 0.40
Nodes (4): EX, pages, 📌 Template لكل صفحة:, الصفحه الرأيسيه

### Community 56 - "11. Extra Common Scenarios"
Cohesion: 0.40
Nodes (5): 11.1 User tries to access a protected page without being logged in, 11.2 Patient tries to access an Admin endpoint, 11.3 Doctor is still PENDING, 11.4 Refresh Token is invalid, 11. Extra Common Scenarios

### Community 57 - "2. Login"
Cohesion: 0.40
Nodes (5): 2. Login, Common errors, Endpoint, Scenario, Success

### Community 58 - "6. Logout"
Cohesion: 0.40
Nodes (5): 6. Logout, Common errors, Endpoint, Scenario, Success

### Community 59 - "joi"
Cohesion: 0.40
Nodes (3): joi@^18.2.9, joi, Joi

### Community 60 - "📄 Pages"
Cohesion: 0.40
Nodes (5): 🛡️ Admin Pages, 👨‍⚕️ Doctor Pages, 📄 Pages, 👤 Patient Pages, 🏠 Public Pages

### Community 61 - "🚀 Running the Project"
Cohesion: 0.40
Nodes (5): Available npm scripts, Docker, Local Setup, Prerequisites, 🚀 Running the Project

### Community 63 - "Patient User Flow"
Cohesion: 0.50
Nodes (3): Flow Rules, Patient Journey, Patient User Flow

### Community 64 - "helmet.js"
Cohesion: 0.50
Nodes (3): helmet, helmet@^8.3.0, helmet

### Community 65 - "🔔 Notifications Policy"
Cohesion: 0.50
Nodes (4): Channels, Events → Channel, 🔔 Notifications Policy, Rules

### Community 66 - "env-config.js"
Cohesion: 0.25
Nodes (6): jwt, jsonwebtoken@^9.0.3, jsonwebtoken, buildMongoUri(), migrate(), mongoose

### Community 68 - "ai"
Cohesion: 0.18
Nodes (11): container_name, environment, networks, ports, restart, volumes, FEATURE_SCHEMA_VERSION, MODEL_VERSION (+3 more)

### Community 69 - "depends_on"
Cohesion: 0.25
Nodes (8): condition, condition, depends_on, ai, app, mongo, condition, depends_on

### Community 70 - "🎯 Project Overview"
Cohesion: 0.67
Nodes (3): ⚠️ AI Disclaimer, Core Objectives, 🎯 Project Overview

### Community 74 - "environment"
Cohesion: 0.29
Nodes (8): environment, AI_SERVICE_URL, DEFAULT_CONSULTATION_MINUTES, DEPOSIT_MODE, MONGO_URI, NO_SHOW_HIGH_RISK_THRESHOLD, NODE_ENV, environment

### Community 82 - "mailer.js"
Cohesion: 0.33
Nodes (4): nodemailer@^10.0.11, nodemailer, nodemailer, transporter

### Community 223 - "ml/README.md"
Cohesion: 0.25
Nodes (7): AI Scheduling Prediction — Python ML service (separate from Node.js backend), - consultation duration regression, It is called by services/aiService.js in the Node.js backend., ml/, Node.js owns all business decisions; Python only predicts., - patient no-show probability classification, This folder contains the Python prediction service that computes:

### Community 224 - "app"
Cohesion: 0.29
Nodes (7): container_name, env_file, networks, ports, restart, volumes, app

### Community 225 - "healthcheck"
Cohesion: 0.53
Nodes (6): healthcheck, interval, retries, test, timeout, healthcheck

### Community 226 - "seed"
Cohesion: 0.33
Nodes (6): command, container_name, env_file, networks, volumes, seed

### Community 227 - "🔗 Page-to-API Index"
Cohesion: 0.33
Nodes (6): 🛡️ Admin Pages, 🔗 API-to-Page Reverse Index, 👨‍⚕️ Doctor Pages, 🔗 Page-to-API Index, 👤 Patient Pages, 🏠 Public Pages (Guest)

### Community 228 - "build"
Cohesion: 0.60
Nodes (5): build, build, context, dockerfile, build

## Knowledge Gaps
- **158 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `🏥 Doctory — AI-Powered Smart Clinic System (نظام عيادات ذكي)` connect `🏥 Doctory — AI-Powered Smart Clinic System (نظام عيادات ذكي)` to `🔔 Notifications Policy`, `⚙️ Environment Variables`, `🔗 Page-to-API Index`, `🎯 Project Overview`, `🔌 APIs`, `🤖 AI Scheduling Prediction`, `train.py`, `📋 Scenarios`, `✅ Checklist`, `📄 Pages`, `🚀 Running the Project`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Should `logicModels/static/static.render.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05807200929152149 - nodes in this community are weakly interconnected._
- **Why does `seed()` connect `seed` to `User.entity.js`, `BookingItem.entity.js`, `DoctorPortfolio.entity.js`, `DoctorWork.entity.js`, `mongoose`, `factories.js`, `🚀 Running the Project`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Should `Backend Routes & APIs Documentation — Read-Only Audit` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._
- **Why does `🚀 Running the Project` connect `🚀 Running the Project` to `🏥 Doctory — AI-Powered Smart Clinic System (نظام عيادات ذكي)`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `Patient Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `validation.js` be split into smaller, more focused modules?**
  _Cohesion score 0.04251700680272109 - nodes in this community are weakly interconnected._