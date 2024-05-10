import { asyncHandler } from '../Middlewares/CatchAsyncError.middleware.js'
import APIError from '../Middlewares/APIError.middleware.js'
import { APIResponse } from '../Middlewares/APIResponse.js'
import { User } from '../Models/user.model.js'
import { sendToken } from '../Utils/jwtToken.js'

export const register = asyncHandler(async (req, res, next) => {
    const { name, email, phone, role, password } = req.body;
    if (!name || !email || !phone || !role || !password) {
        throw new APIError(400, "All fields are required")
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw new APIError(409, "User already existed with this email or username")
    }

    const user = await User.create({
        name,
        email,
        phone,
        role,
        password,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) throw new APIError(500, "Something went wrong while registering the user")

    sendToken(createdUser, 201, res, "User registered successfully")
})

export const login = asyncHandler(async (req, res, next) => {
    const { email, password, role } = req.body

    if (!email || !password || !role) {
        throw new APIError(400, "All fields are required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new APIError(404, "User not found")
    }

    const isPasswordMatched = user.comparePassword(password)

    if (!isPasswordMatched) {
        throw new APIError(404, "Invalid email or password")
    }

    if (role !== user.role) {
        throw new APIError(400, "Role is invalid")
    }

    sendToken(user, 200, res, "User logged in successfully")
})

export const logout = asyncHandler(async (req, res, next) => {
    res.status(201).cookie("token", "", {
        httpOnly: true,
        expiresIn: new Date(Date.now())
    })
        .json({
            success: true,
            message: "User logged out successfully"
        })
})

export const getUser = asyncHandler((req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});