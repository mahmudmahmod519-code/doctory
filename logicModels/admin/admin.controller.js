const User = require('../../models/User.entity')
const DoctorPortfolio = require('../../models/DoctorPortfolio.entity')
const BookingItem = require('../../models/BookingItem.entity')
const RefreshToken = require('../../models/RefreshToken.entity');
const Booking = require('../../models/Booking.entity')
const AuditLog = require('../../models/AuditLog.entity');
const bcrypt = require('bcrypt');
const DeletionRequest = require('../../models/DeletionRequest.entity');
const crypto = require('crypto');
const DoctorWork = require('../../models/DoctorWork.entity');

exports.getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit
    const { role, status, q, include_deleted } = req.query
    const filter = {
        deleted_at: null
    }
    if (role)
        filter.role = role
    if (status)
        filter.status = status
    if (q)
        filter.$or = [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } }
        ]
    if (include_deleted === 'true')
        delete filter.deleted_at
    const users = await User.find(filter)
        .select({
            password_hash: false,
            secure_key: false,
            token: false,
            token_purpose: false,
            token_expires_at: false
        }).skip(skip).limit(limit);

    return res.status(200).json({ success: true, users: users })
};

exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findOne({ user_id: userId })
        .select({
            password_hash: false,
            secure_key: false,
            token: false,
            token_purpose: false,
            token_expires_at: false
        });
    if (!user)
        return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, user: user })
}

exports.getAllDoctors = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit
    const { status, q, include_deleted, specialty } = req.query

    userFilter = {
        role: 'doctor',
        deleted_at: null,
    };

    portfolioFilter = {
        specialty: { $exists: true, $ne: null }
    };

    if (specialty)
        portfolioFilter.specialty = specialty

    if (status)
        userFilter.status = status

    if (q)
        userFilter.$or = [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } }
        ]

    if (include_deleted === 'true')
        delete userFilter.deleted_at

    const doctors = await DoctorPortfolio.find(portfolioFilter)
        .populate({
            path: 'user_id',
            match: userFilter,
            select: 'name email phone status',
        }).skip(skip).limit(limit);

    const filteredDoctors = doctors.filter(doctor => doctor.user_id);

    const formattedDoctors = filteredDoctors.map(doctor => {
        return {
            portfolio_id: doctor.portfolio_id,
            name: doctor.doctor_name,
            specialty: doctor.specialty,
            email: doctor.user_id.email,
            status: doctor.user_id.status,
            user_id: doctor.user_id._id,
        };
    });
    return res.status(200).json({
        success: true,
        doctors: formattedDoctors
    });
}

exports.getDoctorById = async (req, res) => {
    const doctorId = req.params.id;

    const doctor = await DoctorPortfolio.findOne({ portfolio_id: doctorId })
        .populate({
            path: 'user_id',
            select: 'name email phone status medical_id_image',
        });

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor not found"
        });
    }
    if (!doctor.user_id) {
        return res.status(404).json({
            success: false,
            message: "Associated user not found"
        });
    }

    const formattedDoctor = {
        portfolio_id: doctor.portfolio_id,
        name: doctor.doctor_name,
        email: doctor.user_id.email,
        status: doctor.user_id.status,
        specialty: doctor.specialty,
        phone: doctor.phone_number,
        medical_id_image: doctor.user_id.medical_id_image
    };

    return res.status(200).json({
        success: true,
        doctor: formattedDoctor
    });
}

exports.getDoctorPatients = async (req, res) => {
    const doctorId = req.params.id;
    const doctor = await DoctorPortfolio.findOne({ portfolio_id: doctorId });
    if (!doctor)
        return res.status(404).json({ success: false, message: "Doctor not found" });

    const bookings = await Booking.find({ portfolio_id: doctor._id })
    const bookingsIds = bookings.map(booking => booking._id)
    const bookingItems = await BookingItem.find({
        booking_id: { $in: bookingsIds },
        deleted_at: null
    });
    return res.status(200).json({ success: true, bookingItems })

}

