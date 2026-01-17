const express = require("express");
const conn = require("../utils/dbconn");
const router = express.Router({ mergeParams: true });

router.get("/", (req, res) => {
    const selectSQL = "SELECT trader_id, name, trade_type, region FROM traders";
    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.render("trader-directory", { traders: rows });
        }
    });
});

router.get("/trader/:id", (req, res) => {
    const { id } = req.params;

    const selectSQL = `SELECT * FROM traders WHERE trader_id = ${id}`;
    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.render("trader-profile", { trader: rows[0] });
        }
    });
});

router.get("/trader-login", (req, res) => {
    res.render("trader-login");
});

router.post("/trader-login", (req, res) => {
    const { username, password } = req.body;
    const vals = [username, password];
    console.log(vals);
    const checkuserSQL = `SELECT * FROM traders WHERE username = ? AND password = ?`;
    conn.query(checkuserSQL, vals, (err, rows) => {
        if (err) throw err;
        const numrows = rows.length;
        console.log(numrows);
        if (numrows > 0) {
            console.log(rows);
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});

module.exports = router;
