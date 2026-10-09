import express from 'express';
import {
  getAdminStats,
  addUser,
  addStore,
  getUsersList,
  getStoresList,
} from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin role
router.use(authenticateToken, requireRole('admin'));

router.get('/stats', getAdminStats);
router.post('/users', addUser);
router.post('/stores', addStore);
router.get('/users', getUsersList);
router.get('/stores', getStoresList);

export default router;