exports.getPendingDoctors = async (req, res) => {
    const userFilter = {
        role: "doctor",
        status: "pending"
    }
    const doctors = await DoctorPortfolio.find()
        .populate({
            path: "user_id",
            match: userFilter,
            select: "email"
            // select: "portfolio_id doctor_name specialty title phone_number working_hours"
        })
    if (!doctors)
        return res.status(404).json({ success: false, message: "Doctor isn't found" });

    const filteredDoctors = doctors.filter(doctor => doctor.user_id);

    const formattedDoctors = filteredDoctors.map(doctor => {
        return {
            portfolio_id: doctor.portfolio_id,
            name: doctor.doctor_name,
            specialty: doctor.specialty,
            email: doctor.user_id.email,
            phone: doctor.phone_number,
            working_hours: doctor.working_hours,
        };
    });

    return res.status(200).json({ success: true, doctors: formattedDoctors })
}

exports.getDoctorVerification = async (req, res, next) => {
    const portfolio_id = req.params.id;
    const filter = {
        status: "pending",
    }
    const doctor = await DoctorPortfolio.findOne({ portfolio_id: portfolio_id })
        .populate({
            path: 'user_id',
            match: filter,
            select: 'name email phone status medical_id_image',
        });

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor not found"
        });
    }

    if (!doctor.user_id) {
        return res.status(404).json({
            success: false,
            message: "Associated user not found"
        });
    }

    const formattedDoctor = {
        portfolio_id: doctor.portfolio_id,
        name: doctor.doctor_name,
        specialty: doctor.specialty,
        email: doctor.user_id.email,
        phone: doctor.phone_number,
        status: doctor.user_id.status,
        medical_id_image: doctor.user_id.medical_id_image
    }

    return res.status(200).json({
        success: true,
        doctor: formattedDoctor
    });
}
//Sending E-mail feature isn't done yet.
exports.ApproveDoctor = async (req, res) => {
    const portfolio_id = req.params.id

    const doctor = await DoctorPortfolio.findOne({
        portfolio_id
    }).populate({
        path: 'user_id',
        select: 'name email phone status medical_id_image'
    });

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor not found"
        });
    }

    if (doctor.verification_status !== "pending") {
        return res.status(409).json({
            success: false,
            message: "Doctor is not pending verification"
        });
    }

    doctor.verification_status = req.body.status || "approved";
    doctor.rejection_reason = null;
    doctor.user_id.status = "active";
    await doctor.save();
    await doctor.user_id.save();
    // await doctor.updateOne()
    await AuditLog.create({
        actor_id: req.user._id,
        actor_role: req.user.role,
        action: "approve_doctor",
        entity_type: "DoctorPortfolio",
        entity_id: doctor._id,
        ip: req.ip,
        metadata: {
            portfolio_id: doctor.portfolio_id,
            doctor_name: doctor.doctor_name,
            specialty: doctor.specialty,
            email: doctor.user_id.email,
            phone: doctor.phone_number
        }
    });

    res.status(202).json({
        success: true,
        message: doctor,
        audit_log: {
            actor_id: req.user._id,
            actor_role: req.user.role,
            action: "approve_doctor",
            entity_type: "DoctorPortfolio",
            entity_id: doctor._id,
            ip: req.ip,
            metadata: {
                portfolio_id: doctor.portfolio_id,
                doctor_name: doctor.doctor_name,
                specialty: doctor.specialty,
                email: doctor.user_id.email,
                phone: doctor.phone_number
            }
        }
    });
}

exports.RejectDoctors = async (req, res) => {
    const portfolio_id = req.params.id

    const doctor = await DoctorPortfolio.findOne({
        portfolio_id,
    }).populate({
        path: 'user_id',
        select: 'name email phone status medical_id_image'
    });

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor not found"
        });
    }
    if (doctor.verification_status !== "pending") {
        return res.status(409).json({
            success: false,
            message: "Doctor is not pending verification"
        });
    }
    const { reason } = req.body;

    if (!reason || reason.trim().length < 10) {
        return res.status(400).json({
            success: false,
            message: "Rejection reason must be at least 10 characters"
        });
    }
    doctor.verification_status = "rejected";
    doctor.rejection_reason = reason;
    doctor.user_id.status = "active";
    await doctor.save();
    await doctor.user_id.save();
    // await doctor.updateOne()
    res.status(202).json({
        success: true,
        message: doctor
    });
}

