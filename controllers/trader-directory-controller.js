const conn = require("../utils/dbconn");

exports.getTraderDirectory = (req, res) => {
    const selectSQL = "SELECT trader_id, name, trade_type, region FROM traders";
    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.render("trader-directory", { traders: rows });
        }
    });
};

exports.getTraderDetails = (req, res) => {
    const { id } = req.params;

    const selectSQL = `SELECT * FROM traders WHERE trader_id = ${id}`;
    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.render("trader-details", { trader: rows[0] });
        }
    });
};
