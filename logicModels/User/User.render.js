const checkLogin = require('../../utils/checkLogin');

// GET /user/profile
// Render the patient profile page.
// Shows user account details: name, email, phone, address, birth date, role, status.
exports.getProfileRender = async (req, res) => {
    res.render('patient/settings', {
        ...checkLogin(req, res),
        pageTitle: 'الملف الشخصي',
        user: req.user
    });
};

// GET /user/settings
// Render the user settings page.
// Allows editing personal data, changing password, enabling/disabling 2FA.
exports.getSettingsRender = async (req, res) => {
    res.render('patient/settings', {
        ...checkLogin(req, res),
        pageTitle: 'الإعدادات',
        user: req.user
    });
};
