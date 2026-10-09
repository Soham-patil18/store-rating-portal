import express from 'express';
import { register, login, updatePassword, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.put('/password', authenticateToken, updatePassword);

export default router;
