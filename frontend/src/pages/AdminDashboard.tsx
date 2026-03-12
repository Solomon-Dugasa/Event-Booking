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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavbarAdmin />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Dashboard Overview</h2>
                <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening with your events today.</p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
                <button 
                    onClick={() => navigate("/admin/create-event")}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Event
                </button>
            </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {/* Total Events */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Events</dt>
                                <dd>
                                    <div className="text-lg font-bold text-gray-900">{stats.events}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Users */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="p-3 bg-green-100 rounded-lg text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                <dd>
                                    <div className="text-lg font-bold text-gray-900">{stats.users}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Bookings */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                                <dd>
                                    <div className="text-lg font-bold text-gray-900">{stats.bookings}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Events List */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Events</h3>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">Loading events...</td></tr>
                        ) : events.length === 0 ? (
                             <tr><td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">No events found. Start by creating one!</td></tr>
                        ) : (
                            events.map(event => (
                                <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-xs">{event.description.substring(0, 50)}...</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.availableSeats > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {event.availableSeats > 0 ? `${event.availableSeats} Seats Left` : 'Sold Out'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => handleEdit(event._id)} 
                                                className="text-amber-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 p-1.5 rounded-md transition" 
                                                title="Edit"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(event._id)} 
                                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition" 
                                                title="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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