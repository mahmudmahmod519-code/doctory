const router = require('express').Router();

const auth = require('../../middleware/auth');
const roles = require('../../middleware/roles');
const catchError = require('../../utils/catchError');

// Models
const User = require('../../models/User.entity');
const DoctorPortfolio = require('../../models/DoctorPortfolio.entity');
const BookingItem = require('../../models/BookingItem.entity');
const Booking = require('../../models/Booking.entity');
const AuditLog = require('../../models/AuditLog.entity');
const DeletionRequest = require('../../models/DeletionRequest.entity');
const DoctorWork = require('../../models/DoctorWork.entity');

// =========================
// Rendering Controllers
// =========================

exports.getDashboard = async (req, res) => {
    const totalUsers = await User.countDocuments({ deleted_at: null });
    const totalDoctors = await User.countDocuments({
        role: 'doctor',
        deleted_at: null
    });
    const totalPatients = await User.countDocuments({
        role: 'patient',
        deleted_at: null
    });
    const totalBookings = await Booking.countDocuments({
        deleted_at: null
    });

    res.render('admin/dashboard', {
        totalUsers,
        totalDoctors,
        totalPatients,
        totalBookings
    });
};

exports.getDoctorsPage = async (req, res) => {
    const doctors = await DoctorPortfolio.find()
        .populate('user_id')
        .lean();

    res.render('admin/doctors/list', { doctors });
};

exports.getDoctorProfilePage = async (req, res) => {
    const doctor = await DoctorPortfolio.findById(req.params.id)
        .populate('user_id')
        .lean();

    if (!doctor) {
        return res.status(404).send('Doctor not found');
    }

    res.render('admin/doctors/profile', { doctor });
};

exports.getPatientsPage = async (req, res) => {
    const patients = await User.find({
        role: 'patient',
        deleted_at: null
    }).lean();

    res.render('admin/patients/list', { patients });
};

exports.getPatientProfilePage = async (req, res) => {
    const patient = await User.findOne({
        _id: req.params.id,
        role: 'patient',
        deleted_at: null
    }).lean();

    if (!patient) {
        return res.status(404).send('Patient not found');
    }

    res.render('admin/patients/profile', { patient });
};

exports.getUsersPage = async (req, res) => {
    const users = await User.find({
        deleted_at: null
    }).lean();

    res.render('admin/users/list', { users });
};

exports.getUserDetailsPage = async (req, res) => {
    const user = await User.findById(req.params.id).lean();

    if (!user) {
        return res.status(404).send('User not found');
    }

    res.render('admin/users/details', { user });
};

exports.getBookingsPage = async (req, res) => {
    const bookings = await Booking.find({
        deleted_at: null
    })
        .populate({
            path: 'portfolio_id',
            populate: { path: 'user_id' }
        })
        .lean();

    res.render('admin/bookings/list', { bookings });
};

exports.getBookingDetailsPage = async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate({
            path: 'portfolio_id',
            populate: { path: 'user_id' }
        })
        .lean();

    if (!booking) {
        return res.status(404).send('Booking not found');
    }

    const bookingItems = await BookingItem.find({
        booking_id: booking._id,
        deleted_at: null
    }).populate('user_id').lean();

    res.render('admin/bookings/details', {
        booking,
        bookingItems
    });
};

exports.getWaitingListPage = async (req, res) => {
    const bookingItems = await BookingItem.find({
        status: { $in: ['pending', 'accepted'] },
        deleted_at: null
    })
        .populate('user_id')
        .populate('booking_id')
        .lean();

    res.render('admin/waiting-list', { bookingItems });
};

exports.getServicesPage = async (req, res) => {
    const services = await DoctorWork.find({
        deleted_at: null
    })
        .populate('portfolio_id')
        .lean();

    res.render('admin/services', { services });
};

exports.getAuditLogPage = async (req, res) => {
    const logs = await AuditLog.find()
        .sort({ createdAt: -1 })
        .lean();

    res.render('admin/audit-log', { logs });
};

exports.getDeletionRequestsPage = async (req, res) => {
    const deletionRequests = await DeletionRequest.find()
        .populate('user_id')
        .populate('reviewed_by')
        .sort({ createdAt: -1 })
        .lean();

    res.render('admin/deletion-requests', { deletionRequests });
};

// =========================
// Rendering Routes
// =========================

router.get('/dashboard', auth, roles('admin'), catchError(exports.getDashboard));

router.get('/doctors', auth, roles('admin'), catchError(exports.getDoctorsPage));
router.get('/doctors/:id', auth, roles('admin'), catchError(exports.getDoctorProfilePage));

router.get('/patients', auth, roles('admin'), catchError(exports.getPatientsPage));
router.get('/patients/:id', auth, roles('admin'), catchError(exports.getPatientProfilePage));

router.get('/users', auth, roles('admin'), catchError(exports.getUsersPage));
router.get('/users/:id', auth, roles('admin'), catchError(exports.getUserDetailsPage));

router.get('/bookings', auth, roles('admin'), catchError(exports.getBookingsPage));
router.get('/bookings/:id', auth, roles('admin'), catchError(exports.getBookingDetailsPage));

router.get('/waiting-list', auth, roles('admin'), catchError(exports.getWaitingListPage));

router.get('/services', auth, roles('admin'), catchError(exports.getServicesPage));

router.get('/audit-log', auth, roles('admin'), catchError(exports.getAuditLogPage));

router.get('/deletion-requests', auth, roles('admin'), catchError(exports.getDeletionRequestsPage));

module.exports = router;
