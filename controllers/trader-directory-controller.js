const axios = require("axios");

exports.getTraderDirectoryPage = async (req, res) => {
    axios
        .get("/traders")
        .then((apiRes) => {
            const traders = apiRes.data.result;
            res.render("client/directory", {
                traders,
                bookingMade: req.query.bookingMade,
            });
        })
        .catch((err) => {
            console.log(`Error making API request: ${err}`);
        });
};

exports.getTraderDetailsPage = (req, res) => {
    const { traderId } = req.params;

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
