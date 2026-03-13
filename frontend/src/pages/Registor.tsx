import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/authService";



const Register = () => {
    const navigate = useNavigate();
    const [, setLoading] = useState(false);
    const [, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError("");

    const data = await registerUser(formData);

    // Save token
    localStorage.setItem("token", data.token);

    // Redirect to events page
    navigate("/events");

  } catch (err: any) {
    setError(
      err.response?.data?.message || "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-purple-950 to-black flex items-center justify-center px-6">

      {/* Glass Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">
            Create Account
          </h2>
          <p className="text-gray-400 text-sm">
            Join and start booking amazing events
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold text-white transition duration-300 shadow-lg"
          >
            Register
          </button>

        </form>

        {/* Bottom Link */}
        <p className="text-gray-400 text-sm text-center mt-8">
          Already have an account?{" "}
          
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;