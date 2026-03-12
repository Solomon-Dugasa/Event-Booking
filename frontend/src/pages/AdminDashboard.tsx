import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getEvents, deleteEvent, getEventCount } from "../services/eventService";
import { getUserCount } from "../services/authService";
import { getBookingCount } from "../services/bookingService";
import { type Event } from "../types/event";
import NavbarAdmin from "../components/NavbarAdmin";

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({ events: 0, users: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events first to show the list
        const eventsData = await getEvents();
        setEvents(eventsData);
        
        // Then fetch stats
        const [eventCount, userCount, bookingCount] = await Promise.all([
          getEventCount(),
          getUserCount(),
          getBookingCount()
        ]);

        setStats({
          events: eventCount.count,
          users: userCount.count,
          bookings: bookingCount.count
        });
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        setEvents(events.filter(event => event._id !== id));
        setStats(prev => ({ ...prev, events: prev.events - 1 }));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleEdit = (id: string) => {
      navigate(`/admin/edit-event/${id}`);
  };

  const handleView = (id: string) => {
      navigate(`/book/${id}`);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      <NavbarAdmin />
      
      {/* Decorative Background Bubbles */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none -z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-30 pointer-events-none -z-0"></div>

      <div className="pt-28 px-6 max-w-7xl mx-auto pb-12 relative z-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <button 
                onClick={() => navigate("/admin/create-event")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Project
            </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Total Events</h3>
                        <p className="text-4xl font-extrabold text-gray-900">{stats.events}</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                    <div>
                         <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Total Users</h3>
                         <p className="text-4xl font-extrabold text-gray-900">{stats.users}</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                         </svg>
                    </div>
                </div>
            </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Total Bookings</h3>
                        <p className="text-4xl font-extrabold text-gray-900">{stats.bookings}</p>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-4.5c0-.621-.504-1.125-1.125-1.125H3.375z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-800">Manage Events</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                            <th className="p-5 pl-8">Event Title</th>
                            <th className="p-5">Date</th>
                            <th className="p-5">Available Seats</th>
                            <th className="p-5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500 animate-pulse">Loading events...</td></tr>
                        ) : events.length === 0 ? (
                             <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-medium">No events found. Create one!</td></tr>
                        ) : (
                            events.map(event => (
                                <tr key={event._id} className="hover:bg-blue-50/50 transition duration-200">
                                    <td className="p-5 pl-8 font-semibold text-gray-900">{event.title}</td>
                                    <td className="p-5 text-gray-600 font-medium">{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="p-5 text-gray-600 font-medium">
                                        <span className={`px-3 py-1 rounded-full text-sm ${event.availableSeats > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {event.availableSeats}
                                        </span>
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button onClick={() => handleEdit(event._id)} className="text-yellow-600 hover:text-yellow-700 bg-yellow-50 hover:bg-yellow-100 p-2 rounded-lg transition shadow-sm" title="Edit">
                                                {/* Edit Icon */}
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleDelete(event._id)} className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition shadow-sm" title="Delete">
                                                {/* Trash Icon */}
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;