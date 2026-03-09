import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import EventsDashboard from "./pages/EventsDashboard";

import MyBookings from "./pages/MyBookings";
import BookingPage from "./pages/BookingPage";
import AdminDashboard from "./pages/AdminDashboard";
import EditEvent from "./pages/EditEvent";
import CreateEvent from "./pages/CreateEvent";
import AdminBookings from "./pages/AdminBookings";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<EventsDashboard />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/book/:eventId" element={<BookingPage />} />
          </Route> 
          
          {/* Admin Protected Routes */}
          <Route element={<ProtectedAdminRoute />}>
             <Route path="/admin" element={<AdminDashboard />} />
             <Route path="/admin/create-event" element={<CreateEvent />} />
             <Route path="/admin/edit-event/:id" element={<EditEvent />} />
             <Route path="/admin/bookings" element={<AdminBookings />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
