//if user id is not found in session data, redirect to login page
const withAuth = (req, res, next) => {
    if (!req.session.user_id) {
        res.redirect("/login");
    } else {
        next();
    }
};

module.exports = withAuth;