import asyncHandler from 'express-async-handler';
import BlogPost from '../models/BlogPost.js';
import { extractYouTubeVideoId } from '../utils/youtube.js';
import { adminListQuery, adminListResponse } from '../utils/adminPagination.js';

const normalizeInput = (body) => {
  const input = { ...body };
  if (Object.hasOwn(input, 'youtubeVideoId')) {
    if (!input.youtubeVideoId) input.youtubeVideoId = '';
    else {
      const videoId = extractYouTubeVideoId(input.youtubeVideoId);
      if (!videoId) {
        const error = new Error('Enter a valid YouTube watch, youtu.be, embed URL, or 11-character video ID.');
        error.statusCode = 400;
        throw error;
      }
      input.youtubeVideoId = videoId;
    }
  }
  if (input.status === 'published' && !input.publishedAt) input.publishedAt = new Date();
  if (input.status === 'draft') input.publishedAt = null;
  return input;
};

export const getPosts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 12));
  const filter = { status: 'published', publishedAt: { $lte: new Date() } };
  if (req.query.category) filter.categories = String(req.query.category).slice(0, 80);
  const [items, total] = await Promise.all([
    BlogPost.find(filter).select('-body -images').sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    BlogPost.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, page, limit, total, pages: Math.ceil(total / limit) });
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published', publishedAt: { $lte: new Date() } }).lean();
  if (!post) return res.status(404).json({ success: false, message: 'Article not found' });
  res.json({ success: true, data: post });
});

export const getAdminPosts = asyncHandler(async (req, res) => {
  const { query, page, limit } = adminListQuery(req, { fields: ['title', 'slug', 'excerpt', 'author', 'categories', 'tags'] });
  if (['draft', 'published'].includes(req.query.status)) query.status = req.query.status;
  if (req.query.category) query.categories = String(req.query.category).slice(0, 80);
  const [items, total] = await Promise.all([
    BlogPost.find(query).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    BlogPost.countDocuments(query),
  ]);
  res.json(adminListResponse(items, total, page, limit));
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.create(normalizeInput(req.body));
  res.status(201).json({ success: true, data: post });
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Article not found' });
  post.set(normalizeInput(req.body));
  await post.save();
  res.json({ success: true, data: post });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Article not found' });
  res.json({ success: true, data: {} });
});
