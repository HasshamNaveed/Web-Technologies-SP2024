const asyncHandler = require('../asyncHandler.js');
const ApiError = require('../ApiError.js');
const Flight = require('../models/Flight.js');
const ApiResponse = require('../ApiResponse.js');

// Existing functions...

const getFlightById = asyncHandler(async (req, res) => {
    const { f_id } = req.params;

    const flight = await Flight.findOne({ f_id });

    if (!flight) {
        throw new ApiError(404, 'Flight not found');
    }

    res.render('updateFlight', { flight });
});

// Create a flight or multiple flights
const createFlight = async (req, res) => {
    const flights = Array.isArray(req.body) ? req.body : [req.body];

    // Validate the input
    for (const flightData of flights) {
        const { f_name, date, at, duration, source, destination, total_seats, businessFare, economyFare } = flightData;

        if (!f_name || !date || !at || !duration || !source || !destination || !total_seats || businessFare === undefined || economyFare === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (businessFare < economyFare) {
            return res.status(400).json({ error: "Business fare should be greater than economy fare" });
        }
    }

    try {
        // Get the current count of flights to determine the starting f_id
        const flightCount = await Flight.countDocuments();

        // Assign f_id to each flight
        flights.forEach((flightData, index) => {
            flightData.f_id = flightCount + index + 1;
        });

        const createdFlights = await Flight.insertMany(flights);
        res.redirect('/admins/flights');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a flight
const updateFlight = asyncHandler(async (req, res) => {
    const { f_id } = req.params;
    const updates = req.body;

    if (!f_id) {
        return res.status(400).json({ error: 'f_id is required' });
    }

    const flight = await Flight.findOneAndUpdate({ f_id }, updates, { new: true });

    if (!flight) {
        throw new ApiError(404, 'Flight not found');
    }

    res.redirect('/admins/flights');
});

// Delete a flight
const deleteFlight = asyncHandler(async (req, res) => {
    const { f_id } = req.params;

    const flight = await Flight.findOneAndDelete({ f_id });

    if (!flight) {
        throw new ApiError(404, 'Flight not found');
    }

    res.redirect('/admins/flights');
});

const getAllFlights = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;

    const flights = await Flight.find()
    .skip((page - 1) * limit)
        .limit(limit);

    const totalFlights = await Flight.countDocuments();
    const totalPages = Math.ceil(totalFlights / limit);

    res.render('flights', {
        flights,
        currentPage: page,
        totalPages
    });
});


const getAdminAllFlights = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = 6; // Number of flights per page

    const flights = await Flight.find()
        .skip((page - 1) * limit)
        .limit(limit);

    const totalFlights = await Flight.countDocuments();
    const totalPages = Math.ceil(totalFlights / limit);

    res.render('adminFlights', {
        flights,
        currentPage: page,
        totalPages
    });
});


module.exports = {
    createFlight,
    updateFlight,
    deleteFlight,
    getAllFlights,
    getAdminAllFlights,
    getFlightById // Export the new function
};
