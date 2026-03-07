const axios = require("axios");

exports.getTraderDirectoryPage = (req, res) => {
    const { isloggedin } = req.session;
    const { region, trade_type, order_by, order_direction } = req.query;

    const tableHeaders = [
        { value: "name", label: "Trader Name" },
        { value: "trade_type_name", label: "Trader Type" },
        { value: "region", label: "Region" },
        { value: "average_rating", label: "Average Rating" },
    ];

    const tradersRequest = axios.get("/traders", {
        params: { region, trade_type, order_by, order_direction },
    });
    const tradeTypesRequest = axios.get("/trade-types");

    axios
        .all([tradersRequest, tradeTypesRequest])
        .then(
            axios.spread((tradersApiRes, tradeTypeApiRes) => {
                const traders = tradersApiRes.data.result;

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
            }),
        )
        .catch((err) => {
            console.log(`Error making API request: ${err}`);
        });
};

exports.getTraderDetailsPage = (req, res) => {
    const { traderId } = req.params;
    const { isloggedin, currentRatings } = req.session;

    const traderRequest = axios.get(`/traders/${traderId}`);
    const servicesRequest = axios.get(`/traders/${traderId}/services`);
    const dateChartRequest = axios.get(
        `/bookings/data/date?trader_id=${traderId}`,
    );
    const serviceChartRequest = axios.get(
        `/bookings/data/service?trader_id=${traderId}`,
    );

    axios
        .all([
            traderRequest,
            servicesRequest,
            dateChartRequest,
            serviceChartRequest,
        ])
        .then(
            axios.spread(
                (
                    traderApiRes,
                    servicesApiRes,
                    dateChartApiRes,
                    serviceChartApiRes,
                ) => {
                    const trader = traderApiRes.data.result;
                    const services = servicesApiRes.data.result;
                    const bookingsByDate = dateChartApiRes.data.result;
                    const bookingsByService = serviceChartApiRes.data.result;

                    res.render("client/trader-details", {
                        currentRating: currentRatings?.[traderId],
                        trader: {
                            ...trader,
                            services,
                        },
                        bookingMade: req.query.bookingMade,
                        isloggedin,
                        bookingsByDate,
                        bookingsByService,
                    });
                },
            ),
        )
        .catch((err) => {
            console.log(`Error making API request: ${err}`);
        });
};

//#region Client

exports.postRating = (req, res) => {
    const { rating } = req.body;
    const { traderId } = req.params;
    const { isloggedin, currentRatings } = req.session;

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
            const traderRequest = axios.get(`/traders/${traderId}`);
            const servicesRequest = axios.get(`/traders/${traderId}/services`);

            axios
                .all([traderRequest, servicesRequest])
                .then(
                    axios.spread((traderApiRes, servicesApiRes) => {
                        const trader = traderApiRes.data.result;
                        const services = servicesApiRes.data.result;

                        return res.render("client/trader-details", {
                            currentRating: currentRatings?.[traderId],
                            isloggedin,
                            trader: {
                                ...trader,
                                services,
                            },
                            errorResults: err.response.data.validationResults,
                        });
                    }),
                )
                .catch((err) => {
                    console.log(`Error making API request: ${err}`);
                });
        });
};

//#endregion
