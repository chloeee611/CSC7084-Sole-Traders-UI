const axios = require("axios");

exports.getTraderProfilePage = (req, res) => {
    const { isloggedin, traderId } = req.session;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    axios
        .get(`/traders/${traderId}`)
        .then((apiRes) => {
            const trader = apiRes.data.result;
            res.render("trader/profile/view-profile", { isloggedin, trader });
        })
        .catch((err) => {
            console.log(`Error making API request: ${err}`);
        });
};

exports.getEditDetailsPage = (req, res) => {
    const { isloggedin, traderId } = req.session;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    axios
        .get(`/traders/${traderId}`)
        .then((traderApiRes) => {
            const trader = traderApiRes.data.result;

            if (!trader) {
                res.redirect("/trader-login");
            }

            axios
                .get("/trade-types")
                .then((tradeTypeApiRes) => {
                    const tradeTypes = tradeTypeApiRes.data.result;

                    res.render("trader/profile/edit-profile", {
                        isloggedin,
                        trader,
                        tradeTypes,
                    });
                })
                .catch((err) => {
                    console.log(`Error making API request: ${err}`);
                });
        })
        .catch((err) => {
            console.log(`Error making API request: ${err}`);
        });
};

exports.postDetails = (req, res) => {
    const payload = req.body;
    const { traderId, isloggedin } = req.session;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    axios
        .put(`traders/${traderId}`, payload)
        .then((apiRes) => {
            console.log(apiRes.data);
            res.redirect("/trader-profile");
        })
        .catch((err) => {
            axios
                .get(`/traders/${traderId}`)
                .then((traderApiRes) => {
                    const trader = traderApiRes.data.result;

                    if (!trader) {
                        res.redirect("/trader-login");
                    }

                    axios
                        .get("/trade-types")
                        .then((tradeTypeApiRes) => {
                            const tradeTypes = tradeTypeApiRes.data.result;

                            res.render("trader/profile/edit-profile", {
                                errorResults:
                                    err.response.data.validationResults,
                                isloggedin,
                                trader,
                                tradeTypes,
                            });
                        })
                        .catch((err) => {
                            console.log(`Error making API request: ${err}`);
                        });
                })
                .catch((err) => {
                    console.log(`Error making API request: ${err}`);
                });
        });
};