exports.getAllPatients = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit
    const { status, q, include_deleted } = req.query

    const filter = {
        role: 'patient',
        deleted_at: null,
    };

    if (status)
        filter.status = status

    if (q)
        filter.$or = [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } }
        ]

    if (include_deleted === 'true')
        delete filter.deleted_at

    const patients = await User.find(filter)
        .select({
            password_hash: false,
            secure_key: false,
            token: false,
            token_purpose: false,
            token_expires_at: false
        }).skip(skip).limit(limit);

    return res.status(200).json({ success: true, patients: patients })
}

exports.getPatientById = async (req, res) => {
    const patientId = req.params.id;
    const patient = await User.findById(patientId)
        .select({
            password_hash: false,
            secure_key: false,
            token: false,
            token_purpose: false,
            token_expires_at: false
        });
    if (!patient)
        return res.status(404).json({ success: false, message: "Patient not found" });
    return res.status(200).json({ success: true, patient: patient })
}

exports.createUser = async (req, res) => {
    const { name, email, phone, role, doctor_name, specialty, title } = req.body;

    if (!name || !email || !phone || !role || (role === 'doctor' && (!doctor_name || !specialty))) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "User with this email already exists"
        });
    }

    const allowedRoles = ['admin', 'doctor', 'patient'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Invalid role"
        });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
        return res.status(409).json({
            success: false,
            message: "User with this phone number already exists"
        });
    }

    const tempPassword = crypto.randomBytes(32).toString('hex');
    const password_hash = await bcrypt.hash(tempPassword, 10);
    const newUser = new User({
        name,
        email,
        phone,
        role,
        status: role === 'doctor' ? 'active' : 'pending',
        password_hash
    });

    await newUser.save();
    let doctorPortfolio = null;
    if (role === 'doctor') {
        doctorPortfolio = new DoctorPortfolio({
            user_id: newUser._id,
            doctor_name,
            specialty,
            title
        });
        await doctorPortfolio.save();
    }
    //Didn't yet include the password-reset function so the user reset password through link

    return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
            user_id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            status: newUser.status,
            doctor_portfolio: doctorPortfolio ? {
                doctor_name: doctorPortfolio.doctor_name,
                specialty: doctorPortfolio.specialty,
                title: doctorPortfolio.title
            } : null
        }
    });
}

exports.updateUserStatus = async (req, res) => {
    console.log("updateUserStatus was reached");
    const userId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: "Missing required field: status"
        });
    }

    const allowedStatuses = ['active', 'suspended'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status"
        });
    }

    const user = await User.findOne({ user_id: userId });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    if (status === 'suspended') {

        if (user.user_id === req.user.user_id) {
            return res.status(403).json({
                success: false,
                message: "You cannot suspend your own account"
            });
        }

        if (user.role === 'admin' && user.status === 'active') {
            const activeAdmins = await User.countDocuments({
                role: 'admin',
                status: 'active',
                deleted_at: null
            });

            if (activeAdmins <= 1) {
                return res.status(409).json({
                    success: false,
                    message: "Cannot suspend the last active admin"
                });
            }
        }
    }
    user.status = status;
    await user.save();
    if (status === 'suspended') {
        await RefreshToken.updateMany(
            {
                user_id: user._id,
                revoked_at: null
            },
            {
                $set: { revoked_at: new Date() }
            }
        );
    }
    return res.status(200).json({
        success: true,
        message: "User status updated successfully",
        user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status
        }
    });
}

