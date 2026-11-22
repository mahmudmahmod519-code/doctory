const router = require('express').Router();
const auth = require('../../middleware/auth');
const roles = require('../../middleware/roles');
const catchError = require('../../utils/catchError');
const c = require('../../logicModels/DoctorPortfolio/DoctorPortfolio.render');

router.get('/', catchError(c.getSearchRender));
// Booking needs a patient session — /doctors/:id/book?… sends guests to login with ?next=
router.get('/:id/book', (req, res, next) => (req.cookies?.session_token ? next() : res.redirect('/auth/login?next=' + encodeURIComponent(req.originalUrl))), auth, roles('patient'), catchError(c.getBookRender));
router.get('/:id', catchError(c.getProfileRender));

module.exports = router;
