import express from 'express'
import { getUser, login, logout, register } from '../Controllers/user.controller.js'
import { verifyJWT } from '../Middlewares/Auth.middleware.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)

userRouter.use(verifyJWT)
userRouter.get('/getuser', getUser)
userRouter.post('/logout', logout)

export default userRouter