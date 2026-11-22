// ==========================================
// MODULE: NOTIFICATION
// Mounted in routes/index.js as:
//   app.use('/', require('./Notification/index.js'))
// Internal mounting:
//   router.use('/api/notifications', require('./Notification.apis.js'));
//   router.use('/notifications',     require('./Notification.render.js'));
// Authentication: auth middleware (JWT via 'session_token' cookie)
// Policy: in-app notifications only. Email is reserved for critical events only. NO SMS.
// Note: this file currently contains documentation only — the routers are not mounted yet.
// ==========================================

// ==========================================
// RENDER ROUTES (EJS Pages)
// ==========================================

// GET /notifications
// Render the notifications center page.
// Lists the in-app notifications of the authenticated user with the icon of the notification type,
// title, message, creation time and the read / unread state.
// Unread items are highlighted, and the page includes "mark all as read" and "delete notification" actions.
// Requires authentication (any role — the list is always filtered by the authenticated user).
// View file: views/patient/notifications.ejs.

// GET /notifications/settings
// Render the notification preferences section.
// Shows the per-type toggles (queue_update, booking_accepted, booking_rejected, turn_warning,
// appointment_cancelled, doctor_verified, deletion_request_update, system) and the email preference
// for the critical events only.
// Requires authentication (any role).
// Note: this view is not created yet — the page is documented for completeness.


// ==========================================
// API ROUTES (JSON)
// ==========================================

// GET /api/notifications
// List the notifications of the authenticated user.
// Query: type (filter by notification type), is_read (true|false), page, limit, sort, order.
// Returns: { items, page, limit, total } where each item holds notification_id, type, title, message,
// is_read, related_entity_type, related_entity_id and created_at.
// The query is always scoped to the authenticated user — a user can never read another user's notifications.
// Requires authentication (any role).

// GET /api/notifications/unread-count
// Get the number of unread notifications of the authenticated user.
// Query: none.
// Returns: { status: 'success', data: { unread_count } }.
// Used by the notification bell in the navbar to render the counter badge.
// Requires authentication (any role).

// GET /api/notifications/settings
// Get the notification preferences of the authenticated user.
// Returns: { status: 'success', data: { types: { queue_update, booking_accepted, booking_rejected, turn_warning,
//            appointment_cancelled, doctor_verified, deletion_request_update, system }, email_critical } }.
// Every toggle is a boolean (default true). Critical events (account suspension, doctor verification result)
// are always delivered in-app — the toggles only control the optional types.
// Must be declared before GET /api/notifications/:id so "settings" is not read as an id.
// Requires authentication (any role).

// PATCH /api/notifications/settings
// Update the notification preferences of the authenticated user.
// Body: { types (object of booleans, optional), email_critical (boolean, optional) } — at least one field required.
// Returns: { status: 'success', message, data: { types, email_critical } }.
// Business rules: unknown type keys are ignored; the turn_warning toggle cannot be disabled for a patient
// who has an active queue entry today. NO SMS channel exists.
// 400 on validation failure.
// Requires authentication (any role).

// GET /api/notifications/:id
// Get one notification of the authenticated user.
// Params: id (notification ObjectId).
// Returns: { status: 'success', data: { notification } }.
// 404 when the notification does not exist or belongs to another user.
// Requires authentication (any role) and ownership of the notification.

// PATCH /api/notifications/:id/read
// Mark one notification as read.
// Params: id (notification ObjectId).
// Body: { is_read (optional boolean, default true) }.
// Returns: { status: 'success', message, data: { notification } }.
// 404 when the notification does not exist or belongs to another user.
// Requires authentication (any role) and ownership of the notification.

// PATCH /api/notifications/read-all
// Mark all the notifications of the authenticated user as read.
// Body: { type (optional — limits the operation to one notification type) }.
// Returns: { status: 'success', message, data: { updated_count } }.
// Requires authentication (any role).

// DELETE /api/notifications/:id
// Delete one notification of the authenticated user.
// Params: id (notification ObjectId).
// Returns: { status: 'success', message }.
// 404 when the notification does not exist or belongs to another user.
// Requires authentication (any role) and ownership of the notification.

// POST /api/notifications
// Create a notification — internal endpoint used by the notification service.
// Body: { user_id (required), type (required), title (required), message (required),
//         related_entity_type, related_entity_id }.
// type: queue_update | booking_accepted | booking_rejected | turn_warning | appointment_cancelled |
//       doctor_verified | deletion_request_update | system.
// Returns: { status: 'success', message, data: { notification } }.
// Business rules:
// - Every write must go through services/notificationService.js so the channel policy stays in one place.
// - The message must not embed protected medical data — it references the subject through
//   related_entity_type and related_entity_id only.
// Requires authentication (admin|system).
