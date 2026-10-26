import express from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getJobs).post(protect, authorize('super_admin'), createJob);
router
  .route('/:id')
  .get(getJob)
  .put(protect, authorize('super_admin'), updateJob)
  .delete(protect, authorize('super_admin'), deleteJob);

export default router;

