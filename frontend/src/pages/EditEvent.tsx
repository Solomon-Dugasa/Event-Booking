import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, updateEvent } from "../services/eventService";
import NavbarAdmin from "../components/NavbarAdmin";

const EditEvent = () => {
    const { id } = useParams<{ id: string }>();
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                if (!id) return;
                const data = await getEventById(id);
                // format date to yyyy-MM-ddThh:mm for input type datetime-local
                const formattedDate = data.date ? new Date(data.date).toISOString().slice(0, 16) : "";
                setFormData({ ...data, date: formattedDate });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event:", error);
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

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
        try {
            if (!id) return;
            
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("date", formData.date);
            data.append("totalSeats", formData.totalSeats.toString());
            // We usually don't update availableSeats directly on edit unless logic requires, 
            // but if totalSeats changed, we might need to adjust availableSeats. 
            // For now, let's keep existing logic or just send what is needed.
            // The backend updateEvent uses req.body which can be partial.
            // But FormData doesn't support nested objects easily, so flat structure is best.

            if (file) {
                data.append("image", file);
            } else if (formData.imageUrl) {
                data.append("imageUrl", formData.imageUrl);
            }

            await updateEvent(id, data);
            navigate("/admin");
        } catch (error) {
            console.error("Error updating event:", error);
            alert("Failed to update event");
        }
    };

    if (loading) return <div className="min-h-screen bg-blue-50 text-gray-800 pt-24 text-center font-bold text-lg">Loading...</div>;

    return (
        <div className="relative min-h-screen bg-blue-50 text-gray-800 font-sans overflow-hidden">
            <NavbarAdmin />
            {/* Decorative Background Bubbles */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none -z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none -z-0"></div>

            <div className="pt-32 pb-12 px-6 max-w-2xl mx-auto relative z-10">
                <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm">Edit Event</h1>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
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
                            className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
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
                            className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Total Seats</label>
                            <input
                                type="number"
                                name="totalSeats"
                                value={formData.totalSeats}
                                onChange={handleChange}
                                className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Available Seats</label>
                            <input
                                type="number"
                                name="availableSeats"
                                value={formData.availableSeats}
                                onChange={handleChange}
                                className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Image URL</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="w-full bg-gray-50 text-gray-900 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
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
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin")}
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-bold shadow-lg"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;