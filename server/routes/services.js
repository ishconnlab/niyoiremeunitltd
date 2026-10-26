import express from 'express';
import { authorize, protect } from '../middleware/auth.js';
import { createService, deleteService, getAdminServices, getService, getServices, updateService } from '../controllers/serviceController.js';

const router = express.Router();
router.get('/', getServices);
router.get('/admin', protect, authorize('super_admin'), getAdminServices);
router.get('/:slug', getService);
router.post('/', protect, authorize('super_admin'), createService);
router.put('/:id', protect, authorize('super_admin'), updateService);
router.delete('/:id', protect, authorize('super_admin'), deleteService);
export default router;
