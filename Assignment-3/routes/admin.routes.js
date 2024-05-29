const express = require('express');
const {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentAdmin
} = require('../controllers/admin.controller.js');
const {
    createFlight,
    updateFlight,
    deleteFlight,
    getAllFlights,
    getAdminAllFlights,
    getFlightById
} = require('../controllers/flight.controller.js');
const adminverifyJWT = require('../middlewares/admin.middleware.js');
const adminRouter = express.Router();

adminRouter.route("/register").post(registerAdmin);
adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/login").get((req, res) => {
    res.render('adminLogin');
});
adminRouter.route("/register").get((req, res) => {
    res.render('adminRegister');
});
adminRouter.route("/flights").get(adminverifyJWT, getAdminAllFlights);
adminRouter.route("/addFlight").get((req, res) => {
    res.render('addFlight');
});
adminRouter.route("/updateFlight/:f_id").get(adminverifyJWT, getFlightById); // New route for update page
adminRouter.route("/updateFlight/:f_id").post(adminverifyJWT, updateFlight); // New route for update submission
adminRouter.delete('/flights/:f_id', adminverifyJWT, deleteFlight);
adminRouter.route("/logout").post(adminverifyJWT, logoutAdmin);
adminRouter.route("/refresh-token").post(refreshAccessToken);
adminRouter.route("/change-password").post(adminverifyJWT, changeCurrentPassword);
adminRouter.route("/current-admin").get(adminverifyJWT, getCurrentAdmin);

// Flight management routes
adminRouter.route("/flights").post(adminverifyJWT, createFlight);

module.exports = adminRouter;
