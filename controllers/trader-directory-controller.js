const axios = require("axios");

exports.getTraderDirectoryPage = (req, res) => {
    const { isloggedin } = req.session;
    const { region, trade_type, order_by, order_direction } = req.query;

    console.log(req.query);

    const tableHeaders = [
        { value: "name", label: "Trader Name" },
        { value: "trade_type_name", label: "Trader Type" },
        { value: "region", label: "Region" },
        { value: "average_rating", label: "Average Rating" },
    ];

    axios
        .get("/traders", {
            params: { region, trade_type, order_by, order_direction },
        })
        .then((apiRes) => {
            const traders = apiRes.data.result;

            axios
                .get("/trade-types")
                .then((tradeTypeApiRes) => {
                    const tradeTypes = tradeTypeApiRes.data.result;

                    res.render("client/directory", {
                        traders,
                        isloggedin,
                        tableHeaders,
                        tradeTypes,
                        filterParams: {
                            region,
                            trade_type,
                            order_direction,
                            order_by,
                        },
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

exports.getTraderDetailsPage = (req, res) => {
    const { traderId } = req.params;
    const { isloggedin, currentRatings } = req.session;

    axios
        .get(`/traders/${traderId}`)
        .then((apiRes) => {
            const trader = apiRes.data.result;

            axios
                .get(`/traders/${traderId}/services`)
                .then((servicesApiRes) => {
                    const services = servicesApiRes.data.result;

                    res.render("client/trader-details", {
                        currentRating: currentRatings?.[traderId],
                        trader: {
                            ...trader,
                            services,
                        },
                        bookingMade: req.query.bookingMade,
                        isloggedin,
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

//#region Client

exports.postRating = (req, res) => {
    const { rating } = req.body;
    const { traderId } = req.params;
    const { isloggedin } = req.session;

    axios
        .post(`traders/${traderId}/ratings`, { rating: Number(rating) })
        .then((apiRes) => {
            req.session.currentRatings = {
                ...req.session.currentRatings,
                [traderId]: Number(rating),
            };

            if (apiRes.status === 201) {
                res.redirect(`/trader-directory/${traderId}`);
            }
        })
        .catch((err) => {
            axios
                .get(`/traders/${traderId}`)
                .then((apiRes) => {
                    const trader = apiRes.data.result;

                    axios
                        .get(`/traders/${traderId}/services`)
                        .then((servicesApiRes) => {
                            const services = servicesApiRes.data.result;

                            return res.render("client/trader-details", {
                                isloggedin,
                                trader: {
                                    ...trader,
                                    services,
                                },
                                errorResults:
                                    err.response.data.validationResults,
                            });
                        });
                })
                .catch((err) => {
                    console.log(`Error making API request: ${err}`);
                });
        });
};

//#endregion
