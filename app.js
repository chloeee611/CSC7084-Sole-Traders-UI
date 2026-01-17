const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
require("dotenv").config({ path: "./config.env" });
const path = require("path");

const baseRouter = require("./routes/base-routes");
const traderDirectoryRouter = require("./routes/trader-directory-routes");
const traderProfileRouter = require("./routes/trader-profile-routes");
const loginRouter = require("./routes/login-routes");

const PORT = process.env.PORT;

var app = express();

app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
    }),
);

app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));

app.use("/", baseRouter);
app.use("/trader-directory", traderDirectoryRouter);
app.use("/trader-profile", traderProfileRouter);
app.use("/trader-login", loginRouter);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "html"));
app.use(express.static(path.join(__dirname, "/public")));

app.use((req, res) => {
    res.status(404);
    res.send("<h1>Page not found!</h1>");
});

app.listen(PORT, (err) => {
    if (err) return console.log(err);
    console.log(`Express Web Server listening on http://localhost:${PORT}`);
});
