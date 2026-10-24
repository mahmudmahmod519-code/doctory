const cron = require('node-cron');

async function cleanupExpiredRefreshTokens() {
    try {
        const RefreshToken = require('../models/RefreshToken.entity.js');
        const deleted = await RefreshToken.deleteMany({ expires_at: { $lt: new Date() } });
        if (deleted.deletedCount > 0) {
            console.log(`🧹 تم حذف ${deleted.deletedCount} refresh token منتهية.`);
        }
    } catch (error) {
        console.error('❌ خطأ في تنظيف الـ Refresh Tokens:', error.message);
    }
}

/**
 * TODO(Phase 4): تنظيف الحجوزات/السلات المهجورة بعد 24 ساعة.
 * سيتم التنفيذ باستخدام Booking.entity.js:
 *   await Booking.deleteMany({ status: 'pending', createdAt: { $lt: cutoff } });
 */
async function cleanupAbandonedBookings() {
}

// جدولة كل المهام
function registerCronJobs() {
    cron.schedule('0 */6 * * *', cleanupExpiredRefreshTokens);
    console.log('✅ Cron Jobs تم تشغيلها بنجاح');
}

module.exports = {
    registerCronJobs,
    cleanupExpiredRefreshTokens,
    cleanupAbandonedBookings,
};
