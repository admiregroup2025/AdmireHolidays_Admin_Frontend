import { useState, useEffect } from "react";
import { CoreDetailsSection, DayInfoSection, DescriptionsSection, HotelDetailsSection, MediaSection, PricingSection } from "./components";
import { extractDaysAndNights } from "../../utils/extractDaysFromDuration";
import { apiClient } from "../../stores/authStore";
import { toast } from "react-toastify";

const CreateItineriesPage = () => {
    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = useState({
        cancellation_policy: "",
        classification: ["Trending"],
        days_information: [{ day: "1", locationName: "", locationDetail: "" }],
        destination_detail: "",
        destination_images: [],
        destination_thumbnails: [],

        duration: "",
        exclusion: "",
        hotel_as_per_category: "",
        inclusion: "",
        itinerary_theme: ["Family"],
        itinerary_type: "flexible",
        itinerary_visibility: "public",
        payment_mode: "",
        pricing: "",
        selected_destination_id: "",
        terms_and_conditions: "",
        title: "",
        video: null,
    });

    // console.log("console in FormData:---> ", formData);

    // --- HANDLER FUNCTIONS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e, index, arrayName) => {
        const { name, value } = e.target;
        const newArray = [...formData[arrayName]];
        newArray[index][name] = value;
        setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
    };

    const handleAddItem = (arrayName, newItem) => {
        setFormData((prev) => ({
            ...prev,
            [arrayName]: [...prev[arrayName], newItem],
        }));
    };

    const handleRemoveItem = (index, arrayName) => {
        const newArray = formData[arrayName].filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, [arrayName]: newArray }));
    };

    // --- SUBMIT FUNCTION WITH TOAST NOTIFICATIONS ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        const toastId = toast.loading("Creating your itinerary...");

        // Convert the formData state object to actual multipart/form-data
        const formDataToSend = new FormData();

        // Append basic fields
        formDataToSend.append("title", formData.title);
        // formDataToSend.append("pricing", formData.pricing);
        if (typeof formData.pricing === "object") {
            formDataToSend.append("pricing", JSON.stringify(formData.pricing));
        } else {
            formDataToSend.append("pricing", formData.pricing); // e.g., "As per the destination"
        }

        formDataToSend.append("travel_type", formData.travel_type);
        formDataToSend.append("itinerary_type", formData.itinerary_type);
        formDataToSend.append("itinerary_visibility", formData.itinerary_visibility);
        formDataToSend.append("inclusion", formData.inclusion);
        formDataToSend.append("exclusion", formData.exclusion);
        formDataToSend.append("terms_and_conditions", formData.terms_and_conditions);
        formDataToSend.append("payment_mode", formData.payment_mode);
        formDataToSend.append("selected_destination_id", formData.selected_destination_id);
        formDataToSend.append("destination_detail", formData.destination_detail);
        formDataToSend.append("cancellation_policy", formData.cancellation_policy);
        formDataToSend.append("hotel_as_per_category", formData.hotel_as_per_category);
        formDataToSend.append("duration", formData.duration);

        // Append arrays or objects as JSON strings
        formDataToSend.append("classification", JSON.stringify(formData.classification));
        formDataToSend.append("itinerary_theme", JSON.stringify(formData.itinerary_theme));
        formDataToSend.append("days_information", JSON.stringify(formData.days_information));
        formDataToSend.append("destination_thumbnails", JSON.stringify(formData.destination_thumbnails));
        formDataToSend.append("destination_images", JSON.stringify(formData.destination_images));

        // Append the video (must match field name in multer)
        if (formData.video) {
            formDataToSend.append("video", formData.video); // ✅ This must match `uploadMedia.single("video")`
        }

        try {
            const response = await apiClient.post("/admin/itinerary", formDataToSend); // 🚫 No need to set headers

            if (response.status === 200 || response.status === 201) {
                toast.update(toastId, {
                    render: "Itinerary created successfully! 🎉",
                    type: "success",
                    isLoading: false,
                    autoClose: 5000,
                });
                // Reset form if needed
            } else {
                throw new Error(response.data?.message || "Unexpected response from server.");
            }
        } catch (error) {
            console.error("Error creating itinerary:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to create itinerary.";
            toast.update(toastId, {
                render: `Error: ${errorMessage} 🤯`,
                type: "error",
                isLoading: false,
                autoClose: 7000,
            });
        }
    };

    // --- DYNAMIC DAY GENERATION ---
    useEffect(() => {
        if (formData.duration && formData.duration !== "Custom") {
            const { days } = extractDaysAndNights(formData.duration);
            const dayArray = Array.from({ length: days }, (_, i) => ({
                day: `${i + 1}`,
                locationName: "",
                locationDetail: "",
            }));
            setFormData((prev) => ({
                ...prev,
                days_information: dayArray,
            }));
        }
    }, [formData.duration]);

    useEffect(() => {
        if (formData.duration === "Custom" && formData.custom_days) {
            const days = parseInt(formData.custom_days, 10);
            if (!isNaN(days)) {
                const dayArray = Array.from({ length: days }, (_, i) => ({
                    day: `${i + 1}`,
                    locationName: "",
                    locationDetail: "",
                }));
                setFormData((prev) => ({
                    ...prev,
                    days_information: dayArray,
                }));
            }
        }
    }, [formData.custom_days, formData.duration]);

    // --- SHARED STYLING ---
    const styleProps = {
        inputStyle:
            "block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500",
        labelStyle: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
        cardStyle: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700",
        buttonStyle: "flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500",
        removeButtonStyle: "flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500",
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 text-gray-900 dark:bg-gray-900 dark:text-white sm:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-6 text-3xl font-bold">Create New Itinerary</h1>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >
                    <CoreDetailsSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                        styles={styleProps}
                    />

                    <DayInfoSection
                        formData={formData}
                        handleArrayChange={handleArrayChange}
                        handleAddItem={handleAddItem}
                        handleRemoveItem={handleRemoveItem}
                        styles={styleProps}
                    />

                    <PricingSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                        styles={styleProps}
                    />

                    <MediaSection
                        formData={formData}
                        setFormData={setFormData}
                        styles={styleProps}
                    />

                    <DescriptionsSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                        styles={styleProps}
                        setFormData={setFormData}
                    />

                    <HotelDetailsSection
                        formData={formData}
                        handleArrayChange={handleArrayChange}
                        handleAddItem={handleAddItem}
                        handleRemoveItem={handleRemoveItem}
                        styles={styleProps}
                        handleInputChange={handleInputChange}
                    />

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded-lg bg-green-600 px-8 py-3 text-lg font-bold text-white shadow-sm hover:bg-green-500"
                        >
                            Create Itinerary
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateItineriesPage;
