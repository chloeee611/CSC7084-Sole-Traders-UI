const axios = require("axios");

exports.getLoginPage = (req, res) => {
    res.render("client/login");
};

exports.postLogin = (req, res) => {
    const payload = req.body;

    axios
        .post("trader-login", payload)
        .then((apiRes) => {
            if (apiRes.status === 200) {
                req.session.isloggedin = true;
                req.session.traderId = apiRes.data.traderId;
                res.redirect("/trader-profile");
            } else {
                return res.render("client/login", {
                    error: apiRes.message,
                });
            }
        })
        .catch((err) => {
            return res.render("client/login", {
                error: err.response.data.message,
            });
        });
};

exports.getLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/trader-login");
    });
};
