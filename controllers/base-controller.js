exports.getHomePage = (req, res) => {
    const { isloggedin } = req.session;

    res.render("client/home", { isloggedin });
};
