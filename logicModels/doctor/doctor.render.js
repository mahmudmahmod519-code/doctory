const checkLogin = require('../../utils/checkLogin');

const page = (view, pageTitle, section, extra = () => ({})) => async (req, res) =>
    res.render(view, { ...checkLogin(req, res), pageTitle, section, user: req.user, ...extra(req) });
const withId = (r) => ({ id: r.params.id });

exports.getLoginRedirect = (req, res) => res.redirect('/auth/login?role=clinician');
exports.getDashboardRender          = page('doctor/dashboard', 'لوحة الطبيب', 'dashboard');
exports.getPendingBookingsRender    = page('doctor/bookings-pending', 'طلبات الحجز', 'pending');
exports.getBookingDetailsRender     = page('doctor/booking-details', 'تفاصيل الجلسة', 'pending', withId);
exports.getWaitingListRender        = page('doctor/waiting-list', 'قائمة الانتظار', 'waiting');
exports.getClinicalSummaryRender    = page('doctor/clinical-summary', 'الملخص السريري', 'waiting', withId);
exports.getDiagnosisRender          = page('doctor/diagnosis', 'التشخيص', 'waiting', withId);
exports.getPrescriptionRender       = page('doctor/prescription', 'الروشتة', 'waiting', withId);
exports.getVerificationStatusRender = page('doctor/verification-status', 'حالة التوثيق', 'verification');
exports.getPortfolioRender          = page('doctor/portfolio', 'ملفي والخدمات', 'portfolio');
exports.getReviewsRender            = page('doctor/reviews', 'تقييماتي', 'reviews');
