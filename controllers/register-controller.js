const axios = require("axios");

exports.getRegisterPage = (req, res) => {
    res.render("client/register");
};

exports.postRegister = (req, res) => {
    const { name, username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render("client/register", {
            error: "Passwords do not match",
        });
    }

    const payload = { name, username, email, password, confirmPassword };

    axios
        .post("trader-register", payload)
        .then((apiRes) => {
            if (apiRes.status === 201) {
                res.redirect("/trader-login?registered=1");
            } else {
                return res.render("client/register", {
                    error: apiRes.message,
                });
            }
        })
        .catch((err) => {
            return res.render("client/register", {
                error: err.response.data.message,
            });
        });
};
