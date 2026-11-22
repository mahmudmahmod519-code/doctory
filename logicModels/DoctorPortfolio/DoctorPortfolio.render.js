const checkLogin = require('../../utils/checkLogin');

// GET /doctors  (guest accessible)
exports.getSearchRender = async (req, res) =>
    res.render('patient/doctors/search', { ...checkLogin(req, res), pageTitle: 'ابحث عن طبيب', q: req.query.q || '' });

// GET /doctors/:id  (guest accessible)
exports.getProfileRender = async (req, res) =>
    res.render('patient/doctors/profile', { ...checkLogin(req, res), pageTitle: 'ملف الطبيب', doctorId: req.params.id });

// GET /doctors/:id/book  (patient only — guarded in the route)
exports.getBookRender = async (req, res) =>
    res.render('patient/doctors/book-appointment', { ...checkLogin(req, res), pageTitle: 'حجز موعد', doctorId: req.params.id, user: req.user });
