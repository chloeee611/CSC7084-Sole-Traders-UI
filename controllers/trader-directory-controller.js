const conn = require("../utils/dbconn");

exports.getTraderDirectoryPage = (req, res) => {
    const selectSQL = `
        SELECT * 
        FROM traders 
        INNER JOIN trade_types
        ON traders.trade_type_id = trade_types.trade_type_id
        `;
    // TODO: add has_profile to trader
    // WHERE traders.has_profile = true

    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.render("client/directory", { traders: rows });
        }
    });
};

exports.getTraderDetailsPage = (req, res) => {
    const { id } = req.params;

    const selectSQL = `        
        SELECT * 
        FROM traders 
        INNER JOIN trade_types
        ON traders.trade_type_id = trade_types.trade_type_id 
        WHERE trader_id = ${id}
        `;

    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.render("client/trader-details", { trader: rows[0] });
        }
    });
};
