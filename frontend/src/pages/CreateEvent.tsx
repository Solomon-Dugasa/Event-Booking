import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/eventService";
import NavbarAdmin from "../components/NavbarAdmin";

const CreateEvent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        totalSeats: 0,
        availableSeats: 0,
        imageUrl: ""
    });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("date", formData.date);
            data.append("totalSeats", formData.totalSeats.toString());
            data.append("availableSeats", formData.totalSeats.toString());

            if (file) {
                data.append("image", file);
            } else if (formData.imageUrl) {
                data.append("imageUrl", formData.imageUrl);
            }

            await createEvent(data);
            navigate("/admin");
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <NavbarAdmin />
            <div className="pt-32 pb-12 px-6 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Create New Event</h1>
                
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Event Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter event title"
                            className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe the event..."
                            className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Date</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Total Seats</label>
                            <input
                                type="number"
                                name="totalSeats"
                                value={formData.totalSeats}
                                onChange={handleChange}
                                min="1"
                                className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Image URL (Optional)</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                disabled={!!file}
                            />
                        </div>

                         <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300"></span>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or upload an image</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin")}
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;