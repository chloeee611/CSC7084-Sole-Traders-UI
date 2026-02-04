const axios = require("axios");

//#region Client

exports.postNewBooking = (req, res) => {
    const payload = ({
        clientName,
        clientEmailAddress,
        serviceId,
        requestedDate,
        requestedStartTime,
        jobDescription,
    } = req.body);

    console.log(req.body);

    axios
        .post(`bookings`, { ...payload, status: "pending" })
        .then((apiRes) => {
            if (apiRes.status === 201) {
                res.redirect("/trader-directory?bookingMade=true");
            }
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        });
};

//#endregion

//#region Trader
exports.getAllBookingsPage = (req, res) => {
    const { isloggedin, traderId } = req.session;

    if (!isloggedin) {
        res.redirect("/trader-login");
    }

    axios
        .get(`/bookings`)
        .then((apiRes) => {
            const bookings = apiRes.data.result;
            res.render("trader/bookings/view-bookings", {
                bookings,
                trader: { trader_id: traderId },
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
