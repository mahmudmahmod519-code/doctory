// middleware/helmet.js
// Security headers middleware. Applied in config/server-config.js
const helmet = require('helmet');

module.exports = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://fonts.googleapis.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            connectSrc: ["'self'"],
        },
    },
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    },
    crossOriginEmbedderPolicy: false,
});
