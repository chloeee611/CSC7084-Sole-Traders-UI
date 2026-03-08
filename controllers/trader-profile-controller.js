const axios = require("axios");

exports.getTraderProfilePage = (req, res) => {
    const { isloggedin, traderId } = req.session;
    const token = req.cookies.access_token;

    if (!isloggedin || !token) {
        res.redirect("/trader-login");
    }

    axios
        .get(`/traders/${traderId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
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
    const token = req.cookies.access_token;

    if (!isloggedin || !token) {
        res.redirect("/trader-login");
    }

    const traderRequest = axios.get(`/traders/${traderId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const tradeTypesRequest = axios.get("/trade-types", {
        headers: { Authorization: `Bearer ${token}` },
    });

    axios
        .all([traderRequest, tradeTypesRequest])
        .then(
            axios.spread((traderApiRes, tradeTypeApiRes) => {
                const trader = traderApiRes.data.result;

                if (!trader) {
                    res.redirect("/trader-login");
                }

                const tradeTypes = tradeTypeApiRes.data.result;

                res.render("trader/profile/edit-profile", {
                    isloggedin,
                    trader,
                    tradeTypes,
                });
            }),
        )
        .catch((err) => {
            console.log(`Error making API request: ${err}`);
        });
};

exports.postDetails = (req, res) => {
    const payload = req.body;
    const { traderId, isloggedin } = req.session;
    const token = req.cookies.access_token;

    if (!isloggedin || !token) {
        res.redirect("/trader-login");
    }

    axios
        .put(`traders/${traderId}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            res.redirect("/trader-profile");
        })
        .catch((err) => {
            const traderRequest = axios.get(`/traders/${traderId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const tradeTypesRequest = axios.get("/trade-types", {
                headers: { Authorization: `Bearer ${token}` },
            });

            axios
                .all([traderRequest, tradeTypesRequest])
                .then(
                    axios.spread((traderApiRes, tradeTypeApiRes) => {
                        const trader = traderApiRes.data.result;

                        if (!trader) {
                            res.redirect("/trader-login");
                        }

                        const tradeTypes = tradeTypeApiRes.data.result;
                        res.render("trader/profile/edit-profile", {
                            errorResults: err.response.data.validationResults,
                            isloggedin,
                            trader,
                            tradeTypes,
                        });
                    }),
                )
                .catch((err) => {
                    console.log(`Error making API request: ${err}`);
                });
        });
};
