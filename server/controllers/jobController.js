import asyncHandler from 'express-async-handler';
import Job from '../models/Job.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = asyncHandler(async (req, res) => {
  const { category } = req.query;
  let query = Job.find({ isActive: true });

  if (category) {
    query = query.find({ category });
  }

  const jobs = await query.sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.status(200).json({ success: true, data: job });
});

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (super_admin)
export const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create(req.body);
  res.status(201).json({ success: true, data: job });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (super_admin)
export const updateJob = asyncHandler(async (req, res) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: job });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (super_admin)
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  await job.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
