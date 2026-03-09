import { Request, Response } from "express";
import Booking from "../models/Booking";
import Event from "../models/Event";
import {AuthRequest} from "../middleware/authMiddleware";

interface BookingEventBody {
    eventId: string;
    seatsBooked: number;
}

// Create a new booking
export const bookEvent = async (
    req: AuthRequest & { body: BookingEventBody }, 
    res: Response) => {
        try {
            const { eventId, seats } = req.body;

            // Check if event exists
            const event = await Event.findById(eventId);
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            // Check if enough seats are available
            if (event.availableSeats < seats) {
                return res.status(400).json({ message: "Not enough seats available" });
            }
            //decrease available seats
            event.availableSeats -= seats;
            await event.save();

            // Create booking
            const booking = await Booking.create({
                user: req.user?.id,
                event: eventId,
                seatsBooked: seats
            });

            res.status(201).json({ message: "Booking created successfully", booking });

        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }

    //get My Bookings
    export const getMyBookings = async (
        req: AuthRequest, 
        res: Response) => {
            try {
                const bookings = await Booking.find({ 
                    user: req.user?.id 
                })
                .populate("event")
                .sort({ createdAt: -1 })

                res.status(200).json(bookings);
            } catch (error) {
                res.status(500).json({ message: "Server error", error });
            }
        }

    
    // Get all bookings (admin only)
    export const getAllBookings = async (req: AuthRequest, res: Response) => {
        try {
            const bookings = await Booking.find()
                .populate("user", "name email")
                .populate("event", "title date")
                .sort({ createdAt: -1 });

            res.status(200).json(bookings);
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    };

    // delete booking (optional, not implemented in routes yet)
    export const deleteBooking = async (req: AuthRequest, res: Response) => {  
        try {
            const { bookingId } = req.params;
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }
            if (booking.user.toString() !== req.user?.id) {
                return res.status(403).json({ message: "Unauthorized" });
            }
            // Increase available seats back to the event
            const event = await Event.findById(booking.event);
            if (event) {
                event.availableSeats += booking.seatsBooked;
                await event.save();
            }

            await booking.deleteOne();
            res.status(200).json({ message: "Booking deleted successfully" });
        } catch (error) {       
            res.status(500).json({ message: "Server error", error });
        }

    }

    // Get total bookings count (admin only)
    export const getBookingCount = async (req: AuthRequest, res: Response) => {
        try {
            const count = await Booking.countDocuments();  
            res.status(200).json({ count });
        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    }