exports.updateUserData = async (req, res) => {
    const userId = req.params.id;
    const { name, email, phone, address, birth_date } = req.body;
    const existingEmailUser = await User.findOne({ email, user_id: { $ne: userId } });
    if (existingEmailUser) {
        return res.status(409).json({
            success: false,
            message: "Email is already in use by another user"
        });
    }

    const existingPhoneUser = await User.findOne({ phone, user_id: { $ne: userId } });
    if (existingPhoneUser) {
        return res.status(409).json({
            success: false,
            message: "Phone number is already in use by another user"
        });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (birth_date) updateData.birth_date = birth_date;

    const updatedUser = await User.findOneAndUpdate(
        { user_id: userId },
        { $set: updateData },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    return res.status(200).json({
        success: true,
        message: "User data updated successfully",
        user: {
            user_id: updatedUser.user_id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            birth_date: updatedUser.birth_date,
            role: updatedUser.role,
            status: updatedUser.status
        }
    });
}

exports.updateUserRole = async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({
            success: false,
            message: "Missing required field: role"
        });
    }
    const allowedRoles = ['admin', 'patient'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Invalid role"
        });
    }

    const user = await User.findOne({ user_id: userId });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    if (user.user_id === req.user.user_id) {
        return res.status(403).json({
            success: false,
            message: "You cannot change your own role"
        });
    }
    if (user.role === 'admin' && user.status === 'active' && role === 'patient') {

        const activeAdmins = await User.countDocuments({
            role: 'admin',
            status: 'active',
            deleted_at: null
        });

        if (activeAdmins <= 1) {
            return res.status(409).json({
                success: false,
                message: "Cannot demote the last active admin"
            });
        }
    }
    const previousRole = user.role;
    user.role = role;
    await user.save();
    await RefreshToken.updateMany(
        {
            user_id: user._id,
            revoked_at: null
        },
        {
            $set: { revoked_at: new Date() }
        }
    );
    await AuditLog.create({
        actor_id: req.user.user_id,
        actor_role: req.user.role,
        action: 'user_role_updated',
        entity_type: 'User',
        entity_id: user.user_id,
        ip: req.ip,
        metadata: {
            previous_role: previousRole,
            new_role: role
        }
    });
    return res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status
        }
    });
}

exports.getAuditLogs = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { actor_id, action, entity_type, entity_id, q } = req.query;
    const filter = {};

    if (actor_id) filter.actor_id = actor_id;
    if (action) filter.action = action;
    if (entity_type) filter.entity_type = entity_type;
    if (entity_id) filter.entity_id = entity_id;
    if (q) {
        filter.$or = [
            { 'metadata.previous_role': { $regex: q, $options: 'i' } },
            { 'metadata.new_role': { $regex: q, $options: 'i' } },
            { 'metadata.portfolio_id': { $regex: q, $options: 'i' } },
            { 'metadata.doctor_name': { $regex: q, $options: 'i' } },
            { 'metadata.specialty': { $regex: q, $options: 'i' } },
            { 'metadata.email': { $regex: q, $options: 'i' } },
            { 'metadata.phone': { $regex: q, $options: 'i' } }
        ];
    }
    const logs = await AuditLog.find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
        success: true,
        logs: logs
    });
}

exports.getDeletionRequests = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
        return res.status(400).json({
            success: false,
            message: "Page and limit must be positive numbers"
        });
    }

    const skip = (page - 1) * limit;

    const { status } = req.query;

    const allowedStatuses = ['pending', 'approved', 'rejected'];

    if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid deletion request status"
        });
    }

    const filter = {};

    if (status) {
        filter.status = status;
    }

    const totalRequests = await DeletionRequest.countDocuments(filter);

    const requests = await DeletionRequest.find(filter)
        .populate({
            path: 'user_id',
            select: 'name email phone'
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const formattedRequests = requests.map(request => {
        const patientName = request.user_id?.name || "Unknown";

        const maskedName = patientName
            .split(' ')
            .map(part => part[0] + '*'.repeat(Math.max(part.length - 1, 0)))
            .join(' ');

        return {
            _id: request._id,
            patient_name: maskedName,
            reason: request.reason,
            status: request.status,
            createdAt: request.createdAt,
            reviewed_at: request.reviewed_at
        };
    });

    return res.status(200).json({
        success: true,
        requests: formattedRequests,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalRequests / limit),
            totalRequests,
            limit
        }
    });
};

