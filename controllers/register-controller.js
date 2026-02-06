const axios = require("axios");

exports.getRegisterPage = (req, res) => {
    res.render("client/register");
};

exports.postRegister = (req, res) => {
    const payload = req.body;

    axios
        .post("trader-register", payload)
        .then((apiRes) => {
            if (apiRes.status === 201) {
                res.redirect("/trader-login?registered=1");
            }
        })
        .catch((err) => {
            return res.render("client/register", {
                errorResults: err.response.data.validationResults,
            });
        });
};
