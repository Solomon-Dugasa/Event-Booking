import API from "../api/axios";

//set booking for an event
export const bookingEvent = async (bookingData: {
  eventId: string;
  seats: number;
}) => {
  try {
    const response = await API.post("/bookings", bookingData);
    return response.data;
  } catch (error: any) {
    console.error("Error booking event:", error);
    throw error.response?.data?.message || "Booking failed";
  }
};

// get my bookings
export const getMyBookings = async (userId: string) => {
  try {
    const response = await API.get(`/bookings/${userId}/my`); 
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }     
};

// delete booking
export const deleteBooking = async (bookingId: string) => {
  try {
    const response = await API.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};
  
// Get booking count (for admin dashboard)
export const getBookingCount = async () => {
  const response = await API.get("/bookings/count");
  return response.data;
};

// Get all bookings (for admin)
export const getAllBookings = async () => {
  const response = await API.get("/bookings");
  return response.data;
};
