import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getMyBookings, deleteBooking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";
import { type Event } from "../types/event";

interface Booking {
  _id: string;
  event: Event;
  seatsBooked: number;
  createdAt: string;
}

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            const userId = user?.id || user?._id;
            if (userId) { // Ensure user ID is available
                try {
                    const data = await getMyBookings(userId);
                    setBookings(data);
                } catch (err) {
                    console.error("Error fetching bookings", err);
                } finally {
                    setLoading(false);
                }
            } else if (user) {
               console.warn("User object found but no ID: ", user);
               setLoading(false);
            }
        };
        fetchBookings();
    }, [user]);

    const handleCancelBooking = async (bookingId: string) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await deleteBooking(bookingId);
                setBookings((prev) => prev.filter((b) => b._id !== bookingId));
            } catch (err) {
                console.error("Error cancelling booking", err);
                alert("Failed to cancel booking. Please try again.");
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-blue-50">
            <Navbar />

            {/* Decorative Background */ }
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none -z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none -z-0"></div>

            <div className="pt-28 pb-12 px-6 max-w-[85rem] mx-auto relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Bookings</span>
                    </h1>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading bookings...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ring-1 ring-black/5 flex flex-col">
                                <div className="h-32 w-full bg-gray-100 relative">
                                    {booking.event ? (
                                        <img
                                            src={booking.event.imageUrl}
                                            alt={booking.event.title}
                                            className="w-full h-full object-cover text-xs"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
                                            Event Details Unavailable
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    {booking.event ? (
                                        <>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{booking.event.title}</h3>
                                            <div className="space-y-2 mt-1 text-gray-600">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium">Seats:</span>
                                                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-xs">
                                                        {booking.seatsBooked}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>Booked: {new Date(booking.createdAt).toLocaleDateString()}</span>
                                                    <span>Event: {new Date(booking.event.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleCancelBooking(booking._id)}
                                                className="mt-4 w-full py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors text-sm cursor-pointer"
                                            >
                                                Cancel Booking
                                            </button>
                                        </>
                                    ) : (
                                        <p className="text-red-500 text-sm">Event information is missing.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && bookings.length === 0 && (
                     <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-blue-50 shadow-sm mt-8">
                        <p className="text-gray-500 text-xl font-medium">You haven't booked any events yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
