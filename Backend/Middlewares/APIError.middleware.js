

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if (err.name === "CaseError") {
        const message = `Resource not found. Invalid ${err.path}`
        err = new APIError(message, 400)
    }
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered.`
        err = new APIError(message, 400)
    }
    if (err.name === "JsonWebTokenError") {
        const message = `JWT is invalid please try again.`
        err = new APIError(message, 400)
    }
    if (err.name === "TokenExpiredError") {
        const message = `JWT is expired. Please login again`
        err = new APIError(message, 400)
    }

    return res.status(400).json({
        success: false,
        message: err.message
    })
}

class APIError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}


export default APIError