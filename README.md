# 🏥 AI-Powered Smart Clinic System (نظام عيادات ذكي)

> **Graduation Project** — Faculty of Computers and Information
> AI-Powered Smart Clinic System for Patient Management and Clinical Decision Support

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Onboarding Guide](#onboarding-guide)
   - [Getting Started](#getting-started)
   - [Git Workflow](#git-workflow)
   - [Running the Project](#running-the-project)
4. [Project Structure](#project-structure)
5. [Tech Stack](#tech-stack)
6. [Environment Variables](#environment-variables)
7. [Database](#database)
8. [API Documentation](#api-documentation)
9. [User Roles & Permissions](#user-roles--permissions)
10. [Booking Approval Workflow](#booking-approval-workflow)
11. [Security Mechanisms](#security-mechanisms)
12. [AI Integration Plan](#ai-integration-plan)
13. [Project Scope](#project-scope)
14. [Timeline](#timeline)
15. [Testing Strategy](#testing-strategy)
16. [Contributing](#contributing)

---

## 🎯 Project Overview

An intelligent clinic management application that simplifies the patient journey, eliminates long waiting times, and provides AI-powered clinical decision support. The system routes patients to the right specialty, manages bookings through a doctor-approval mechanism, and digitizes prescriptions via OCR.

> ⚠️ **Important:** AI in this project is a **Clinical Decision Support Tool**, not an autonomous diagnostic system. The physician always has full authority over diagnosis, prescriptions, and medical reports.

---

## 🏗️ System Architecture

```
Patient App ──┐
Doctor Web ───┼──> Express.js API ──> MySQL (TypeORM)
Admin Web ────┘         │
                        ├──> AI Microservice (FastAPI)
                        │     ├─ NLP Routing (symptom → specialty)
                        │     └─ OCR (prescription → text)
                        │
                        └──> Redis (queues, sessions)
```

---

## 🚀 Onboarding Guide

### Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/mahmudmahmod519-code/doctory.git
cd doctory
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.exmple .env
# Edit .env with your DB credentials and secrets
```

**4. Run the server**
```bash
npm start
```

The server will start at `http://localhost:3000` (default) after a successful database connection.

---

### Git Workflow

**1. Always pull the latest changes from main before starting:**
```bash
git pull origin main
```

**2. Create a new branch for your task:**
```bash
git checkout -b dev/your-task-name
# or
git switch -c dev/your-task-name
```

**Branch naming convention:**
```
fix/branch-name   → debugging / bug fixes
dev/branch-name   → new code / features / tasks
```

**3. Commit with clear messages:**
```bash
git add .
git commit -m "feat: short description of change"
```

**4. Push and open a Pull Request:**
```bash
git push origin dev/your-task-name
```

---

### Running the Project

| Method | Command |
|--------|---------|
| Local | `npm start` |
| Development (auto-reload) | `npm run dev` |
| Docker (production) | `docker compose up --build` |
| Docker (development, hot reload) | `docker compose -f docker-compose.dev.yml up --build` |

### Docker Quick Start (for team members)

**Development (live code reload):**
```bash
docker compose -f docker-compose.dev.yml up --build
```
- Code is mounted into the container — edits restart the server automatically via nodemon.
- MySQL is exposed on host port `3307`.

**Production:**
```bash
docker compose up --build -d
```
- Optimized image, no source mounting, MySQL on port `3306`.

Stop containers:
```bash
docker compose -f docker-compose.dev.yml down
```

| File | Purpose |
|------|---------|
| `Dockerfile` | Production image (optimized, no dev deps) |
| `Dockerfile.dev` | Development image (nodemon hot reload) |
| `docker-compose.yml` | Production stack: app + MySQL |
| `docker-compose.dev.yml` | Dev stack: app + MySQL, source mounted for live reload |

---

## 📁 Project Structure

```
grad/
├── config/
│   ├── data-source.js       # TypeORM DataSource (MySQL)
│   └── server-config.js     # Express middleware config
├── routes/
│   ├── index.js             # Route registry
│   ├── static/              # Static pages
│   ├── errors/              # Error handlers
│   └── module_Ex/           # Example module template
├── logicModels/
│   ├── static/
│   ├── errors/
│   └── module_name_ex/      # Example controller template
├── models/
│   └── User.entity.EX.js    # TypeORM entities
├── middlewares/
│   ├── auth.js              # JWT authentication
│   ├── roles.js             # RBAC
│   ├── upload.js            # File uploads (multer)
│   ├── validate.js          # Request validation (Joi)
│   ├── helmet.js            # Security headers
│   └── securityLogger.js    # Security event logging
├── utils/
│   ├── mailer.js            # Email (nodemailer)
│   ├── cronJobs.js          # Scheduled tasks (node-cron)
│   ├── payment.js
│   ├── validation.js
│   ├── checkLogin.js
│   ├── catchError.js
│   └── remove_password.js
├── docs/
│   ├── backend/README_APIs.md
│   ├── database/
│   ├── frontend/
│   └── system_analysis/
├── public/                  # Static assets
├── Dockerfile               # Production image
├── Dockerfile.dev           # Development image (hot reload)
├── docker-compose.yml       # Production stack
├── docker-compose.dev.yml   # Dev stack (live reload)
├── server.js                # Application entry point
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express.js 5 |
| **Database** | MySQL (via TypeORM + mysql2) |
| **Auth** | JWT, Cookies, 2FA (planned) |
| **Validation** | Joi |
| **Uploads** | Multer |
| **Email** | Nodemailer |
| **Scheduling** | node-cron |
| **AI Layer** | node.js express (planned) |
| **Cache/Queue** | Redis (planned) |
| **Frontend** | React.js / Next.js (planned) |
| **Mobile** | React Native / Flutter (planned) |
| **Containerization** | Docker, Docker Compose |

---

## 🔐 Environment Variables

Create a `.env` file in the root:

```bash
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=clinic_db

# Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email
MAIL_PASS=your_email_password
```

> ⚠️ Never commit `.env` to Git. Use `.env.exmple` as a template.

---

## 🗄️ Database

- **Type**: MySQL
- **ORM**: TypeORM (entities in `/models`)
- **Schema Docs**: See `docs/database/databaseDoc.md` and `docs/database/database_schema.sql`
- **Note**: `synchronize` is **false** — do not enable it in production.

---

## 📜 API Documentation

All endpoints are documented in:

👉 **`docs/backend/README_APIs.md`**

Use the provided template to document every new endpoint:

```
## (module name)
### type: API | RENDER
#### http method: GET | POST | PATCH | PUT | DELETE
#### name: functionName
#### role: guest | admin | doctor | patient
#### description (AR): ...
```

---

## 👥 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Patient** | Register, browse clinics, book appointments, view reports, request data deletion |
| **Doctor** | View dashboard, manage pending bookings, view waiting list, write prescriptions, modify diagnosis. **Cannot** access full patient account data |
| **Admin** | Verify doctor IDs, approve/reject registrations, view stats, view audit log |

---

## 🔄 Booking Approval Workflow

```bash
Patient books → status: "pending"
                    ↓
Doctor sees in dashboard
        ↙              ↘
   Accept              Reject
     ↓                   ↓
status: "confirmed"   status: "rejected"
Notify patient        Notify patient
Add to queue          Free slot
```

- When doctor accept a book the patient have 2 options 1 confirmed then go to doctor ,2 not confirmed and will status pendding2 then rejected in third time.
- Every accept/reject action is logged in the **Audit Log**.

---

## 🔒 Security Mechanisms

1. **Physician Verification** — Upload Egyptian Medical Syndicate ID → Admin review → Activate/Reject
2. **Authentication** — JWT + HttpOnly Cookies
3. **2FA** — Google Authenticator (planned)
4. **RBAC** — Role-based middleware on every protected route
5. **Data Protection** — TLS in transit, AES-256 at rest, Audit Log
6. **Compliance** — Egyptian Personal Data Protection Law No. 151 (2020)

---

## 🤖 AI Integration Plan

| Feature | Model Type | Input → Output |
|---------|-----------|----------------|
| Patient Routing | LLM via API (OpenRouter) or self-hosted | Complaint → Suggested specialty |
| Prescription OCR | Vision-Language Model | Image → Text |
| Analytics | Traditional ML | Data → Reports |

> AI outputs are always presented as **suggestions**, never final decisions.

---

## 📋 Project Scope

**In Scope:** Registration, AI routing, booking approval, queue management, OCR, reports, admin dashboard, mobile app, 2FA, RBAC.

**Out of Scope:** Final medical diagnosis, health insurance integration, non-Arabic/English support, medical devices, Hospital ERP integration, QR scanning.

---

## ⏱️ Timeline (20 Weeks)

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| 1. Research & Requirements | 4 weeks | Study, requirements, DB design ,userflow,scenario,apis docs, pages doc & prompt |
| 2. UI/UX Design | 1 weeks | Wireframes, mockups, prototype |
| 3. Backend & Database | 4 weeks | APIs, DB, Auth |
| 4. Frontend & Mobile | 4 weeks | Interfaces, mobile app |
| 5. AI Integration | 3 weeks | Routing, OCR, analytics |
| 6. Testing & Optimization | 2 weeks | Testing, bug fixes,clean code |
| 7. Documentation & Delivery & Maintance | 2 weeks | Docs, manual, presentation |

---

## 🧪 Testing Strategy

| Type | Tool/Approach |
|------|---------------|
| Unit | Jest (utils, controllers) |
| Integration | Supertest (API endpoints) |
| Security | OWASP checklist, manual curl tests |
| Manual | Postman / Thunder Client |
| penteraion testing | Nmap,BrubSuite |
| Load | Artillery or k6 |

---

## 🤝 Contributing

1. Pull latest `main`
2. Branch: `dev/feature-name` or `fix/bug-name`
3. Follow existing code style (CommonJS, Express 5, TypeORM)
4. Document APIs in `docs/backend/README_APIs.md`
5. Document DB changes in `docs/database/`
6. Open a Pull Request with a clear description

---

## 📄 License

ISC — For academic/graduation use.
