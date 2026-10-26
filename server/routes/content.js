import express from 'express';
import {
  getContent,
  getAdminContent,
  getContentItem,
  createContent,
  updateContent,
  deleteContent,
} from '../controllers/contentController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getContent).post(protect, authorize('super_admin'), createContent);
router.get('/admin', protect, authorize('super_admin'), getAdminContent);
router
  .route('/:id')
  .get(getContentItem)
  .put(protect, authorize('super_admin'), updateContent)
  .delete(protect, authorize('super_admin'), deleteContent);

export default router;

