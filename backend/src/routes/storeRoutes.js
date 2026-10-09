import express from 'express';
import {
  getAllStores,
  submitOrUpdateRating,
  getOwnerStoreDashboard,
} from '../controllers/storeController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all stores (authenticated)
router.get('/', authenticateToken, getAllStores);

// Normal user submits or modifies rating
router.post('/:storeId/rate', authenticateToken, requireRole('normal'), submitOrUpdateRating);

// Store owner views their store dashboard & customer ratings
router.get('/owner/dashboard', authenticateToken, requireRole('owner'), getOwnerStoreDashboard);

export default router;
