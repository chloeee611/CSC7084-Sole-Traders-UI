const express = require("express");
const morgan = require("morgan");
const path = require("path");
const router = require("./routes/traderroutes");
const PORT = 3000;

var app = express();

app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
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
