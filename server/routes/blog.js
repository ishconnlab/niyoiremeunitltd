import express from 'express';
import { authorize, protect } from '../middleware/auth.js';
import { createPost, deletePost, getAdminPosts, getPost, getPosts, updatePost } from '../controllers/blogController.js';

const router = express.Router();
router.get('/', getPosts);
router.get('/admin', protect, authorize('super_admin'), getAdminPosts);
router.get('/:slug', getPost);
router.post('/', protect, authorize('super_admin'), createPost);
router.put('/:id', protect, authorize('super_admin'), updatePost);
router.delete('/:id', protect, authorize('super_admin'), deletePost);
export default router;
