const conn = require("../utils/dbconn");

exports.getAllServicesPage = (req, res) => {
    const { isloggedin, traderId } = req.session;
    const selectSQL = `SELECT service_id, title, description, pricing_type, base_price FROM services WHERE trader_id = ?`;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    conn.query(selectSQL, [traderId], (err, rows) => {
        if (err) {
            throw err;
        }

        res.render("trader/services/view-services", {
            services: rows,
            trader: { trader_id: traderId },
        });
    });
};

exports.getNewServicePage = (req, res) => {
    res.render("trader/services/new-service", {});
};

exports.getEditServicePage = (req, res) => {
    const { service_id } = req.params;
    const { isloggedin, traderId } = req.session;

    const selectSQL = `SELECT service_id, title, description, pricing_type, base_price FROM services WHERE trader_id = ? AND service_id = ?`;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    conn.query(selectSQL, [traderId, service_id], (err, rows) => {
        if (err) {
            throw err;
        }

        res.render("trader/services/edit-service", {
            service: rows[0],
            trader: { trader_id: traderId },
        });
    });
};

exports.postNewService = (req, res) => {
    const { title, description, pricingType, basePrice } = req.body;
    const { traderId, isloggedin } = req.session;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    const insertSQL = `INSERT INTO services (title, description, pricing_type, base_price, trader_id)
            VALUES (?, ?, ?, ?, ?)`;

    conn.query(
        insertSQL,
        [title, description, pricingType, basePrice, traderId],
        (err, rows) => {
            if (err) {
                throw err;
            } else {
                res.redirect(`/trader-services`);
            }
        },
    );
};

exports.postEditService = (req, res) => {
    const { title, description, pricingType, basePrice } = req.body;
    const { service_id } = req.params;
    const { traderId, isloggedin } = req.session;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    const updateSQL = `
    UPDATE services SET title = ?, description = ?, pricing_type = ?, base_price = ? WHERE trader_id = ? AND service_id = ?`;

    conn.query(
        updateSQL,
        [title, description, pricingType, basePrice, traderId, service_id],
        (err, rows) => {
            if (err) {
                throw err;
            } else {
                res.redirect(`/trader-services`);
            }
        },
    );
};

exports.postDeleteService = (req, res) => {
    const { service_id } = req.params;
    const { traderId, isloggedin } = req.session;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    const deleteSQL = `
    DELETE FROM services WHERE trader_id = ? AND service_id = ?`;

    conn.query(deleteSQL, [traderId, service_id], (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.redirect(`/trader-services`);
        }
    });
};
