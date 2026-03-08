const axios = require("axios");

//#region Client

exports.postNewBooking = (req, res) => {
    const payload = req.body;
    const { traderId } = req.params;
    const { isloggedin, currentRatings } = req.session;

    axios
        .post(`bookings`, { ...payload, status: "pending" })
        .then((apiRes) => {
            if (apiRes.status === 201) {
                res.redirect(`/trader-directory/${traderId}?bookingMade=true`);
            }
        })
        .catch((err) => {
            const traderRequest = axios.get(`/traders/${traderId}`);
            const servicesRequest = axios.get(`/traders/${traderId}/services`);
            const dateChartRequest = axios.get(`/bookings/data/date`);
            const serviceChartRequest = axios.get(`/bookings/data/service`);

            axios
                .all([
                    traderRequest,
                    servicesRequest,
                    dateChartRequest,
                    serviceChartRequest,
                ])
                .then(
                    axios.spread(
                        (
                            traderApiRes,
                            servicesApiRes,
                            dateChartApiRes,
                            serviceChartApiRes,
                        ) => {
                            const trader = traderApiRes.data.result;
                            const services = servicesApiRes.data.result;
                            const bookingsByDate = dateChartApiRes.data.result;
                            const bookingsByService =
                                serviceChartApiRes.data.result;

                            return res.render("client/trader-details", {
                                currentRating: currentRatings?.[traderId],
                                isloggedin,
                                trader: {
                                    ...trader,
                                    services,
                                },
                                errorResults:
                                    err.response.data.validationResults,
                                bookingsByDate,
                                bookingsByService,
                            });
                        },
                    ),
                )
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
    const token = req.cookies.access_token;

    if (!isloggedin || !token) {
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
            params: {
                status,
                order_by,
                order_direction,
            },
            headers: { Authorization: `Bearer ${token}` },
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
    const token = req.cookies.access_token;

    if (!isloggedin || !token) {
        res.redirect("/trader-login");
    }

    const allowed = ["confirmed", "rejected"];
    if (!allowed.includes(status)) {
        return res.redirect("/trader-bookings?error=badStatus");
    }

    axios
        .patch(
            `/bookings/${bookingId}/status`,
            { status, traderId },
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        )
        .then(() => {
            res.redirect("/trader-bookings");
        })
        .catch((error) => {
            console.log(`Error updating bookingt: ${error}`);
        });
};

//#endregion
