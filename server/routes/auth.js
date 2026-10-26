import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getMe,
  logoutAdmin,
  toggleRegistration,
  getRegistrationStatus,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutAdmin);
router.get('/register/status', getRegistrationStatus);
router.post('/register/toggle', protect, toggleRegistration);

export default router;
