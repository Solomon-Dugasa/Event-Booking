import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-white py-8 px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-1">
          <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
            Eventify
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Your go-to platform for discovering and booking the best events in
            town. Join our community and never miss out on the fun.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-slate-300 hover:text-white transform hover:scale-110">
              <span className="text-lg">🐦</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-slate-300 hover:text-white transform hover:scale-110">
              <span className="text-lg">📘</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-slate-300 hover:text-white transform hover:scale-110">
              <span className="text-lg">📸</span>
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-base font-bold mb-4 text-white tracking-wide">Company</h4>
          <ul className="space-y-2 text-slate-400 text-sm font-medium">
            <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-base font-bold mb-4 text-white tracking-wide">Resources</h4>
          <ul className="space-y-2 text-slate-400 text-sm font-medium">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Settings</a></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="text-base font-bold mb-4 text-white tracking-wide">Subscribe</h4>
          <p className="text-slate-400 text-sm mb-3 leading-relaxed">
            Get the latest updates and offers directly in your inbox.
          </p>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-slate-800 border border-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 transition-all font-medium text-sm"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 text-sm cursor-pointer">
              Subscribe Now
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-8 pt-6 text-center text-slate-500 text-xs font-medium">
        <p>&copy; {new Date().getFullYear()} Eventify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
