const conn = require("../utils/dbconn");

exports.loginPage = (req, res) => {
    res.render("trader-login");
};

exports.postLogin = (req, res) => {
    const { username, password } = req.body;
    const vals = [username, password];
    const checkuserSQL = `SELECT * FROM traders WHERE username = ? AND password = ?`;
    conn.query(checkuserSQL, vals, (err, rows) => {
        if (err) throw err;
        const numrows = rows.length;
        if (numrows > 0) {
            const session = req.session;
            session.isloggedin = true;
            res.redirect("/trader-profile");
        } else {
            res.redirect("/login");
        }
    });
};
