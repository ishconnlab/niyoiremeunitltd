import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getMe,
  logoutAdmin,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, getMe);
router.get('/logout', protect, logoutAdmin);

export default router;
