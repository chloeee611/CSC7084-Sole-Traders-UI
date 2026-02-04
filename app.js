const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const Axios = require("axios");
require("dotenv").config({ path: "./config.env" });
const path = require("path");

const baseRouter = require("./routes/base-routes");
const traderDirectoryRouter = require("./routes/trader-directory-routes");
const traderProfileRouter = require("./routes/trader-profile-routes");
const loginRouter = require("./routes/login-routes");
const registerRouter = require("./routes/register-routes");
const serviceRouter = require("./routes/trader-service-routes");
const bookingRouter = require("./routes/booking-routes");

const PORT = process.env.PORT;
Axios.defaults.baseURL = process.env.API_BASE_URL;

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
app.use("/trader-register", registerRouter);
app.use("/trader-services", serviceRouter);
app.use("/trader-bookings", bookingRouter);

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
