const axios = require("axios");

exports.getTraderDirectoryPage = (req, res) => {
    const { isloggedin } = req.session;
    const { region, trade_type, order_by, order_direction } = req.query;

    console.log(req.query);

    const tableHeaders = [
        { value: "name", label: "Trader Name" },
        { value: "trade_type_name", label: "Trader Type" },
        { value: "region", label: "Region" },
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
    const { isloggedin } = req.session;

    axios
        .get(`/traders/${traderId}`)
        .then((apiRes) => {
            const trader = apiRes.data.result;

            axios
                .get(`/traders/${traderId}/services`)
                .then((servicesApiRes) => {
                    const services = servicesApiRes.data.result;

                    res.render("client/trader-details", {
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
