import express, { urlencoded } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userRouter from './Routes/user.routes.js';
import jobRouter from './Routes/jobs.routes.js';
import applicationRouter from './Routes/application.routes.js';
import { errorMiddleware } from './Middlewares/APIError.middleware.js'

const app = express()

config({
    path: './config/config.env'
})

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

app.use('/api/v1/users', userRouter)
app.use('/api/v1/jobs', jobRouter)
app.use('/api/v1/applications', applicationRouter)

app.use(errorMiddleware)

export default app