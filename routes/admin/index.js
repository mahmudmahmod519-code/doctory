// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /admin/dashboard
// Render admin dashboard page.
// Shows stat cards: patients count, doctors count by status, bookings today, waiting patients, pending verifications, pending deletion requests.
// Includes charts: bookings per day, bookings by type/status, top specialties.

// GET /admin/doctors
// Render doctors management page.
// Table view of all doctors with filters: specialty, status, search.
// Includes pagination and actions: view profile, activate/suspend, soft delete.

// GET /admin/doctors/:id
// Render individual doctor profile page.
// Shows doctor details, working hours, sessions, patients, services, waiting list button.

// GET /admin/patients
// Render patients management page.
// Search and filter patients by name, phone, email, age group, doctor, status, address, registration date, has report.
// Includes pagination and active filter chips.

// GET /admin/patients/:id
// Render patient profile page.
// Shows patient info, booking history with doctors (type, date, queue number, status), reports count only.

// GET /admin/users
// Render users and admins management page.
// Role tabs: All / Admins / Doctors / Patients.
// Table with add user drawer, row actions menu: edit, change role, activate/suspend, soft delete, restore.

// GET /admin/users/:id
// Render user details / login control panel.
// Shows account card: role, status, email verified, 2FA enabled, last login.
// Login control panel: suspend/activate, force logout, send reset password email, reset 2FA, edit form, danger zone (soft delete).

// GET /admin/bookings
// Render bookings page (exams and consultations).
// Tabs: Exams / Consultations / All.
// Filters: doctor, status, date range.
// Table: id, doctor, type, date, time, booked/total, status.
// Actions: open details, modify status/capacity/time, cancel, soft delete, restore.

// GET /admin/bookings/:id
// Render booking details page.
// Session header: doctor, type, date, time, capacity.
// Items table: queue number, patient, phone, age, status.
// Edit dialogs for patient status and queue number.

// GET /admin/waiting-list
// Render waiting list page.
// Doctor picker + date picker (default today) + type toggle.
// Counters: waiting / completed / removed.
// Groups: Waiting (queue number, patient, waiting minutes, estimated wait), Completed (queue number, patient, completed at), Removed (rejected/cancelled/deleted).

// GET /admin/services
// Render doctor services page.
// Status tabs: pending / active / rejected.
// Table: title, doctor, price, duration, status.
// Actions: approve, reject (reason required), edit, soft delete.

// GET /admin/audit-log
// Render audit log page.
// Read-only operation log.
// Filters: action, actor, entity type, date range.
// Table: time, actor, action, entity, IP.
// Expandable metadata JSON. No edit/delete.

// GET /admin/deletion-requests
// Render deletion requests page.
// Table: patient name (masked), requested at, status.
// Actions: approve (hard delete/anonymize) or reject (reason required).


// ==========================================
// API ROUTES (JSON)
// ==========================================

// GET /api/admin/stats
// Dashboard statistics.
// Query: from, to (optional date range).
// Returns: patients count, doctors by status, bookings today, waiting patients today, bookings by type/status, top specialties, pending verifications, pending deletion requests.

// GET /api/admin/doctors
// List all doctors with search and filters.
// Query: q, specialty, status, include_deleted, page, limit, sort.
// Returns portfolio_id, name, specialty, email, status, sessions count, patients count.

// GET /api/admin/doctors/:id
// Get individual doctor profile.
// Returns users + doctor_portfolios data, working hours, stats: sessions count, patients count, average rating.

// GET /api/admin/doctors/:id/patients
// Get patients of a specific doctor.
// Query: q, status, type, date_from, date_to, page, limit.
// Returns booking items linked to this doctor.

// GET /api/admin/doctors/pending
// List doctors pending verification (Medical ID review).
// Query: page, limit, q.
// Returns doctors with status=pending.

// GET /api/admin/doctors/:id/verification
// Get doctor verification details.
// Returns doctor data, Medical ID image link (protected), previous attempts history.

// PATCH /api/admin/doctors/:id/approve
// Approve doctor verification.
// Sets verification=approved, users.status=active.
// Sends email to doctor. Creates Audit Log entry.
// 409 if doctor is not pending.

// PATCH /api/admin/doctors/:id/reject
// Reject doctor verification.
// Body: { reason } (required, min 10 characters).
// Sets verification=rejected. Account remains active.
// Doctor can resubmit Medical ID from same account.
// 409 if doctor is not pending.

