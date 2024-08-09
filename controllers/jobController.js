import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";

export const getAllJobs = async (req, res) => {
  //if admin --> then see all users jobs

  const { search, jobStatus, jobType, jobLocation,createdBy, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };
  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }
  if (jobStatus && jobStatus !== "all") {
    queryObject.jobStatus = jobStatus;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (jobLocation) {
    queryObject.$or = [
      { jobLocation: { $regex: jobLocation, $options: "i" } },
    ];
  }

  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;
  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs });

  // const jobs = await Job.find(queryObject);
  // console.log(search);
  // res.status(StatusCodes.OK).json({ jobs });

  // else {
  //   if (req.user.role === "admin") {
  //     console.log("true");
  // const jobs = await Job.find({});
  //     // res.status(StatusCodes.OK).json({ jobs });

  // const user = await User.findOne({ _id: req.user.userId });
  //     const userWithoutPassword = user.noPass();
  //     res.status(StatusCodes.OK).json({ user: userWithoutPassword, jobs });
  //   } else {
  //     //otherwise just return for that specific user
  //     // console.log(req.user); //will return all jobs for all user, only ADMIN can see that
  //     const jobs = await Job.find({ createdBy: req.user.userId });

  // res.status(StatusCodes.OK).json({ jobs });
  //   }
  // }
};

export const createJob = async (req, res) => {
  // no need to use try and catch as
  // import 'express-async-errors' is used
  // in server.js will catch the error automatically
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

export const getJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  res.status(StatusCodes.OK).json({ job });
};

export const updateJob = async (req, res) => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({ msg: "job modified", updatedJob });
};

export const deleteJob = async (req, res) => {
  const removedJob = await Job.findByIdAndDelete(req.params.id);

  res.status(StatusCodes.OK).json({ msg: "job deleted", job: removedJob });
};

export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } }, //grab all jobs
    //that belong to user logged in
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } }, //group the jobs that belong to the user
    //into property categories
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }, //get latest values first
    { $limit: 6 }, //last 6 month will be returned since sort returns latest
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      // destructuring syntax
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format("MMM YY");
      return { date, count };
    })
    .reverse(); // returns the latest month last

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

// to process data in mongo db --> use mongo aggregation pipeline
