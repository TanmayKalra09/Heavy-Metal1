import { Router } from 'express';
import { register, login, verifyToken, logout, getProfile, updateProfile } from '../../controllers/auth.controller.js';
import { protect } from '../../middlewares/auth.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/verify', protect, verifyToken);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
