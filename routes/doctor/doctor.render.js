const router = require('express').Router();
const auth = require('../../middleware/auth');
const roles = require('../../middleware/roles');
const catchError = require('../../utils/catchError');
const c = require('../../logicModels/doctor/doctor.render');

// /doctor/login is public: it only forwards to the shared login page (the server decides the role).
router.get('/login', c.getLoginRedirect);

router.use(auth, roles('doctor'));
router.get('/dashboard', catchError(c.getDashboardRender));
router.get('/bookings/pending', catchError(c.getPendingBookingsRender));
router.get('/bookings/:id', catchError(c.getBookingDetailsRender));
router.get('/waiting-list', catchError(c.getWaitingListRender));
router.get('/visits/:id/clinical-summary', catchError(c.getClinicalSummaryRender));
router.get('/visits/:id/diagnosis', catchError(c.getDiagnosisRender));
router.get('/visits/:id/prescription', catchError(c.getPrescriptionRender));
router.get('/verification-status', catchError(c.getVerificationStatusRender));
router.get('/portfolio', catchError(c.getPortfolioRender));
router.get('/reviews', catchError(c.getReviewsRender));

module.exports = router;
