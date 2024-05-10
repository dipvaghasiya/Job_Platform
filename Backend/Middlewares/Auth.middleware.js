import { User } from "../Models/user.model.js";
import APIError from "../Middlewares/APIError.middleware.js";
import { asyncHandler } from "./CatchAsyncError.middleware.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new APIError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // console.log(decodedToken);

        const user = await User.findById(decodedToken?.id).select("-password")
        // console.log(user);

        if (!user) {
            throw new APIError(401, "Invalid access token")
        }

        req.user = user
        next()

    } catch (error) {
        throw new APIError(401, error?.message || "Invalid access token")
    }

})