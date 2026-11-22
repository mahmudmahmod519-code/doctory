const checkLogin = require('../../utils/checkLogin');

const page = (view, pageTitle, section, extra = () => ({})) => async (req, res) =>
    res.render(view, { ...checkLogin(req, res), pageTitle, section, user: req.user, ...extra(req) });
const withId = (r) => ({ id: r.params.id });

exports.getDashboardRender        = page('admin/dashboard', 'لوحة المدير', 'dashboard');
exports.getDoctorsRender          = page('admin/doctors/list', 'الأطباء', 'doctors');
exports.getDoctorVerificationListRender    = page('admin/doctors/verification-list', 'طلبات التوثيق', 'doctors');
exports.getDoctorVerificationDetailsRender = page('admin/doctors/verification-details', 'مراجعة التوثيق', 'doctors', withId);
exports.getDoctorDetailsRender    = page('admin/doctors/profile', 'تفاصيل الطبيب', 'doctors', withId);
exports.getPatientsRender         = page('admin/patients/list', 'المرضى', 'patients');
exports.getPatientDetailsRender   = page('admin/patients/profile', 'تفاصيل المريض', 'patients', withId);
exports.getUsersRender            = page('admin/users/list', 'المستخدمون', 'users');
exports.getUserDetailsRender      = page('admin/users/details', 'تفاصيل المستخدم', 'users', withId);
exports.getBookingsRender         = page('admin/bookings/list', 'الحجوزات', 'bookings');
exports.getBookingDetailsRender   = page('admin/bookings/details', 'تفاصيل الجلسة', 'bookings', withId);
exports.getWaitingListRender      = page('admin/waiting-list', 'قائمة الانتظار', 'waiting');
exports.getServicesRender         = page('admin/services', 'الخدمات', 'services');
exports.getDeletionRequestsRender = page('admin/deletion-requests', 'طلبات الحذف', 'deletion');
