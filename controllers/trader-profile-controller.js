const conn = require("../utils/dbconn");

exports.getTraderProfilePage = (req, res) => {
    const { isloggedin, traderId } = req.session;
    const selectTraderSQL = `
        SELECT * 
        FROM traders 
        INNER JOIN trade_types
        ON traders.trade_type_id = trade_types.trade_type_id
        WHERE traders.trader_id = ?
    `;

    conn.query(selectTraderSQL, [traderId], (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.log(rows[0]);
            res.render("trader/profile/view-profile", {
                isloggedin: isloggedin,
                trader: rows[0],
            });
        }
    });
};

exports.getEditDetailsPage = (req, res) => {
    const { isloggedin, traderId } = req.session;
    const selectTraderSQL = "SELECT * FROM traders WHERE trader_id = ?";
    const selectTraderTypeSQL = "SELECT * FROM trade_types";

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    conn.query(selectTraderSQL, [traderId], (err, trader_rows) => {
        if (err) {
            throw err;
        }

        if (trader_rows.length === 0) {
            res.redirect("/trader-login");
        }

        conn.query(selectTraderTypeSQL, (err, trade_type_rows) => {
            if (err) {
                throw err;
            }

            console.log(trade_type_rows);

            res.render("trader/profile/edit-profile", {
                isloggedin: isloggedin,
                trader: trader_rows[0],
                tradeTypes: trade_type_rows,
            });
        });
    });
};

exports.postDetails = (req, res) => {
    const { trade_type, region, availability, bio } = req.body;
    const { traderId, isloggedin } = req.session;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    const updateSQL =
        "UPDATE traders SET trade_type_id = ?, region = ?, availability = ?, bio = ? WHERE trader_id = ?";

    conn.query(
        updateSQL,
        [trade_type, region, availability, bio, traderId],
        (err, rows) => {
            if (err) {
                throw err;
            }

            res.redirect("/trader-profile");
        },
    );
};
