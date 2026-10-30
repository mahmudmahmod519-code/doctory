const router = require('express').Router();
const auth = require('../../middleware/auth');
const roles = require('../../middleware/roles');
const catchError = require('../../utils/catchError');
const controller = require('../../logicModels/admin/admin.controller');

router.get('/test', auth, roles('admin'), catchError(controller.testAdmin));

module.exports = router;