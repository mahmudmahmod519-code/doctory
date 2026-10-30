const router = require('express').Router();
const auth = require('../../middleware/auth');
const roles = require('../../middleware/roles');
const catchError = require('../../utils/catchError');
const renderController = require('../../logicModels/User/User.render');

// GET /user/profile
router.get('/profile', auth, roles('patient'), catchError(renderController.getProfileRender));

// GET /user/settings
router.get('/settings', auth, catchError(renderController.getSettingsRender));

module.exports = router;
