// middleware/helmet.js
// Security headers middleware. Applied in config/server-config.js
//
// CSP notes for the frontend:
// - cdn.tailwindcss.com      → Tailwind Play CDN used by every EJS view (Stitch designs).
// - cdn.jsdelivr.net         → Motion (motion.dev) animation library, loaded as a UMD bundle.
//                              To self-host instead: `npm i motion`, copy node_modules/motion/dist/motion.js
//                              to public/js/vendor/motion.js and drop this host.
// - lh3.googleusercontent.com → images exported from the Stitch designs (doctor photos, banners).
const helmet = require('helmet');

module.exports = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com", "https://lh3.googleusercontent.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            connectSrc: ["'self'"],
        },
    },
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    },
    crossOriginEmbedderPolicy: false,
});
