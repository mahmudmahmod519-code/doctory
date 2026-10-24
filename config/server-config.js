const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('../middleware/helmet');
const securityLogger = require('../middleware/securityLogger');
const config = require('../config/env-config');

module.exports = (app) => {
    const isProduction = config.server.global.env === 'production';

    // Security headers
    app.use(helmet);

    // Log suspicious requests (XSS / SQLi / path traversal / code injection)
    app.use(securityLogger);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(express.static(path.join(__dirname, `../${config.server.global.public_file}`), {
        maxAge: isProduction ? 365 * 24 * 60 * 60 * 1000 : 0,
        immutable: isProduction,
        etag: true,
        lastModified: true
    }));

    app.use("/uploads", express.static(path.join(__dirname, `../${config.upload.uploadDir}`)));

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));
};
