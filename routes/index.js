module.exports = (app) => {
    // app.use(route, require('index file for module'));
    app.use('/', require('./static/index.js'));
    app.use('/', require('./User/index.js'));
    app.use('/', require('./auth/index.js'));
    app.use('/', require('./patient/index.js'));
    app.use('/', require('./DoctorPortfolio/index.js'));
    app.use('/', require('./doctor/index.js'));
    app.use('/', require('./admin/index.js'));
    app.use('/', require('./Notification/index.js'));
    app.use('/', require('./errors/index.js')); // keep last: 404 + 500 handlers
}
