import express from 'express';
import { 
    register,
    login,
    getMe,
    getUserCount
 } from '../controllers/authController';
import { adminOnly, protect } from '../middleware/authMiddleware';

const router = express.Router();

// Register route
router.post("/register", register);
// Login route
router.post("/login", login);
// Get current user route
router.get("/me", protect, getMe);
// Get total users count (admin only)
router.get("/count", protect, adminOnly, getUserCount);

export default router;