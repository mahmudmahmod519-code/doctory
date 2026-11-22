const router = require('express').Router();
const auth = require('../../middleware/auth');
const roles = require('../../middleware/roles');
const catchError = require('../../utils/catchError');
const c = require('../../logicModels/patient/patient.render');

router.use(auth, roles('patient'));
router.get('/dashboard', catchError(c.getDashboardRender));
router.get('/waiting-queue', catchError(c.getWaitingQueueRender));
router.get('/turn-notification', catchError(c.getTurnNotificationRender));
router.get('/decline-warning', catchError(c.getDeclineWarningRender));
router.get('/appointment-cancelled', catchError(c.getAppointmentCancelledRender));
router.get('/medical-history', catchError(c.getMedicalHistoryRender));
router.get('/medical-report', catchError(c.getMedicalReportRender));
router.get('/review/:bookingItemId', catchError(c.getSubmitReviewRender));
router.get('/bookings', catchError(c.getBookingsRender));
router.get('/settings', catchError(c.getSettingsRender));
router.get('/notifications', catchError(c.getNotificationsRender));

module.exports = router;
