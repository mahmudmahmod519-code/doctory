
module.exports = (app) => {
    // app.use(route, require('index file for module'));
    app.use('/', require('./static/index.js'));
    app.use('/', require('./User/index.js'));
    app.use('/', require('./errors/index.js'));
}

