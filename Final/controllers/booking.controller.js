const asyncHandler = require('../asyncHandler.js');
const ApiError = require('../ApiError.js');
const Booking = require('../models/Booking.js');
const Flight = require('../models/Flight.js');
const ApiResponse = require('../ApiResponse.js');

// Book a class
const bookClass = asyncHandler(async (req, res) => {
    const { name, age, phone, gender, bookingClass, f_name } = req.body;
    const user_id = req.user._id;

    // Validate inputs
    if (!name || !age || !phone || !gender || !bookingClass || !f_name) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Find the flight by f_name
    const flight = await Flight.findOne({ f_name });
    if (!flight) {
        throw new ApiError(404, 'Flight name not found');
    }

    const f_id = flight.f_id;
    let seat_no;
    let fare;
    let b_id = await Booking.countDocuments({ user_id });
    b_id++;

    if (bookingClass !== 'BUSINESS' && bookingClass !== 'ECONOMY') {
        throw new ApiError(400, 'Correct class is not entered');
    }
    if (gender !== 'M' && gender !== 'F' && gender !== 'O') {
        throw new ApiError(400, 'Correct gender is not entered');
    }

    // Finding total number of bookings for a flight
    const totalBookings = await Booking.countDocuments({ f_id });
    if (totalBookings === flight.total_seats) {
        throw new ApiError(400, 'Flight is fully booked');
    }

    // Finding business class seats
    if (bookingClass === 'BUSINESS') {
        const maxSeatBooking = await Booking.findOne({ f_id, seat_no: { $lt: 51 } })
            .sort({ seat_no: -1 })
            .exec();
        const maxSeatNo = maxSeatBooking ? maxSeatBooking.seat_no : 0;
        if (maxSeatNo >= 50) {
            throw new ApiError(400, "Bookings are full for business class");
        } else {
            seat_no = maxSeatNo + 1;
        }
        fare = flight.businessFare;
    } else { // ECONOMY class
        const maxSeatBooking = await Booking.findOne({ f_id, seat_no: { $gt: 50 } })
            .sort({ seat_no: -1 })
            .exec();
        const maxSeatNo = maxSeatBooking ? maxSeatBooking.seat_no : 50;
        seat_no = maxSeatNo + 1;
        fare = flight.economyFare;
    }

    const date = flight.date;
    const at = flight.at;
    const duration = flight.duration;
    const source = flight.source;
    const destination = flight.destination;
    // Create booking
    const booking = new Booking({
        b_id,
        user_id,
        name,
        age,
        phone,
        gender,
        seat_no,
        bookingClass,
        f_id,
        f_name,
        fare,
        date,
        at,
        duration,
        source,
        destination,
    });

    await booking.save();
    //res.status(201).json(new ApiResponse(201, booking, 'Booking created successfully'));
    res.redirect('/users/bookings')
});

// View all bookings for the logged-in user
const viewBookings = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = 6; // Number of flights per page

    const user_id = req.user._id;
    const bookings = await Booking.find({ user_id }).populate('f_id', 'name date')
    .skip((page - 1) * limit)
        .limit(limit);
    const totalbookings = await Booking.countDocuments({userId:req.user._id});
    const totalPages = Math.ceil(totalbookings / limit);
    //res.status(200).json(new ApiResponse(200, bookings, 'Bookings fetched successfully'));
    res.render('bookings', {bookings,
        currentPage: page,
        totalPages
    });
});

// Delete a booking by b_id
const deleteBooking = asyncHandler(async (req, res) => {
    const { b_id } = req.params;
    const user_id = req.user._id;

    const booking = await Booking.findOneAndDelete({ b_id, user_id });
    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }

    res.redirect('/users/bookings'); // Redirect to bookings page after deletion
});

module.exports = {
    bookClass,
    viewBookings,
    deleteBooking
};
