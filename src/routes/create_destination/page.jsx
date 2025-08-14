import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { MapPin, Globe, Loader2, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { usePlaceStore } from "../../stores/usePlaceStore";
import { useNavigate } from "react-router-dom";

const CreateDestination = () => {
    const [data, setData] = useState({
        type: "domestic",
        destination_name: "",
        image: [], // renamed from images to match backend
        destination_type: [] // backend expects this name
    });
    const [isLoading, setIsLoading] = useState(false);

    const { createDestination, fetchDestinationList, destinationList, isListLoading } = usePlaceStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDestinationList(data.type);
    }, [data.type, fetchDestinationList]);

    const handleChange = (e) => {
        const { name, value, files, checked, type } = e.target;

        // Multiple images
        if (name === "image") {
            setData({
                ...data,
                image: Array.from(files) // keep same name as backend
            });
        }
        // Destination types checklist
        else if (name === "destination_type") {
            setData({
                ...data,
                destination_type: checked
                    ? [...data.destination_type, value]
                    : data.destination_type.filter((item) => item !== value)
            });
        }
        // Text/radio fields
        else {
            setData({
                ...data,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.destination_name.trim()) {
            toast.error("Please enter a destination name.");
            return;
        }

        const formData = new FormData();
        formData.append("type", data.type);
        formData.append("destination_name", data.destination_name);

        // Append multiple images
        data.image.forEach((img) => {
            formData.append("image", img); // backend expects "image"
        });

        // Append destination types
        data.destination_type.forEach((t) => {
            formData.append("destination_type", t); // backend expects "destination_type"
        });

        setIsLoading(true);
        const result = await createDestination(formData);
        if (result.success) {
            setData({
                type: data.type,
                destination_name: "",
                image: [],
                destination_type: []
            });
            fetchDestinationList(data.type);
        }
        setIsLoading(false);
    };

    const typeRef = useRef(data.type);
    useEffect(() => {
        typeRef.current = data.type;
    }, [data.type]);

    const handleDelete = async (id) => {
        const result = await usePlaceStore.getState().deleteDestination(id);
        fetchDestinationList(typeRef.current);
    };

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Create New Destination</h1>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Destination Type */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                            <Globe className="mr-2 inline-block size-5 text-slate-500" />
                            Destination Type
                        </label>
                        <div className="flex items-center gap-x-6">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    name="type"
                                    value="domestic"
                                    checked={data.type === "domestic"}
                                    onChange={handleChange}
                                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                                />
                                <span className="text-gray-700 dark:text-gray-300">Domestic</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    name="type"
                                    value="international"
                                    checked={data.type === "international"}
                                    onChange={handleChange}
                                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                                />
                                <span className="text-gray-700 dark:text-gray-300">International</span>
                            </label>
                        </div>
                    </div>

                    {/* Destination Name */}
                    <div className="space-y-2">
                        <label htmlFor="destination_name" className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                            <MapPin className="mr-2 inline-block size-5 text-slate-500" />
                            Destination Name
                        </label>
                        <input
                            type="text"
                            id="destination_name"
                            name="destination_name"
                            value={data.destination_name}
                            onChange={handleChange}
                            placeholder="e.g., Goa, Paris"
                            className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus-visible:ring-blue-600"
                            required
                        />
                    </div>

                    {/* Destination Types Checklist */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                            Destination Categories
                        </label>
                        <div className="flex flex-wrap gap-4">
                            {["trending", "exclusive", "weekend", "home"].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="destination_type"
                                        value={option}
                                        checked={data.destination_type.includes(option)}
                                        onChange={handleChange}
                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Multiple Images Upload */}
                    <div className="space-y-2">
                        <label htmlFor="image" className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                            <ImageIcon className="mr-2 inline-block size-5 text-slate-500" />
                            Upload Images
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image" // backend expects "image"
                            accept="image/*"
                            multiple
                            onChange={handleChange}
                            className="block w-full text-sm text-gray-700 dark:text-gray-300"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900 sm:w-auto"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>Save Destination</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Destination List */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {data.type === "domestic" ? "Domestic" : "International"} Destinations
                </h2>
                {isListLoading ? (
                    <div className="text-slate-600 dark:text-slate-300">Loading...</div>
                ) : destinationList.length === 0 ? (
                    <div className="text-slate-600 dark:text-slate-300">No destinations found.</div>
                ) : (
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-100 dark:bg-slate-800">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-slate-800 dark:text-slate-200">Destination Name</th>
                                <th colSpan={2} className="px-4 py-2 text-right text-sm font-medium text-slate-800 dark:text-slate-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {destinationList.map((dest) => (
                                <tr key={dest._id}>
                                    <td className="px-4 py-2 text-slate-900 dark:text-slate-50">{dest.destination_name}</td>
                                    <td className="px-2 py-2 text-right">
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/create_destination/edit/${dest._id}`)}
                                            className="mr-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(dest._id)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CreateDestination;