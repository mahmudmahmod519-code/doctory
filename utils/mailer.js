// services/mailer.js (أو المسار الخاص بك)
const nodemailer = require('nodemailer');
const config = require('../config/env-config'); // استيراد ملف الإعدادات

// Create transporter باستخدام القيم من ملف الـ Config
const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
});

/**
 * Send email
 * @param {Object} options - { to, subject, html }
 */
async function sendEmail({ to, subject, html }) {
    try {
        const info = await transporter.sendMail({
            from: `"عطور أم القرى" <${config.email.user}>`,
            to,
            subject,
            html
        });
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
}

module.exports = { sendEmail };