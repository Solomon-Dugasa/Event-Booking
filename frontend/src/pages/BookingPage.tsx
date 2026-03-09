import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../services/eventService";
import { bookingEvent } from "../services/bookingService";
import Navbar from "../components/Navbar";
import { type Event } from "../types/event";

const BookingPage = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [seats, setSeats] = useState<string>("1");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            if (eventId) {
                try {
                    const data = await getEventById(eventId);
                    setEvent(data);
                } catch (err) {
                    console.error("Error fetching event", err);
                    setError("Failed to load event details.");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchEvent();
    }, [eventId]);

    const handleSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setSeats(value);
        }
    };

    const handleConfirmBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!event || !seats) return;

        const numSeats = parseInt(seats, 10);
        if (numSeats <= 0) {
            setError("Please enter a valid number of seats.");
            return;
        }

        if (numSeats > event.availableSeats) {
            setError(`Only ${event.availableSeats} seats are available.`);
            return;
        }

        try {
            await bookingEvent({ eventId: event._id, seats: numSeats });
            alert("Booking created successfully!");
            navigate("/my-bookings");
        } catch (err: any) {
            console.error("Booking error:", err);
            setError(err.response?.data?.message || err.message || "Booking failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading event details...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="relative min-h-screen bg-blue-50 flex flex-col items-center justify-center">
                <Navbar />
                <p className="text-red-500 text-xl font-medium">Event not found.</p>
                <button 
                    onClick={() => navigate("/dashboard")}
                    className="mt-4 text-indigo-600 hover:text-indigo-800 underline"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-blue-50">
            <Navbar />

            {/* Decorative Background */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none -z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none -z-0"></div>

            <div className="pt-28 pb-12 px-6 max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row gap-8 items-center justify-center">
                
                {/* Event Image & Info */}
                <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-xl overflow-hidden self-start">
                    <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                             <div className="flex items-center gap-2">
                                <span>📅</span>
                                <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                <span>💺</span>
                                <span className="font-semibold">{event.availableSeats} Seats Left</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Form */}
                <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Confirm Your Booking</h3>
                    
                    {error && (
                        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleConfirmBooking} className="space-y-6">
                        <div>
                            <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-1">
                                Number of Seats
                            </label>
                            <input
                                type="text"
                                id="seats"
                                value={seats}
                                onChange={handleSeatsChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition text-gray-700"
                                placeholder="Enter seat count"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Max {event.availableSeats} seats available.
                            </p>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600
                                 text-white font-bold shadow-lg hover:shadow-xl 
                                hover:opacity-95 transform active:scale-95 transition-all duration-300"
                            >
                                Confirm Booking
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="w-full mt-3 py-3 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default BookingPage;
