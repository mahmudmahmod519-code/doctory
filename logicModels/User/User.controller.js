const speakeasy = require('speakeasy');
const User = require('../../models/User.entity.js');
const safeUser = (u) => ({
    user_id: u.user_id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    address: u.address,
    birth_date: u.birth_date,
    role: u.role,
    status: u.status,
    image_profile: u.image_profile,
    enable_2fa: u.enable_2fa
});

// PATCH /api/user/profile
exports.updateProfile = async (req, res) => {
    const allowed = ['name', 'email', 'phone', 'address', 'birth_date'];
    const updates = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ status: 'error', message: 'لا توجد بيانات للتحديث' });
    }

    if (updates.email) {
        updates.email = updates.email.toLowerCase();
        const taken = await User.findOne({ email: updates.email, _id: { $ne: req.user._id } });
        if (taken) {
            return res.status(409).json({ status: 'error', message: 'البريد الإلكتروني مستخدم بالفعل' });
        }
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
    ).lean();

    res.json({ status: 'success', message: 'تم تحديث البيانات بنجاح', data: safeUser(user) });
};

// DELETE /api/user/account  (soft delete)
exports.deleteAccount = async (req, res) => {
    await User.updateOne(
        { _id: req.user._id },
        { $set: { deleted_at: new Date(), deleted_by: req.user._id } }
    );
    res.clearCookie('session_token');
    res.json({ status: 'success', message: 'تم حذف الحساب بنجاح' });
};

// POST /api/user/upload-image
exports.uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'يجب رفع صورة' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    await User.updateOne({ _id: req.user._id }, { $set: { image_profile: imageUrl } });
    res.json({ status: 'success', message: 'تم رفع الصورة بنجاح', data: { image_profile: imageUrl } });
};

// POST /api/user/2fa/enable
exports.enable2fa = async (req, res) => {
    if (req.user.enable_2fa) {
        return res.status(400).json({ status: 'error', message: 'المصادقة الثنائية مفعلة بالفعل' });
    }
    const secret = speakeasy.generateSecret({ name: `Doctory (${req.user.email})` });
    await User.updateOne(
        { _id: req.user._id },
        { $set: { secure_key: secret.base32, enable_2fa: true } }
    );
    res.json({
        status: 'success',
        message: 'تم تفعيل المصادقة الثنائية',
        data: { secret: secret.base32, otpauth_url: secret.otpauth_url }
    });
};

// POST /api/user/2fa/disable
exports.disable2fa = async (req, res) => {
    if (['doctor', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ status: 'error', message: 'لا يمكن إلغاء المصادقة الثنائية لهذا الدور' });
    }
    await User.updateOne(
        { _id: req.user._id },
        { $set: { enable_2fa: false, secure_key: null } }
    );
    res.json({ status: 'success', message: 'تم إلغاء المصادقة الثنائية' });
};

// POST /api/user/change-role  (waiting for the doctor-verification design)
exports.changeRole = async (req, res) => {
    res.status(501).json({ status: 'error', message: 'لم يتم تنفيذ هذه الخاصية بعد' });
};