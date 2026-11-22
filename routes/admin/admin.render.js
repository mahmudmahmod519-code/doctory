const router = require('express').Router();
const auth = require('../../middleware/auth');
const roles = require('../../middleware/roles');
const catchError = require('../../utils/catchError');
const c = require('../../logicModels/admin/admin.render');

router.use(auth, roles('admin'));
router.get('/dashboard', catchError(c.getDashboardRender));
router.get('/doctors', catchError(c.getDoctorsRender));
// 'verification' routes must stay above '/doctors/:id'
router.get('/doctors/verification', catchError(c.getDoctorVerificationListRender));
router.get('/doctors/verification/:id', catchError(c.getDoctorVerificationDetailsRender));
router.get('/doctors/:id', catchError(c.getDoctorDetailsRender));
router.get('/patients', catchError(c.getPatientsRender));
router.get('/patients/:id', catchError(c.getPatientDetailsRender));
router.get('/users', catchError(c.getUsersRender));
router.get('/users/:id', catchError(c.getUserDetailsRender));
router.get('/bookings', catchError(c.getBookingsRender));
router.get('/bookings/:id', catchError(c.getBookingDetailsRender));
router.get('/waiting-list', catchError(c.getWaitingListRender));
router.get('/services', catchError(c.getServicesRender));
router.get('/deletion-requests', catchError(c.getDeletionRequestsRender));

module.exports = router;
