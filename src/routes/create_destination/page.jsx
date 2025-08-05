import { useState } from "react";
import { toast } from "react-toastify";
import { MapPin, Globe, Loader2 } from "lucide-react"; // Added ListChecks icon
import { usePlaceStore } from "../../stores/usePlaceStore";

const CreateDestination = () => {

    const [data, setData] = useState({
        type: "domestic",
        destination_name: "",

    });
    const [isLoading, setIsLoading] = useState(false);

    const createDestination = usePlaceStore((state) => state.createDestination);

    // Handler for simple value changes (text input, radio)
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.destination_name.trim()) {
            toast.error("Please enter a destination name.");
            return;
        }

        setIsLoading(true);
        const result = await createDestination(data);

        if (result.success) {
            // Reset form but keep the selected radio button
            setData({
                type: data.type,
                destination_name: ""
            });
        }
        setIsLoading(false);
    }

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                Create New Destination
            </h1>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Destination Type Radio Group */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                            <Globe className="mr-2 inline-block size-5 text-slate-500" />
                            Destination Type
                        </label>
                        <div className="flex items-center gap-x-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="type" value="domestic" checked={data.type === 'domestic'} onChange={handleChange} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600" />
                                <span className="text-gray-700 dark:text-gray-300">Domestic</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="type" value="international" checked={data.type === 'international'} onChange={handleChange} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600" />
                                <span className="text-gray-700 dark:text-gray-300">International</span>
                            </label>
                        </div>
                    </div>

                    {/* Destination Name Input */}
                    <div className="space-y-2">
                        <label htmlFor="destination_name" className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                            <MapPin className="mr-2 inline-block size-5 text-slate-500" />
                            Destination Name
                        </label>
                        <input type="text" id="destination_name" name="destination_name" value={data.destination_name} onChange={handleChange} placeholder="e.g., Goa, Paris" className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus-visible:ring-blue-600" required />
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={isLoading} className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900">
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /><span>Saving...</span></>
                            ) : (
                                <span>Save Destination</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDestination;