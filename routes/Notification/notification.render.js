const router = require('express').Router();
const auth = require('../../middleware/auth');
const catchError = require('../../utils/catchError');
const checkLogin = require('../../utils/checkLogin');

// GET /notifications — any authenticated role; the view picks the portal layout from the user's role.
router.get('/notifications', auth, catchError(async (req, res) =>
    res.render('patient/notifications', { ...checkLogin(req, res), pageTitle: 'الإشعارات', section: 'notifications', user: req.user, portal: req.user.role })));

module.exports = router;
