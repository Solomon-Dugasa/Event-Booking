import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import { getEvents } from '../services/eventService';
import { type Event } from '../types/event';

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="relative min-h-screen bg-blue-50 text-gray-800 overflow-hidden">
      <NavbarHome />

      {/* Decorative Background Bubbles */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none -z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none -z-0"></div>
      
      <div className="flex flex-col items-center justify-center text-center px-6 mt-32 relative z-10">
        {/* Badge */}
        <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
          Welcome to Eventify
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight max-w-4xl text-gray-900 tracking-tight">
          Discover & Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Amazing Events</span> Near You
        </h1>

        {/* Description */}
        <p className="mt-6 text-gray-600 max-w-2xl text-lg leading-relaxed">
          Find concerts, workshops, conferences and more. 
          Book your seat instantly and never miss an experience again.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-10">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition transform cursor-pointer">
            Explore Events
          </button>

          <button className="bg-white text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full font-bold shadow-sm hover:bg-gray-50 hover:shadow-md transition cursor-pointer">
            Learn More
          </button>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="max-w-7xl mx-auto mt-24 px-6 mb-40 relative z-10">

        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Featured <span className="text-indigo-600">Events</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg">
            Discover the most exciting events happening near you.
          </p>
        </div>

        {/* Event Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event._id} className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition duration-300 shadow-lg border border-gray-100 flex flex-col hover:-translate-y-1">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={event.imageUrl || "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2"}
                    alt={event.title}
                    className="h-full w-full object-cover hover:scale-110 transition duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                    Event
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 font-medium flex items-center gap-2">
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                  </p>
                  <div className="mt-auto">
                    <button 
                      onClick={() => navigate('/login')}
                      className="w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition duration-300 shadow-lg border border-gray-100 flex flex-col hover:-translate-y-1 col-span-3 items-center justify-center p-12">
                <p className="text-gray-500 text-lg">No events found. Check back soon!</p>
             </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;