exports.reviewDeletionRequest = async (req, res) => {
    const requestId = req.params.id;
    const { decision, reason } = req.body;

    const allowedDecisions = ['approved', 'rejected'];

    if (!allowedDecisions.includes(decision)) {
        return res.status(400).json({
            success: false,
            message: "Decision must be approved or rejected"
        });
    }

    if (decision === 'rejected' && (!reason || reason.trim().length < 10)) {
        return res.status(400).json({
            success: false,
            message: "A rejection reason of at least 10 characters is required"
        });
    }
    const request = await DeletionRequest.findById(requestId);

    if (!request) {
        return res.status(404).json({
            success: false,
            message: "Deletion request not found"
        });
    }

    if (request.status !== 'pending') {
        return res.status(409).json({
            success: false,
            message: "This deletion request has already been reviewed"
        });
    }

    const user = await User.findById(request.user_id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Associated patient not found"
        });
    }

    if (decision === 'approved') {
        await BookingItem.updateMany(
            { user_id: user._id },
            {
                $set: {
                    patient_name: 'Deleted Patient',
                    patient_phone: null,
                    patient_age: null,
                    patient_address: null
                }
            }
        );
        await User.updateOne(
            { _id: user._id },
            {
                $set: {
                    name: 'Deleted Patient',
                    email: `deleted_${user._id}@deleted.invalid`,
                    phone: `deleted_${user._id}`,
                    status: 'suspended',
                    deleted_at: new Date()
                },
                $unset: {
                    medical_id_image: 1,
                    secure_key: 1,
                    token: 1,
                    token_purpose: 1,
                    token_expires_at: 1
                }
            }
        );

        await RefreshToken.updateMany(
            {
                user_id: user._id,
                revoked_at: null
            },
            {
                $set: { revoked_at: new Date() }
            }
        );
    }

    request.status = decision;
    request.reason = reason ? reason.trim() : request.reason;
    request.reviewed_by = req.user._id;
    request.reviewed_at = new Date();

    await request.save();

    await AuditLog.create({
        actor_id: req.user.user_id,
        actor_role: req.user.role,
        action: `deletion_request_${decision}`,
        entity_type: 'DeletionRequest',
        entity_id: request._id,
        ip: req.ip,
        metadata: {
            patient_id: user.user_id,
            decision: decision,
            reason: reason || null
        }
    });

    return res.status(200).json({
        success: true,
        message: `Deletion request ${decision} successfully`,
        request: {
            _id: request._id,
            status: request.status,
            reviewed_at: request.reviewed_at
        }
    });
};

exports.getAllBookings = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, q } = req.query;

    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (q) {
        filter.$or = [
            { patient_name: { $regex: q, $options: 'i' } },
            { patient_phone: { $regex: q, $options: 'i' } },
            { patient_address: { $regex: q, $options: 'i' } }
        ];
    }

    const totalBookings = await BookingItem.countDocuments(filter);

    const bookings = await BookingItem.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
        success: true,
        bookings: bookings,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalBookings / limit),
            totalBookings,
            limit
        }
    });
}

exports.getBookingById = async (req, res) => {
    const bookingId = req.params.id;

    const booking = await BookingItem.findOne({ booking_id: bookingId });

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: "Booking not found"
        });
    }

    return res.status(200).json({
        success: true,
        booking: booking
    });
}

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    if (userId === req.user.user_id) {
        return res.status(403).json({
            success: false,
            message: "You cannot delete your own account"
        });
    }

    const user = await User.findOne({ user_id: userId });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    if (user.role === 'admin' && user.status === 'active') {
        const activeAdmins = await User.countDocuments({
            role: 'admin',
            status: 'active',
            deleted_at: null
        });

        if (activeAdmins <= 1) {
            return res.status(409).json({
                success: false,
                message: "Cannot delete the last active admin"
            });
        }
    }

    user.deleted_at = new Date();
    user.deleted_by = req.user._id;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "تم حذف المستخدم بنجاح",
        user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            deleted_at: user.deleted_at
        }
    });
}

exports.restoreUser = async (req, res) => {
    const userId = req.params.id;

    const user = await User.findOne({ user_id: userId });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "لم يتم العثور على المستخدم"
        });
    }

    if (!user.deleted_at) {
        return res.status(400).json({
            success: false,
            message: "المستخدم ليس محذوفًا"
        });
    }

    user.deleted_at = null;
    user.deleted_by = null;
    user.status = 'suspended';
    await user.save();

    return res.status(200).json({
        success: true,
        message: "تم استعادة المستخدم بنجاح",
        user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status
        }
    });
}

