const express = require('express');
const { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser } = require('../controllers/user.controller.js');
const { getAllFlights, createFlight, updateFlight, deleteFlight } = require('../controllers/flight.controller.js');
const verifyJWT = require('../middlewares/auth.middleware.js');
const {
    bookClass,
    viewBookings,
    deleteBooking
} = require('../controllers/booking.controller.js');

const userRouter = express.Router();

// User authentication routes
userRouter.route("/login").post(loginUser);
userRouter.route("/login").get((req, res) => { 
    res.render('login');
}); 
userRouter.route("/register").get((req, res) => {
    res.render('register'); // Render register.ejs
});
userRouter.route("/register").post(registerUser);
// Flight routes (secured route)
userRouter.route("/flights").get(verifyJWT, getAllFlights);
userRouter.route("/book").get((req, res) => {
    res.render('book'); // Render register.ejs
});
// Other secured user routes
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);

// Booking routes
userRouter.route("/bookings").post(verifyJWT, bookClass);
userRouter.route("/bookings").get(verifyJWT, viewBookings); 
userRouter.route("/bookings/:b_id").delete(verifyJWT, deleteBooking);

module.exports = userRouter;
    