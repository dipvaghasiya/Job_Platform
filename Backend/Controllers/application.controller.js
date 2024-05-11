import APIError from "../Middlewares/APIError.middleware.js";
import { asyncHandler } from "../Middlewares/CatchAsyncError.middleware.js";
import { APIResponse } from "../Middlewares/APIResponse.js";
import { Application } from "../Models/application.model.js";
import cloudinary from "cloudinary";
import { Job } from "../Models/job.model.js";

export const createApplication = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "Employer") {
    throw new APIError(400, "Invalid user");
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new APIError(400, "Resume File Required!"));
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new APIError(400, "Invalid file type. Please upload a PNG file.")
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new APIError(500, "Failed to upload Resume to Cloudinary"));
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;

  const applicantID = {
    user: req.user._id,
    role: "Job Seeker",
  };

  if (!jobId) {
    return next(new APIError(404, "Job not found!"));
  }
  console.log(jobId);
  const jobDetails = await Job.findById(jobId);

  if (!jobDetails) {
    console.log(jobDetails);
    return next(new APIError(404, "Job not found!"));
  }

  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };

  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantID ||
    !employerID ||
    !resume
  ) {
    return next(new APIError(400, "Please fill all fields."));
  }

  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res
    .status(200)
    .json(
      new APIResponse(200, application, "Application Created Successfully")
    );
});

export const employerGetAllApplications = asyncHandler(
  async (req, res, next) => {
    const { role } = req.user;
    if (role !== "Employer") {
      throw new APIError(400, "Invalid user");
    }

    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });

    res
      .status(200)
      .json(
        new APIResponse(
          200,
          applications,
          "Fetched All Applications Successfully."
        )
      );
  }
);

export const jobseekerGetAllApplications = asyncHandler(
  async (req, res, next) => {
    const { role } = req.user;
    if (role !== "Job Seeker") {
      throw new APIError(400, "Invalid user");
    }

    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });

    res
      .status(200)
      .json(
        new APIResponse(
          200,
          applications,
          "Fetched All Applications Successfully."
        )
      );
  }
);

export const jobseekerDeleteApplication = asyncHandler(
  async (req, res, next) => {
    const { role } = req.user;
    if (role !== "Job Seeker") {
      throw new APIError(400, "Invalid user");
    }

    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      throw new APIError(404, "Application not found!!");
    }

    await application.deleteOne();

    res
      .status(200)
      .json(
        new APIResponse(200, application, "Application Deleted Successfully.")
      );
  }
);
