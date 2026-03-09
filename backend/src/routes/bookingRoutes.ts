import express from 'express';
import { 
    bookEvent,
    deleteBooking,
    getBookingCount,
    getMyBookings,
    getAllBookings
 } from '../controllers/bookingController';
import { adminOnly, protect } from '../middleware/authMiddleware';

const router = express.Router();

// Route to get all bookings (admin only)
router.get('/', protect, adminOnly, getAllBookings);
// Route to book an event
router.post('/', protect, bookEvent);
// Route to get my bookings
router.get('/:userId/my', protect, getMyBookings);
// Delete booking
router.delete("/:bookingId", protect, deleteBooking)
// Get total bookings count (admin only)
router.get("/count", protect, adminOnly, getBookingCount);

export default router;