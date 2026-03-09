import api from "../api/axios";

// Create new event
export const createEvent = async (eventData: any) => {
    const response = await api.post("/events", eventData);
    return response.data;
  }

export const getEvents = async () => {
    const response = await api.get("/events");
    return response.data;
  };
  
  export const getEventById = async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  };

  // Get event count (for admin dashboard)
export const getEventCount = async () => {
  const response = await api.get("/events/count");
  return response.data;
}

// Delete event 
export const deleteEvent = async (eventId: string) => {
  const response = await api.delete(`/events/${eventId}`);
  return response.data;
}

// Update event
export const updateEvent = async (eventId: string, eventData: any) => {
  const response = await api.put(`/events/${eventId}`, eventData);
  return response.data;
}
