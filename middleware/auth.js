const jwt = require("jsonwebtoken");
const User = require("../models/User.entity.js");
const config = require("../config/env-config.js");

module.exports = async (req, res, next) => {
    let token = req.cookies?.session_token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ status: "error", message: "غير مصرح - يجب تسجيل الدخول" });
        }
        return res.redirect("/auth/login");
    }

    try {
        // استخدام المفتاح من ملف الـ Config
        const decode = jwt.verify(token, config.auth.jwt.secret);
        if (!decode) {
            if (req.path.startsWith('/api/')) {
                return res.status(401).json({ status: "error", message: "جلسة غير صالحة" });
            }
            return res.redirect("/auth/login");
        }

        req.user = await User.findOne({ user_id: decode.user_id }).lean();

        if (!req.user) {
            if (req.path.startsWith('/api/')) {
                return res.status(401).json({ status: "error", message: "المستخدم غير موجود" });
            }
            return res.redirect("/auth/login");
        }

        next();
    } catch (ex) {
        console.error("Auth middleware error:", ex.message);
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ status: "error", message: "جلسة غير صالحة" });
        }
        return res.redirect("/auth/login");
    }
};