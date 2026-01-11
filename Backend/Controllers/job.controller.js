import { APIResponse } from '../Middlewares/APIResponse.js'
import { asyncHandler } from '../Middlewares/CatchAsyncError.middleware.js'
import { Job } from '../Models/job.model.js'
import APIError from '../Middlewares/APIError.middleware.js'

export const getAllJobs = asyncHandler(async (req, res, next) => {
    const jobs = await Job.find({ expired: false })
    res.status(200).json(new APIResponse(200, jobs, "Fetched All Jobs Successfully."))
})

export const createJob = asyncHandler(async (req, res, next) => {
    const { role } = req.user

    if (role !== "Employer") {
        throw new APIError(400, "Invalid user");
    }

    const {
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
    } = req.body;

    if (!title || !description || !category || !country || !city || !location) {
        return next(new APIError(400, "Please provide full job details."));
    }

    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(
            new APIError(
                400,
                "Please either provide fixed salary or ranged salary."
            )
        );
    }

    if (salaryFrom && salaryTo && fixedSalary) {
        return next(
            new APIError(400, "Cannot Enter Fixed and Ranged Salary together.")
        );
    }

    const postedBy = req.user._id;
    const job = await Job.create({
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        postedBy,
    });

    res.status(200).json(new APIResponse(200, job, "Job Posted Successfully!"));

});

export const getMyJobs = asyncHandler(async (req, res, next) => {
    const { role } = req.user
    if (role !== "Employer") {
        throw new APIError(400, "Invalid user");
    }
    const jobs = await Job.find({ postedBy: req.user })
    res.status(200).json(new APIResponse(200, jobs, "Fetched All Jobs Successfully."))
})

export const updateJob = asyncHandler(async (req, res, next) => {
    const { role } = req.user
    if (role !== "Employer") {
        throw new APIError(400, "Invalid user");
    }

    const { id } = req.params

    let job = await Job.findById(id)
    if (!job) {
        throw new APIError(404, "Job not found");
    }

    job = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json(
        new APIResponse(200, job, "Job Updated Successfully")
    )
})

export const deleteJob = asyncHandler(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new APIError(400, "Job Seeker not allowed to access this resource.")
        );
    }
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
        return next(new APIError(404, "OOPS! Job not found."));
    }
    await job.deleteOne();
    res.status(200).json(
        new APIResponse(200, job, "Job Deleted Successfully"))
});

export const getSingleJob = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const job = await Job.findById(id);
        if (!job) {
            return next(new APIError(404, "Job not found."));
        }
        res.status(200).json(new APIResponse(200, job, "Job fetched Successfully"));

    } catch (error) {
        return next(new APIError(404, `Invalid ID / CastError`));
    }
});