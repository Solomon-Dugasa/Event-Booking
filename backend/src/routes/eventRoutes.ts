import express from 'express';
import { 
    createEvent, 
    getEvents, 
    getEventById, 
    deleteEvent, 
    getEventCount,
    updateEvent
} from '../controllers/eventController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';


const router = express.Router();

// Admin route to create new event
router.post('/', protect, adminOnly, upload.single('image'), createEvent);
// Get total events count (admin only)
router.get("/count", protect, adminOnly, getEventCount);
// Public route to get all events
router.get('/', getEvents);
// Public route to get single event
router.get('/:id', getEventById);
// Delete event 
router.delete("/:eventId", protect, adminOnly, deleteEvent)
// Update event
router.put("/:id", protect, adminOnly, upload.single('image'), updateEvent);

export default router;
