const checkLogin = require("../../utils/checkLogin");

exports.get404Render = (req, res) => {
    res.status(404).render("errors/404", checkLogin(req, res));
};

exports.get500Render = (req, res) => {
    res.status(500).render("errors/500", {
        message: "خطأ في السيرفر",
        ...checkLogin(req, res)
    });
};
