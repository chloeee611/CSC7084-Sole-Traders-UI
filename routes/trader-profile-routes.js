const express = require("express");
const conn = require("../utils/dbconn");
const router = express.Router({ mergeParams: true });

router.get("/", (req, res) => {
    const { isloggedin } = req.session;
    const selectSQL = "SELECT trader_id, name, trade_type, region FROM traders";
    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.render("trader-profile", { isloggedin: isloggedin });
        }
    });
});

module.exports = router;
