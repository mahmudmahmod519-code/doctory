//use to protect form xss and sqlInjection and code injection

// middleware/securityLogger.js
const fs = require('fs');
const path = require('path');
const config = require('../config/env-config');

const logDir = path.join(__dirname, '../', config.logging.dir);
const logFile = path.join(logDir, 'suspicious.log');

// نتأكد إن مجلد الـ logs موجود قبل أي كتابة
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

module.exports = (req, res, next) => {
    // تسجيل الطلبات المشبوهة فقط
    const suspiciousPatterns = [
        /\.\.\//, // محاولة الوصول لملفات خارجية
        /union\s+select/i, // SQL Injection
        /<script/i, // XSS
        /eval\(/i // Code Injection
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => 
        pattern.test(req.url) || pattern.test(JSON.stringify(req.body))
    );
    
    if (isSuspicious) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: req.body,
            userAgent: req.headers['user-agent']
        };
        
        // تسجيل في ملف
        try {
            fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            console.error('⚠️ Failed to write security log:', error.message);
        }
        
        // إرسال تنبيه (يمكن إرسال إيميل أو Telegram)
        console.warn('⚠️ Suspicious request detected:', logEntry);
    }
    
    next();
};