exports.deleteBooking = async (req, res) => {
    const bookingId = req.params.id;

    const booking = await BookingItem.findOne({ booking_id: bookingId });

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: "Booking not found"
        });
    }
    if (booking.status === 'completed' || booking.status === 'cancelled') {
        return res.status(400).json({
            success: false,
            message: "Cannot delete a completed or cancelled booking"
        });
    }
    if (booking.status === 'accepted' || booking.status === 'in_progress') {
        return res.status(400).json({
            success: false,
            message: "Cannot delete an accepted or in-progress booking"
        });
    }
    booking.deleted_at = new Date();
    await booking.save();

    return res.status(200).json({
        success: true,
        message: "Booking deleted successfully",
        booking: {
            booking_id: booking.booking_id,
            patient_name: booking.patient_name,
            patient_phone: booking.patient_phone,
            patient_address: booking.patient_address,
            status: booking.status,
            deleted_at: booking.deleted_at
        }
    });
}

exports.updateBooking = async (req, res) => {
    const bookingId = req.params.id;
    const { status, total_patients, appointment_date, appointment_time } = req.body;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid booking ID"
        });
    }

    if (!status && !total_patients && !appointment_date && !appointment_time) {
        return res.status(400).json({
            success: false,
            message: "At least one field (status, total_patients, appointment_date, appointment_time) must be provided for update"
        });
    }

    const allowedStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status"
        });
    }

    if (total_patients && (typeof total_patients !== 'number' || total_patients < 1)) {
        return res.status(400).json({
            success: false,
            message: "total_patients must be a positive number"
        });
    }

    if (appointment_date !== undefined) {
        const parseDate = new Date(appointment_date);
        if (isNaN(parseDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment_date format"
            });
        }
    }

    if (appointment_time !== undefined && (typeof appointment_time !== 'string' || !appointment_time.trim())) {
        return res.status(400).json({
            success: false,
            message: "Invalid appointment_time format"
        });
    }

    const booking = await BookingItem.findOne({ booking_id: bookingId });

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: "Booking not found"
        });
    }
    if (booking.deleted_at) {
        return res.status(400).json({
            success: false,
            message: "Cannot update a deleted booking"
        });
    }

    if (total_patients !== undefined) {
        const acceptedBookingsCount = await BookingItem.countDocuments({
            booking_id: bookingId,
            status: { $in: ['accepted', 'in_progress'] },
            deleted_at: null
        });

        if (total_patients < acceptedBookingsCount) {
            return res.status(400).json({
                success: false,
                message: "total_patients cannot be less than the number of accepted or in-progress bookings"
            });
        }
    }

    if (status) booking.status = status;
    if (total_patients) booking.total_patients = total_patients;
    if (appointment_date) booking.appointment_date = new Date(appointment_date);
    if (appointment_time) booking.appointment_time = appointment_time;
    await booking.save();
    if (status === 'cancelled') {
        await BookingItem.updateMany(
            {
                booking_id: booking._id,
                status: { $in: ['pending', 'accepted'] },
                deleted_at: null
            },
            {
                $set: {
                    status: 'cancelled'
                }
            }
        );
    }
    const patientsToNotify = affectedItems.map(item => ({
        booking_item_id: item._id,
        user_id: item.user_id?._id || null,
        patient_name: item.patient_name ||
            item.user_id?.name ||
            'Unknown patient',
        patient_phone: item.patient_phone ||
            item.user_id?.phone ||
            null
    }));

    return res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        booking: {
            booking_id: booking.booking_id,
            patient_name: booking.patient_name,
            patient_phone: booking.patient_phone,
            patient_address: booking.patient_address,
            status: booking.status,
            total_patients: booking.total_patients,
            appointment_date: booking.appointment_date,
            appointment_time: booking.appointment_time
        },
        patients_to_notify: patientsToNotify
    });
}

