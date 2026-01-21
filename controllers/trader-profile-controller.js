const conn = require("../utils/dbconn");

exports.getTraderProfile = (req, res) => {
    const { isloggedin, traderId } = req.session;
    const selectTraderSQL = "SELECT * FROM traders WHERE trader_id = ?";

    conn.query(selectTraderSQL, [traderId], (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.render("trader-profile", {
                isloggedin: isloggedin,
                trader: rows[0],
            });
        }
    });
};

exports.getEditDetails = (req, res) => {
    const { isloggedin, traderId } = req.session;
    const selectTraderSQL = "SELECT * FROM traders WHERE trader_id = ?";
    const selectTraderTypeSQL = "SELECT trade_type_id FROM trade_types";

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

            res.render("edit-profile", {
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
