const asyncHandler = require('../asyncHandler.js');
const ApiError = require('../ApiError.js');
const Admin = require('../models/Admin.js');
const ApiResponse = require('../ApiResponse.js');

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await Admin.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Something went wrong while generating access and refresh tokens: " + error.message);
    }
};

const registerAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required",
        });
    }

    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "Username already exists",
        });
    }

    const user = await Admin.create({ username, password });
    const createdUser = await Admin.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user");
    }
    /*return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );*/
    res.redirect('/'); // Redirect to main page after successful registration
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username) {
        throw new ApiError(400, "Username is required");
    }
    const user = await Admin.findOne({ username });
    if (!user) {
        throw new ApiError(404, "User doesn't exist");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid user credentials");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await Admin.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    res.cookie("accessToken", accessToken, options)
    res.cookie("refreshToken", refreshToken, options)
    res.redirect('/admins/flights')
    /*.json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    );*/
});

const logoutAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    res.clearCookie("accessToken", options)
    res.clearCookie("refreshToken", options)//.json(new ApiResponse(200, {}, "User logged out"));
    res.redirect('/');
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.refresh_token_secret);

        const user = await Admin.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await Admin.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

module.exports = {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentAdmin
};
