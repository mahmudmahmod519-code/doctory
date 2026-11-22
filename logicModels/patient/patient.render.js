const checkLogin = require('../../utils/checkLogin');

// Every patient page shares the same locals; `section` drives the sidebar highlight.
const page = (view, pageTitle, section, extra = () => ({})) => async (req, res) =>
    res.render(view, { ...checkLogin(req, res), pageTitle, section, user: req.user, ...extra(req) });

exports.getDashboardRender        = page('patient/dashboard', 'لوحة التحكم', 'dashboard');
exports.getWaitingQueueRender     = page('patient/waiting-queue', 'قائمة الانتظار', 'queue', (r) => ({ bookingItemId: r.query.booking || null }));
exports.getTurnNotificationRender = page('patient/turn-notification', 'حان دورك', 'queue', (r) => ({ bookingItemId: r.query.booking || null }));
exports.getDeclineWarningRender   = page('patient/decline-warning', 'تنبيه الرفض', 'queue', (r) => ({ bookingItemId: r.query.booking || null }));
exports.getAppointmentCancelledRender = page('patient/appointment-cancelled', 'تم إلغاء الموعد', 'dashboard', (r) => ({ bookingItemId: r.query.booking || null, reason: r.query.reason || null }));
exports.getMedicalHistoryRender   = page('patient/medical-history', 'السجل الطبي', 'history');
exports.getMedicalReportRender    = page('patient/medical-report', 'التقرير الطبي', 'history', (r) => ({ reportId: r.query.report || null }));
exports.getBookingsRender         = page('patient/bookings', 'حجوزاتي', 'bookings');
exports.getSettingsRender         = page('patient/settings', 'الإعدادات', 'settings');
exports.getNotificationsRender    = page('patient/notifications', 'الإشعارات', 'notifications');
exports.getSubmitReviewRender    = page('patient/submit-review', 'قيّم زيارتك', 'history', (r) => ({ bookingItemId: r.params.bookingItemId }));
