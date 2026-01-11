export const sendToken = (user, statusCode, res, message) => {
    const token = user.generateJwtToken()

    const options = {
        expiresIn: new Date(
            Date.now() + process.env.JWT_EXPIRE * 24 * 3600000
        ),
        httpOnly: true,
    }

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        message,
        token
    })
}