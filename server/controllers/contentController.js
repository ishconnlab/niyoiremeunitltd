import asyncHandler from 'express-async-handler';
import Content from '../models/Content.js';

// @desc    Get all content
// @route   GET /api/content
// @access  Public
export const getContent = asyncHandler(async (req, res) => {
  const { section } = req.query;
  let query = Content.find();

  if (section) {
    query = query.find({ section, isActive: true });
  } else {
    query = query.find({ isActive: true });
  }

  const content = await query.sort({ order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: content.length,
    data: content,
  });
});

// @desc    Get single content item
// @route   GET /api/content/:id
// @access  Public
export const getContentItem = asyncHandler(async (req, res) => {
  const content = await Content.findById(req.params.id);

  if (!content) {
    res.status(404);
    throw new Error('Content not found');
  }

  res.status(200).json({ success: true, data: content });
});

// @desc    Create content
// @route   POST /api/content
// @access  Private (super_admin)
export const createContent = asyncHandler(async (req, res) => {
  const content = await Content.create(req.body);
  res.status(201).json({ success: true, data: content });
});

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private (super_admin)
export const updateContent = asyncHandler(async (req, res) => {
  let content = await Content.findById(req.params.id);

  if (!content) {
    res.status(404);
    throw new Error('Content not found');
  }

  content = await Content.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: content });
});

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private (super_admin)
export const deleteContent = asyncHandler(async (req, res) => {
  const content = await Content.findById(req.params.id);

  if (!content) {
    res.status(404);
    throw new Error('Content not found');
  }

  await content.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

