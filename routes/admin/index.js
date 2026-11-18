const router = require('express').Router();

const adminApiRouter = require('./admin.apis');
const adminRenderRouter = require('./admin.render');

router.use('/api/admin', adminApiRouter);
router.use('/admin', adminRenderRouter);

module.exports = router;