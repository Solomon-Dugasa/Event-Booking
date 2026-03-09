import { useState, useEffect } from "react";
import { getAllBookings, deleteBooking } from "../services/bookingService";
import { getEvents } from "../services/eventService";
import NavbarAdmin from "../components/NavbarAdmin";
import { type Event } from "../types/event";

interface User {
    _id: string;
    name: string;
    email: string;
}

interface Booking {
    _id: string;
    user: User;
    event: {
        _id: string;
        title: string;
        date: string;
    } | null;
    seatsBooked: number;
    createdAt: string;
}

const AdminBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [bookingsData, eventsData] = await Promise.all([
                getAllBookings(),
                getEvents()
            ]);
            // Filter out bookings for deleted events immediately
            setBookings(bookingsData.filter((b: Booking) => b.event !== null));
            setEvents(eventsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                await deleteBooking(id);
                setBookings(bookings.filter(b => b._id !== id));
            } catch (error) {
                alert("Failed to delete booking");
            }
        }
    };

    // Calculate booking counts per event
    const getBookingCountForEvent = (eventId: string) => {
        return bookings.filter(b => b.event?._id === eventId).length;
    };

    const getSelectedEventTitle = () => {
        return events.find(e => e._id === selectedEventId)?.title || "Event";
    };

    const filteredBookings = selectedEventId 
        ? bookings.filter(b => b.event?._id === selectedEventId)
        : [];

    return (
        <div className="relative min-h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
            <NavbarAdmin />
            
            {/* Background elements */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none -z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-30 pointer-events-none -z-0"></div>

            <div className="pt-28 px-6 max-w-7xl mx-auto pb-12 relative z-10">
                
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {selectedEventId ? `Bookings: ${getSelectedEventTitle()}` : "Manage Bookings"}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {selectedEventId 
                                ? "View and manage bookings for this event." 
                                : "Select an event to view its bookings."}
                        </p>
                    </div>
                    {selectedEventId && (
                        <button 
                            onClick={() => setSelectedEventId(null)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            Back to Projects
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                         <div className="animate-pulse text-indigo-600 font-semibold">Loading data...</div>
                    </div>
                ) : (
                    <>
                        {/* VIEW 1: Events Grid */}
                        {!selectedEventId && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.length === 0 ? (
                                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        No projects found.
                                    </div>
                                ) : (
                                    events.map(event => {
                                        const bookingCount = getBookingCountForEvent(event._id);
                                        return (
                                            <div 
                                                key={event._id}
                                                onClick={() => setSelectedEventId(event._id)}
                                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition duration-200 cursor-pointer group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                        </svg>
                                                    </div>
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${bookingCount > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {bookingCount} Booking{bookingCount !== 1 && 's'}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition">{event.title}</h3>
                                                <p className="text-gray-500 text-sm mb-4">{new Date(event.date).toLocaleDateString()}</p>
                                                
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <span>View Bookings</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2 group-hover:translate-x-1 transition">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}

                        {/* VIEW 2: Bookings List for Selected Event */}
                        {selectedEventId && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                                                <th className="p-5 pl-8">User</th>
                                                <th className="p-5">Email</th>
                                                <th className="p-5">Booked Seats</th>
                                                <th className="p-5">Booking Date</th>
                                                <th className="p-5 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredBookings.length === 0 ? (
                                                 <tr><td colSpan={5} className="p-12 text-center text-gray-500 font-medium bg-gray-50/30">No bookings found for this project.</td></tr>
                                            ) : (
                                                filteredBookings.map((booking) => (
                                                    <tr key={booking._id} className="hover:bg-blue-50/50 transition duration-200">
                                                        <td className="p-5 pl-8 font-medium text-gray-900">
                                                            {booking.user?.name || "Unknown User"}
                                                        </td>
                                                        <td className="p-5 text-gray-600">
                                                            {booking.user?.email || "N/A"}
                                                        </td>
                                                        <td className="p-5 text-gray-700 font-semibold">{booking.seatsBooked}</td>
                                                        <td className="p-5 text-gray-500 text-sm">{new Date(booking.createdAt).toLocaleDateString()}</td>
                                                        <td className="p-5 text-center">
                                                            <button 
                                                                onClick={() => handleDelete(booking._id)}
                                                                className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition shadow-sm"
                                                                title="Delete Booking"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminBookings;