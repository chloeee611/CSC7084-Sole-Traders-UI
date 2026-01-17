const mysql = require("mysql2");

// TODO: Replace with env variables
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "soletraders",
    port: "3306",
});

db.connect((err) => {
    if (err) {
        throw err;
    }

    console.log(`Database connection successful!`);
});

module.exports = db;
