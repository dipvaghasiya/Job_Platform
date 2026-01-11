import express from 'express'
import { createJob, deleteJob, getAllJobs, getMyJobs, getSingleJob, updateJob } from '../Controllers/job.controller.js'
import { verifyJWT } from '../Middlewares/Auth.middleware.js'

const jobRouter = express.Router()

jobRouter.use(verifyJWT)

jobRouter.get('/getall', getAllJobs)
jobRouter.get('/getmyjobs', getMyJobs)
jobRouter.post('/create', createJob)
jobRouter.put('/update/:id', updateJob)
jobRouter.get('/getjob/:id', getSingleJob)
jobRouter.delete('/delete/:id', deleteJob)


export default jobRouter