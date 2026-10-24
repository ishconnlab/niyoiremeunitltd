import express from 'express';
import {
  getContent,
  getContentItem,
  createContent,
  updateContent,
  deleteContent,
} from '../controllers/contentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getContent).post(protect, createContent);
router
  .route('/:id')
  .get(getContentItem)
  .put(protect, updateContent)
  .delete(protect, deleteContent);

export default router;

