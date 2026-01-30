const axios = require("axios");

exports.getTraderDirectoryPage = async (req, res) => {
    axios
        .get("/traders")
        .then((apiRes) => {
            const traders = apiRes.data.result;
            res.render("client/directory", { traders });
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
            res.render("client/trader-details", { trader });
        })
        .catch((err) => {
            console.log(`Error making API request: ${err}`);
        });
};
