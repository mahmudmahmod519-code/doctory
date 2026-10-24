const checkLogin = require("../../utils/checkLogin");

exports.getHomeRender = (req, res) => {
    res.render("static/home", checkLogin(req, res));
};

exports.getAboutRender = (req, res) => {
    res.render("static/about", checkLogin(req, res));
};

exports.getContactRender = (req, res) => {
    res.render("static/contact", checkLogin(req, res));
};

exports.getFaqRender = (req, res) => {
    res.render("static/faq", checkLogin(req, res));
};

exports.getPrivacyRender = (req, res) => {
    res.render("static/privacy", checkLogin(req, res));
};

exports.getTermsRender = (req, res) => {
    res.render("static/terms", checkLogin(req, res));
};

exports.getRefundRender = (req, res) => {
    res.render("static/refund", checkLogin(req, res));
};