//imports
const router = require("express").Router();
const apiRoutes = require("./api");
const homeRoutes = require("./home_routes");
const dashboardRoutes = require("./dashboard_routes");
//turning on routing for home page, dashboard page, and api endpoints
router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use("/dashboard", dashboardRoutes);

router.use((req, res) => {//404 redirect
    res.status(404).end();
});

module.exports = router;