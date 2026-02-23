import express from 'express';
import { 
  createConfession, 
  getConfessions, 
  updateConfession, 
  deleteConfession, 
  reactToConfession,
  getMyConfessions,
  getConfessionById
} from '../controllers/confessionController.js';
import { addComment, getComments } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base routes (Now ALL protected)
router.post('/', protect, createConfession); 
router.get('/', protect, getConfessions); // <-- ADDED PROTECT HERE

// User Dashboard
router.get('/me', protect, getMyConfessions);

// ID-based routes (Now ALL protected)
router.get('/:id', protect, getConfessionById); // <-- ADDED PROTECT HERE
router.put('/:id', protect, updateConfession); 
router.delete('/:id', protect, deleteConfession); 
router.post('/:id/react', protect, reactToConfession); // <-- ADDED PROTECT HERE

// Comment Routes
router.post('/:id/comments', protect, addComment);
router.get('/:id/comments', protect, getComments); // <-- ADDED PROTECT HERE

export default router;