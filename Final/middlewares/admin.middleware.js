const ApiError = require('../ApiError');
const asyncHandler = require('../asyncHandler.js');
const jwt = require("jsonwebtoken");
const Admin = require('../models/Admin.js');

const adminverifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
        const decodedToken = jwt.verify(token, process.env.access_token_secret);
        const user = await Admin.findById(decodedToken?._id).select("-password, -refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});

module.exports = adminverifyJWT;