// GET /api/admin/patients
// List patients with search and filters.
// Query: q, age_group, age_min, age_max, status, address, doctor_id, specialty, booking_status, has_report, created_from, created_to, include_deleted, sort, page, limit.
// Returns patients matching filters.

// GET /api/admin/patients/:id
// Get patient profile and booking history.
// Returns patient info, booking history with doctors, reports count only.
// Medical report content is NOT shown to admin.

// GET /api/admin/users
// List all users.
// Query: role, status, q, include_deleted, page, limit, sort.
// Returns users with role, status, email, name, phone.

// POST /api/admin/users
// Create new user.
// Body: { role, name, email, phone } (if role=doctor, add doctor_name, specialty, title).
// Admin does not set password; password reset email is sent to user.
// Doctor added by admin is activated directly.
// 409 if email already exists.

// PATCH /api/admin/users/:id
// Update user data.
// Body: { name, email, phone, address, birth_date }.
// Role and status changes have separate endpoints.

// PATCH /api/admin/users/:id/role
// Change user role.
// Body: { role } (admin or patient only).
// Admin cannot change own role (403). Cannot demote last active admin (409).
// Revokes all refresh tokens immediately.

// PATCH /api/admin/users/:id/status
// Suspend or activate account.
// Body: { status: "active" | "suspended", reason }.
// Suspension cancels all sessions; future login returns 403.
// Cannot suspend self or last active admin.

// DELETE /api/admin/users/:id
// Soft delete user.
// Sets deleted_at and deleted_by. Associated data preserved.
// Cannot delete self or last active admin.

// PATCH /api/admin/users/:id/restore
// Restore soft-deleted user.
// Status returns to suspended until admin activates.

// POST /api/admin/users/:id/force-logout
// Revoke all refresh tokens for user.
// Current Access Token remains valid until expiry.

// POST /api/admin/users/:id/reset-password
// Send password reset email to user.
// Admin does not see or set password.
// 429 if repeated too many times.

// POST /api/admin/users/:id/reset-2fa
// Reset 2FA for user.
// Clears secure_key and disables enable_2fa.
// Doctor/Admin must re-enable on next login (mandatory for them).

// GET /api/admin/bookings
// List bookings (exams and consultations).
// Query: type, status, doctor_id, date_from, date_to, include_deleted, page, limit, sort.
// Returns sessions with doctor, type, date, time, booked/total, status.

// GET /api/admin/bookings/:id
// Get booking details.
// Returns session details and all booking_items ordered by queue_number.

// PATCH /api/admin/bookings/:id
// Update booking.
// Body: any field: status, total_patients, appointment_date, appointment_time.
// total_patients cannot be below accepted count.
// If status=cancelled, all pending/accepted items become cancelled, patients notified.
// Changing date/time notifies patients.

// DELETE /api/admin/bookings/:id
// Soft delete booking.
// 409 if booking has accepted items (must cancel first).

// PATCH /api/admin/booking-items/:id
// Update patient inside booking session.
// Body: { status, queue_number }.
// status: pending | accepted | rejected | completed | cancelled.
// queue_number must be unique within session.
// When status=completed, records completed_at.

// DELETE /api/admin/booking-items/:id
// Soft delete patient from booking session.
// Patient appears in Removed group in waiting list.

// PATCH /api/admin/booking-items/:id/restore
// Restore soft-deleted booking item.
// 409 if session cancelled or full.

// GET /api/admin/waiting-list
// Get waiting list for doctor on date.
// Query: doctor_id (required), date (required), type (optional).
// Groups: waiting, completed, removed.
// Each waiting patient: waiting_minutes, estimated_wait_minutes.
// 400 if doctor_id or date missing; 404 if doctor not found.

// GET /api/admin/services
// List doctor services.
// Query: status, doctor_id, q, include_deleted, page, limit.
// Returns services with title, doctor, price, duration, status.

// PATCH /api/admin/services/:id/status
// Approve or reject doctor service.
// Body: { status: "active" | "rejected", reason } (reason required on rejection).

// DELETE /api/admin/services/:id
// Soft delete doctor service.

// GET /api/admin/audit-logs
// Read audit log entries.
// Query: action, actor_id, actor_role, entity_type, entity_id, from, to, page, limit.
// Read-only. No write operations allowed.

// GET /api/admin/deletion-requests
// List data deletion requests.
// Query: status, page, limit.
// Patient name masked for privacy.

// PATCH /api/admin/deletion-requests/:id
// Approve or reject deletion request.
// Body: { decision: "approved" | "rejected", reason }.
// Approved: hard delete or anonymize patient data (only exception to soft delete).
// 409 if request already decided.