import { Request, Response } from 'express';
import Event from '../models/Event';

// create interface
interface EventRequestBody {
    title: string;
    description: string;
    date: Date;
    totalSeats: number;
    availableSeats: number;
    imageUrl?: string;
}

// Create a new event
export const createEvent = async (req: Request<{}, {}, EventRequestBody>, res: Response) => {
    try {
        const { title, description, date, totalSeats, availableSeats } = req.body;
        let { imageUrl } = req.body;

        if ((req as any).file) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${(req as any).file.filename}`;
        }

        const event = await Event.create({
            title,
            description,
            date,
            totalSeats,
            availableSeats,
            imageUrl
        });
        res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

// Get all events
export const getEvents = async (req: Request, res: Response) => {
    try {

        const events = await Event.find().sort({ date: 1 });
        res.status(200).json(events);

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

// Get single event
export const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => { 
    try {
        const { eventId } = req.params;
        const event = await Event.findByIdAndDelete(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

// Get total events count (admin only)
export const getEventCount = async (req: Request, res: Response) => {
    try {
        const count = await Event.countDocuments(); 
        res.status(200).json({ count });
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            message: "Server error",
            error: error instanceof Error ? error.message : error });
}
}

// Update event
export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let updateData = req.body;

        if ((req as any).file) {
            updateData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${(req as any).file.filename}`;
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedEvent) {
             return res.status(404).json({ message: "Event not found" });
        }
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}


   