const axios = require("axios");

exports.getTraderDirectoryPage = async (req, res) => {
    const { isloggedin } = req.session;

    axios
        .get("/traders")
        .then((apiRes) => {
            const traders = apiRes.data.result;
            res.render("client/directory", {
                traders,
                isloggedin,
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
