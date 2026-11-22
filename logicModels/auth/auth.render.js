const checkLogin = require('../../utils/checkLogin');

// Guest-only pages: a logged-in visitor is sent home. `?next=` is validated (same-origin paths only).
const safeNext = (v) => (typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') ? v : null);

const guestPage = (view, pageTitle, extra = () => ({})) => async (req, res) => {
    const ctx = checkLogin(req, res);
    if (ctx.login) return res.redirect('/');
    res.render(view, { ...ctx, pageTitle, next: safeNext(req.query.next), ...extra(req) });
};

exports.getSignupOptionsRender   = guestPage('auth/signup-options', 'إنشاء حساب');
exports.getLoginRender           = guestPage('auth/login', 'تسجيل الدخول');
exports.getRegisterPatientRender = guestPage('auth/register-patient', 'تسجيل مريض جديد');
exports.getRegisterDoctorRender  = guestPage('auth/register-doctor', 'تسجيل طبيب جديد');
exports.getForgotPasswordRender  = guestPage('auth/forgot-password', 'نسيت كلمة المرور');
exports.getResetPasswordRender   = guestPage('auth/reset-password', 'إعادة تعيين كلمة المرور', (req) => ({ token: req.params.token }));
exports.getEmailVerificationRender = guestPage('auth/email-verification', 'تأكيد البريد الإلكتروني', (req) => ({ token: req.params.token }));
// 2FA page is part of the login flow (the user is not fully logged in yet) — no guest redirect.
exports.get2faVerifyRender = async (req, res) =>
    res.render('auth/2fa-verify', { ...checkLogin(req, res), pageTitle: 'التحقق بخطوتين', next: safeNext(req.query.next) });
