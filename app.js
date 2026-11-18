const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

// Global server configuration
require("./config/server-config")(app);

// Body + cookie parsing (safe to repeat if server-config already does this)
app.use(express.json());
app.use(cookieParser());

// Traffic
app.use('/api/auth', require('./routes/auth/auth.routes'));

// Must be registered after all routes
app.use(require('./middleware/globalError'));

module.exports = app;