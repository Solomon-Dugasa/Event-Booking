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

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
             <div className="flex items-center space-x-2 text-indigo-600">
                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-semibold text-lg">Loading Event...</span>
             </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <NavbarAdmin />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Edit Event</h2>
                        <p className="mt-1 text-sm text-gray-500">Update event details.</p>
                    </div>
                </div>

                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                    <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                        <div className="px-4 py-5 sm:p-6 space-y-6">
                             {/* Grid Layout */}
                             <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                
                                {/* Title */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5 border"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Event Date</label>
                                    <div className="mt-1">
                                        <input
                                            type="datetime-local"
                                            name="date"
                                            id="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5 border"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="sm:col-span-6">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <div className="mt-1">
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5 border"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Seats */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="totalSeats" className="block text-sm font-medium text-gray-700">Total Seats</label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            name="totalSeats"
                                            id="totalSeats"
                                            value={formData.totalSeats}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5 border"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Image URL/Upload */}
                                <div className="sm:col-span-4">
                                    <label className="block text-sm font-medium text-gray-700">Update Image</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer relative">
                                        <div className="space-y-1 text-center">
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={handleFileChange}
                                            />
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                    Upload new file
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            {file && <p className="text-sm font-semibold text-green-600 mt-2">Selected: {file.name}</p>}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                         <input
                                            type="text"
                                            name="imageUrl"
                                            placeholder="Or enter image URL"
                                            value={formData.imageUrl}
                                            onChange={handleChange}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2.5 border"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                         <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/admin")}
                                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEvent;