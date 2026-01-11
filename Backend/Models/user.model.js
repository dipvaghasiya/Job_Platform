import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        minLength: [3, "Name contains at least 3 characters"],
        maxLength: [30, "Name cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    phone: {
        type: Number,
        required: [true, "Please provide your phone number"],
    },
    password: {
        type: String,
        required: [true, "Please provide your password"],
        minLength: [8, "Password contains at least 8 characters"],
        maxLength: [32, "Password cannot exceed 32 characters"],
    },
    role: {
        type: String,
        required: [true, "Please provide your role"],
        enum: ["Job Seeker", "Employer"]
    },
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    return next()
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(this.password, password)
}

userSchema.methods.generateJwtToken = function () {
    return jwt.sign({
        id: this._id
    },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    )
}

export const User = mongoose.model("User", userSchema)