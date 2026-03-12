import { Link } from "react-router-dom";

const NavbarHome = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide text-gray-800">
          Event<span className="text-indigo-600">ify</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          <Link to="/about" className="hover:text-indigo-600 transition">About</Link>
          <Link to="/login" className="hover:text-indigo-600 transition">Events</Link>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition transform"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarHome;