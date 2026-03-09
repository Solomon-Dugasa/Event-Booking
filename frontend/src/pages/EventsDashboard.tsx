import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import API from "../api/axios"; // Remove direct API usage
import { getEvents } from "../services/eventService"; // Import service
import Navbar from "../components/Navbar";
import { type Event } from "../types/event";

const EventsDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch Events from Backend
  const fetchEvents = async () => {
    try {
      const data = await getEvents(); // Use service
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleBookClick = (event: Event) => {
      navigate(`/book/${event._id}`);
  };

  // 2. Filter logic for Search Bar
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-blue-50">
      <Navbar />

      {/* Decorative Background Bubbles (Fixed) */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none -z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none -z-0"></div>

      {/* Main Content Container with Top Padding for Fixed Navbar */}
      <div className="pt-28 pb-12 px-6 max-w-[85rem] mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Events</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover and book the best technology and networking events in your area.
          </p>

          {/* Search Section */}
          <form 
            onSubmit={(e) => { e.preventDefault(); }} 
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto"
          >
            <input
              type="text"
              placeholder="Search events by title..."
              className="w-full px-6 py-3.5 rounded-full bg-white border border-blue-200 text-gray-700 shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="button" // Explicitly prevent form submission unless we want it
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition transform flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Event Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Loading events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredEvents.map((event) => (
              /* Main Card Wrapper */
              <div 
                key={event._id} 
                className="group flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ring-1 ring-black/5 cursor-pointer"
                onClick={() => handleBookClick(event)}
              >
                {/* 1. Image Container (Top) */}
                <div className="h-40 w-full bg-gray-100 relative overflow-hidden rounded-t-2xl shrink-0">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase shadow-sm border border-indigo-100">
                    {event.availableSeats > 0 ? "Available" : "Sold Out"}
                  </div>
                </div>

                {/* 2. Content Container (Bottom) */}
                <div className="flex flex-col flex-grow p-4 bg-white rounded-b-2xl">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Footer (Seats + Button) - Pushed to bottom */}
                  <div className="mt-auto pt-3 border-t border-gray-100 w-full">
                    <div className="flex items-center justify-between text-sm mb-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        <span>💺</span>
                        <span className="font-semibold">{event.availableSeats}</span>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation(); // Stop bubbling
                        handleBookClick(event);
                      }}
                      className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
                        event.availableSeats > 0 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:opacity-95 active:scale-95" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                      }`}
                      disabled={event.availableSeats === 0}
                    >
                      {event.availableSeats > 0 ? "Book Now" : "Sold Out"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-blue-50 shadow-sm mt-8">
            <p className="text-gray-500 text-xl font-medium">No events found matching your search.</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-4 text-indigo-600 font-medium hover:text-indigo-800 underline transition"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsDashboard;