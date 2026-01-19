const conn = require("../utils/dbconn");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

exports.registerPage = (req, res) => {
    res.render("trader-register");
};

exports.postRegister = (req, res) => {
    const { name, username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render("trader-register", {
            error: "Passwords do not match",
        });
    }

    bcrypt.hash(password, SALT_WORK_FACTOR, (err, hashedPassword) => {
        const selectSQL = `INSERT INTO traders (name, username, email, password, trade_type, region, availability, bio)
            VALUES (?, ?, ?, ?, NULL, NULL, NULL, NULL)`;

        conn.query(
            selectSQL,
            [name, username, email.toLowerCase(), hashedPassword],
            (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    res.redirect("/trader-login?registered=1");
                }
            },
        );
    });
};