exports.getWaitingBookings = async (req, res) => {
    const { doctor_id, date, type } = req.query;

    if (!doctor_id || !date) {
        return res.status(400).json({
            success: false,
            message: "doctor_id and date are required"
        });
    }

    const doctor = await DoctorPortfolio.findOne({
        portfolio_id: doctor_id
    });

    if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor not found"
        });
    }

    const [year, month, day] = date.split('-').map(Number);

    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    const bookings = await Booking.find({
        portfolio_id: doctor._id,
        appointment_date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    const waiting = [];
    const completed = [];
    const removed = [];

    if (bookings.length === 0) {
        return res.status(200).json({
            success: true,
            waiting,
            completed,
            removed
        });
    }

    const bookingIds = bookings.map(booking => booking._id);

    const filter = {
        booking_id: { $in: bookingIds }
    };

    if (type) {
        filter.type = type;
    }

    // Include deleted items so they can appear in the Removed group.
    const bookingItems = await BookingItem.find(filter)
        .sort({ queue_number: 1 });

    const now = new Date();
    const averageSessionMinutes = 15;

    for (const item of bookingItems) {
        const booking = bookings.find(
            booking => booking._id.toString() === item.booking_id.toString()
        );

        if (
            item.deleted_at ||
            ['rejected', 'cancelled'].includes(item.status) ||
            booking.status === 'cancelled' ||
            booking.deleted_at
        ) {
            removed.push(item);
        }
        else if (item.status === 'completed') {
            completed.push(item);
        }
        else if (['pending', 'accepted'].includes(item.status)) {
            const waitingMinutes = item.createdAt
                ? Math.floor((now - new Date(item.createdAt)) / 60000)
                : null;

            waiting.push({
                ...item.toObject(),
                waiting_minutes: waitingMinutes
            });
        }
    }

    for (let i = 0; i < waiting.length; i++) {
        waiting[i] = {
            ...waiting[i],
            estimated_wait_minutes: i * averageSessionMinutes
        };
    }

    return res.status(200).json({
        success: true,
        waiting,
        completed,
        removed
    });
};

exports.getAllServices = async (req, res) => {
    const { status, doctor_id, q, include_deleted, page, limit } = req.query;

    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (doctor_id) {
        const doctor = await DoctorPortfolio.findOne({ portfolio_id: doctor_id });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }
        filter.portfolio_id = doctor._id;
    }

    if (q) {
        filter.$or = [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
        ];
    }

    if (include_deleted !== 'true') {
        filter.deleted_at = null;
    }

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const totalServices = await DoctorWork.countDocuments(filter);

    const services = await DoctorWork.find(filter)
        .populate({
            path: 'portfolio_id',
            select: 'portfolio_id doctor_name specialty',
            populate: {
                path: 'user_id',
                select: 'name email phone'
            }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    return res.status(200).json({
        success: true,
        services,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(totalServices / limitNumber),
            totalServices,
            limit: limitNumber
        }
    });

}

exports.deleteService = async (req, res) => {
    const serviceId = req.params.id;

    const service = await DoctorWork.findById(serviceId);

    if (!service) {
        return res.status(404).json({
            success: false,
            message: "Service not found"
        });
    }

    if (service.deleted_at) {
        return res.status(400).json({
            success: false,
            message: "Service is already deleted"
        });
    }

    service.deleted_at = new Date();
    await service.save();

    return res.status(200).json({
        success: true,
        message: "Service deleted successfully",
        service: {
            _id: service._id,
            title: service.title,
            description: service.description,
            price: service.price,
            status: service.status,
            deleted_at: service.deleted_at
        }
    });
}

exports.updateServiceStatus = async (req, res) => {
    const serviceId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: "Missing required field: status"
        });
    }

    const allowedStatuses = ['pending', 'active', 'rejected'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status"
        });
    }

    const service = await DoctorWork.findById(serviceId);

    if (!service) {
        return res.status(404).json({
            success: false,
            message: "Service not found"
        });
    }

    service.status = status;
    if (service.status === 'rejected') {
        const { reason } = req.body;
        if (!reason || reason.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Rejection reason must be at least 10 characters"
            });
        }
        service.rejection_reason = reason;
    } else {
        service.rejection_reason = null; // Clear rejection reason if status is not rejected
    }
    await service.save();

    return res.status(200).json({
        success: true,
        message: "Service status updated successfully",
        service: {
            _id: service._id,
            title: service.title,
            description: service.description,
            price: service.price,
            status: service.status,
            rejection_reason: service.rejection_reason
        }
    });
}

