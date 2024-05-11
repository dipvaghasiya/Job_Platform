import express from "express";
import { verifyJWT } from "../Middlewares/Auth.middleware.js";
import {
  createApplication,
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
} from "../Controllers/application.controller.js";

const applicationRouter = express.Router();

applicationRouter.use(verifyJWT);

applicationRouter.get("/employerapplications", employerGetAllApplications);
applicationRouter.get("/jobseekerapplications", jobseekerGetAllApplications);
applicationRouter.post("/createapplication", createApplication);
applicationRouter.delete("/deleteapplication/:id", jobseekerDeleteApplication);

export default applicationRouter;
