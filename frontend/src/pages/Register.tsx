import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import your custom hook

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth(); // Get the register function from context
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Step 1: Handle input changes dynamically
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Step 2: Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 3: Call the register function from AuthContext
      await register(formData);

      // Step 4: Redirect to login page upon success
      // We pass a 'state' object so the login page can show a success message
      navigate("/login", { state: { message: "Registration successful! Please login." } });

    } catch (err: any) {
      // Step 5: Catch and display backend errors
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 relative overflow-hidden">
      {/* Decorative Background Bubbles */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl"></div>
      
      <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full relative z-10">
        {/* Left Side - Image */}
        <div className="hidden md:flex w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14"
            alt="Concert Party"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-indigo-900/40 flex flex-col items-center justify-center text-white px-10 text-center">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Join Us!</h1>
            <p className="text-lg text-gray-100 drop-shadow-md">
              Create an account today and start booking unparalleled experiences.
            </p>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full md:w-1/2 p-8 py-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Create Account
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Sign up to explore amazing events nearby</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-2 rounded-xl font-bold text-white shadow-lg transform transition hover:scale-[1.02] active:scale-[0.98] ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 cursor-pointer"
              }`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-800 transition">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;