exports.updateBookingItem = async (req, res) => {
    const bookingItemId = req.params.id;
    const { status, queue_number } = req.body;
    if (!status && !queue_number) {
        return res.status(400).json({
            success: false,
            message: "At least one field (status, queue_number) must be provided for update"
        });
    }

    const allowedStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status"
        });
    }


    const bookingItem = await BookingItem.findById(bookingItemId);

    if (!bookingItem) {
        return res.status(404).json({
            success: false,
            message: "Booking item not found"
        });
    }
    if (await BookingItem.findOne({ queue_number: queue_number, _id: { $ne: bookingItemId } })) {
        return res.status(400).json({
            success: false,
            message: "queue_number must be unique"
        });
    }

    if (queue_number !== undefined) {
        if (!Number.isInteger(Number(queue_number)) || Number(queue_number) < 1) {
            return res.status(400).json({
                success: false,
                message: "queue_number must be a positive integer"
            });
        }
    }
    if (status !== undefined) {
        bookingItem.status = status;

        if (status === 'completed') {
            if (!bookingItem.completed_at) {
                bookingItem.completed_at = new Date();
            }
        } else {
            bookingItem.completed_at = null;
        }
    }
    bookingItem.queue_number = Number(queue_number)
    await bookingItem.save();

    return res.status(200).json({
        success: true,
        message: "Booking item updated successfully",
        booking_item: {
            _id: bookingItem._id,
            booking_id: bookingItem.booking_id,
            user_id: bookingItem.user_id,
            queue_number: bookingItem.queue_number,
            patient_name: bookingItem.patient_name,
            patient_phone: bookingItem.patient_phone,
            patient_age: bookingItem.patient_age,
            patient_address: bookingItem.patient_address,
            status: bookingItem.status,
            type: bookingItem.type,
            qr_code: bookingItem.qr_code,
            completed_at: bookingItem.completed_at,
            deleted_at: bookingItem.deleted_at
        }
    });
}

exports.getAllBookingItems = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, type, q } = req.query;

    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (type) {
        filter.type = type;
    }

    if (q) {
        filter.$or = [
            { patient_name: { $regex: q, $options: 'i' } },
            { patient_phone: { $regex: q, $options: 'i' } },
            { patient_address: { $regex: q, $options: 'i' } }
        ];
    }

    const totalBookingItems = await BookingItem.countDocuments(filter);

    const bookingItems = await BookingItem.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
        success: true,
        booking_items: bookingItems,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalBookingItems / limit),
            totalBookingItems,
            limit
        }
    });
}

exports.deleteBookingItem = async (req, res) => {
    const bookingItemId = req.params.id;

    const bookingItem = await BookingItem.findById(bookingItemId);

    if (!bookingItem) {
        return res.status(404).json({
            success: false,
            message: "Booking item not found"
        });
    }

    if (bookingItem.deleted_at) {
        return res.status(400).json({
            success: false,
            message: "Booking item is already deleted"
        });
    }

    bookingItem.deleted_at = new Date();
    await bookingItem.save();

    return res.status(200).json({
        success: true,
        message: "Booking item deleted successfully",
        booking_item: {
            _id: bookingItem._id,
            booking_id: bookingItem.booking_id,
            user_id: bookingItem.user_id,
            queue_number: bookingItem.queue_number,
            patient_name: bookingItem.patient_name,
            patient_phone: bookingItem.patient_phone,
            patient_age: bookingItem.patient_age,
            patient_address: bookingItem.patient_address,
            status: bookingItem.status,
            type: bookingItem.type,
            qr_code: bookingItem.qr_code,
            completed_at: bookingItem.completed_at,
            deleted_at: bookingItem.deleted_at
        }
    });
}

exports.resetUser2FA = async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    if (!user.enable_2fa && !user.secure_key) {
        return res.status(400).json({
            success: false,
            message: "2FA is already disabled for this user"
        });
    }

    user.secure_key = null;
    user.enable_2fa = false;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "2FA reset successfully. User must set it up again on next login.",
        user: {
            _id: user._id,
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            enable_2fa: user.enable_2fa
        }
    });
};

exports.forceLogoutUser = async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const result = await RefreshToken.updateMany(
        {
            user_id: user._id,
            revoked_at: null
        },
        {
            $set: {
                revoked_at: new Date()
            }
        }
    );

    return res.status(200).json({
        success: true,
        message: "User logged out successfully",
        revoked_tokens: result.modifiedCount
    });
};



