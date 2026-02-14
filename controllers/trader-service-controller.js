const axios = require("axios");

exports.getAllServicesPage = (req, res) => {
    const { isloggedin, traderId } = req.session;

    if (!isloggedin) {
        return res.redirect("/trader-login");
    }

    axios
        .get(`/traders/${traderId}/services`)
        .then((apiRes) => {
            const services = apiRes.data.result;
            res.render("trader/services/view-services", {
                services,
                trader: { trader_id: traderId },
            });
        })
        .catch((err) => {
            console.log(`Error making API request: ${err}`);
        });
};

exports.getNewServicePage = (req, res) => {
    const { isloggedin } = req.session;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    res.render("trader/services/new-service");
};

exports.getEditServicePage = (req, res) => {
    const { serviceId } = req.params;
    const { isloggedin, traderId } = req.session;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    axios
        .get(`/traders/${traderId}/services/${serviceId}`)
        .then((apiRes) => {
            const service = apiRes.data.result;

            res.render("trader/services/edit-service", {
                service,
                trader: { trader_id: traderId },
            });
        })
        .catch((err) => {
            console.log(`Error making API request: ${err}`);
        });
};

exports.postNewService = (req, res) => {
    const payload = { ...req.body, basePrice: Number(req.body.basePrice) };
    const { traderId, isloggedin } = req.session;

    if (!isloggedin) {
        return res.redirect("/trader-login");
    }

    axios
        .post(`/traders/${traderId}/services`, payload)
        .then(() => {
            res.redirect("/trader-services");
        })
        .catch((err) => {
            res.render("trader/services/new-service", {
                errorResults: err.response.data.validationResults,
                isloggedin,
                trader: { trader_id: traderId },
            });
        });
};

exports.postEditService = (req, res) => {
    const payload = { ...req.body, basePrice: Number(req.body.basePrice) };
    const { serviceId } = req.params;
    const { traderId, isloggedin } = req.session;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    axios
        .put(`/traders/${traderId}/services/${serviceId}`, payload)
        .then((apiRes) => {
            console.log(apiRes.data);
            res.redirect("/trader-services");
        })
        .catch((err) => {
            axios
                .get(`/traders/${traderId}/services/${serviceId}`)
                .then((apiRes) => {
                    const service = apiRes.data.result;

                    res.render("trader/services/edit-service", {
                        errorResults: err.response.data.validationResults,
                        isloggedin,
                        service,
                        trader: { trader_id: traderId },
                    });
                })
                .catch((err) => {
                    console.log(`Error making API request: ${err}`);
                });
        });
};

exports.postDeleteService = (req, res) => {
    const { serviceId } = req.params;
    const { traderId, isloggedin } = req.session;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    axios
        .delete(`/traders/${traderId}/services/${serviceId}`)
        .then((apiRes) => {
            console.log(apiRes.data);
            res.redirect("/trader-services");
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        });
};
