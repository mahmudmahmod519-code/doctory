// logicModels/module_name_ex/moduleName.controller.js
// Reference implementation of the Auth flow (Mongoose based).
// This is the base that will be moved to logicModels/auth/auth.controller.js in Phase 2.
const User = require("../../models/User.entity.js");
const RefreshToken = require("../../models/RefreshToken.entity.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../../utils/mailer.js");
const crypto = require("crypto");
const config = require("../../config/env-config");

// ==========================================
// ✅ APIs للـ Guest
// ==========================================

// POST /register - إنشاء حساب جديد
exports.register = async (req, res) => {
    const { name, email, password, phone, address, role } = req.body;

    // نوع الحساب: مريض أو دكتور فقط (الأدمن يُنشأ من داخل لوحة الأدمن)
    const accountRole = ['patient', 'doctor'].includes(role) ? role : 'patient';

    // التحقق من عدم وجود البريد مسبقاً
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        return res.status(400).json({ 
            status: "error", 
            message: "البريد الإلكتروني مسجل بالفعل" 
        });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        user_id: crypto.randomUUID(),
        name,
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        phone: phone || null,
        address: address || null,
        role: accountRole,
        // المريض يقدر يستخدم حسابه فوراً، والدكتور يفضل pending لحين توثيق النقابة
        status: accountRole === 'doctor' ? 'pending' : 'active',
    });

    // إنشاء JWT وتعيينه في HTTP-Only Cookie
    const token = jwt.sign(
        { user_id: newUser.user_id, email: newUser.email, role: newUser.role },
        config.auth.jwt.secret,
        { expiresIn: config.auth.jwt.expires_in }
    );
    
    res.cookie('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 أيام
    });

    res.status(201).json({ 
        status: "success", 
        message: "تم إنشاء الحساب بنجاح", 
        data: { user_id: newUser.user_id, name: newUser.name, email: newUser.email, role: newUser.role } 
    });
};

// POST /login - تسجيل الدخول
exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        return res.status(401).json({ 
            status: "error", 
            message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" 
        });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return res.status(401).json({ 
            status: "error", 
            message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" 
        });
    }

    // الحساب الموقوف أو المحذوف لا يستطيع الدخول
    if (user.status === 'suspended' || user.deleted_at) {
        return res.status(403).json({
            status: "error",
            message: "الحساب غير نشط حالياً. تواصل مع الدعم."
        });
    }

    // إنشاء JWT
    const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role },
        config.auth.jwt.secret,
        { expiresIn: config.auth.jwt.expires_in }
    );
    
    res.cookie('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 أيام
    });

    // تحديث آخر دخول
    await User.updateOne({ user_id: user.user_id }, { $set: { last_login: new Date() } });

    res.json({ 
        status: "success", 
        message: "تم تسجيل الدخول بنجاح", 
        data: { user_id: user.user_id, name: user.name, email: user.email, role: user.role } 
    });
};

// POST /forgot-password - نسيت كلمة المرور
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        // لا نكشف عن وجود البريد من عدمه (أمان)
        return res.json({ 
            status: "success", 
            message: "إذا كان البريد مسجلاً، سيتم إرسال رابط الاستعادة" 
        });
    }

    // توليد رمز استعادة
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // ساعة واحدة

    await User.updateOne(
        { user_id: user.user_id },
        { $set: { token: resetToken, updatedAt: new Date() } }
    );

    // إرسال البريد الإلكتروني
    const resetLink = `${config.ai.urlSite}/auth/reset-password/${resetToken}`;
    await mailer.sendEmail({
        to: email,
        subject: "استعادة كلمة المرور - Doctory",
        html: `
            <h2>مرحباً ${user.name}</h2>
            <p>تم طلب استعادة كلمة المرور. اضغط على الرابط التالي:</p>
            <a href="${resetLink}">استعادة كلمة المرور</a>
            <p>هذا الرابط صالح لمدة ساعة واحدة.</p>
            <p>إذا لم تطلب هذا، تجاهل هذه الرسالة.</p>
        `
    });

    res.json({ 
        status: "success", 
        message: "إذا كان البريد مسجلاً، سيتم إرسال رابط الاستعادة" 
    });
};

// POST /reset-password/:token - إعادة تعيين كلمة المرور
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { new_password } = req.body;

    const user = await User.findOne({
        token,
        updatedAt: { $gt: new Date(Date.now() - 3600000) } // صالح لمدة ساعة
    });

    if (!user) {
        return res.status(400).json({ 
            status: "error", 
            message: "رمز الاستعادة غير صالح أو منتهي الصلاحية" 
        });
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await User.updateOne(
        { user_id: user.user_id },
        { $set: { password_hash: hashedPassword, token: null, updatedAt: new Date() } }
    );

    res.json({ 
        status: "success", 
        message: "تم تحديث كلمة المرور بنجاح" 
    });
};

// POST /logout - تسجيل الخروج
exports.logout = async (req, res) => {
    res.clearCookie('session_token');
    res.json({ status: "success", message: "تم تسجيل الخروج بنجاح" });
};
