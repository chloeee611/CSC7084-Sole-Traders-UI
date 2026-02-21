const axios = require("axios");

//#region Client

exports.postNewBooking = (req, res) => {
    const payload = req.body;
    const { traderId } = req.params;
    const { isloggedin } = req.session;

    axios
        .post(`bookings`, { ...payload, status: "pending" })
        .then((apiRes) => {
            if (apiRes.status === 201) {
                res.redirect(`/trader-directory/${traderId}?bookingMade=true`);
            }
        })
        .catch((err) => {
            axios
                .get(`/traders/${traderId}`)
                .then((apiRes) => {
                    const trader = apiRes.data.result;

                    axios
                        .get(`/traders/${traderId}/services`)
                        .then((servicesApiRes) => {
                            const services = servicesApiRes.data.result;

                            return res.render("client/trader-details", {
                                isloggedin,
                                trader: {
                                    ...trader,
                                    services,
                                },
                                errorResults:
                                    err.response.data.validationResults,
                            });
                        });
                })
                .catch((err) => {
                    console.log(`Error making API request: ${err}`);
                });
        });
};

//#endregion

//#region Trader
exports.getAllBookingsPage = (req, res) => {
    const { isloggedin, traderId } = req.session;
    const { order_by, order_direction, status } = req.query;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    const bookingStatuses = [
        { value: "pending", label: "Pending" },
        { value: "rejected", label: "Rejected" },
        { value: "confirmed", label: "Confirmed" },
    ];

    const tableHeaders = [
        { value: "client_name", label: "Client Name" },
        { value: "client_email_address", label: "Client Email Address" },
        { value: "requested_date_time", label: "Date and Time" },
        { value: "job_description", label: "Job Description" },
        { value: "status", label: "Status" },
    ];

    axios
        .get(`/bookings`, {
            params: { status, order_by, order_direction },
        })
        .then((apiRes) => {
            const bookings = apiRes.data.result;
            res.render("trader/bookings/view-bookings", {
                isloggedin,
                bookings,
                trader: { trader_id: traderId },
                tableHeaders,
                bookingStatuses,
                filterParams: {
                    order_by,
                    order_direction,
                    status,
                },
            });
        })
        .catch((err) => {
            console.log(`Error making API request: ${err}`);
        });
};

exports.patchBookingStatus = (req, res) => {
    const { bookingId } = req.params;
    const { traderId, isloggedin } = req.session;
    const { status } = req.body;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    const allowed = ["confirmed", "rejected"];
    if (!allowed.includes(status)) {
        return res.redirect("/trader-bookings?error=badStatus");
    }

    axios
        .patch(`/bookings/${bookingId}/status`, { status, traderId })
        .then((apiRes) => {
            console.log(apiRes.data);
            res.redirect("/trader-bookings");
        })
        .catch((error) => {
            console.log(`Error updating bookingt: ${error}`);
        });
};

//#endregion
