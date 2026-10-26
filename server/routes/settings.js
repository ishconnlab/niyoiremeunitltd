import express from 'express';
import { getPublicSettings, updateWhatsappContacts } from '../controllers/settingsController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/public', getPublicSettings);
router.put('/whatsapp-contacts', protect, authorize('super_admin'), updateWhatsappContacts);
export default router;
