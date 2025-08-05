import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MediaSection from "./components/MediaSection";
import CoreDetails from "./components/CoreInfoSection";
import HotelAndPolicy from "./components/HotelAndPolicy";
import DaysInformation from "./components/DayWiseInfoSection";
import { apiClient } from "../../stores/authStore";

const ItineraryDetailsPage = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

   
    useEffect(() => {
    const fetchItineraryData = async () => {
        try {
            const res = await apiClient.get(`/admin/itinerary-details/${id}`);
            console.log("Fetched itinerary data:", res.data);
            setFormData(res.data.data);
        } catch (error) {
            console.error("Failed to fetch itinerary:", error);
        }
    };
    fetchItineraryData();
}, [id]);


    const handleUpdate = async () => {
      try {
        // await axios.put(`/api/v1/itinerary/${itineraryId}`, formData);
        setIsEditing(false);
      } catch (error) {
        console.error("Update failed:", error);
      }
    };

    if (!formData) return <p>Loading...</p>;

    return (
        <div className="mx-auto max-w-6xl p-4">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Itinerary Details</h1>
                <button
                    onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                    {isEditing ? "Save Changes" : "Edit"}
                </button>
            </div>

            <CoreDetails
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
            />
            <MediaSection
                formData={formData}
                isEditing={isEditing}
                setFormData={setFormData}
            />
            <DaysInformation
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
            />
            <HotelAndPolicy
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
            />
        </div>
    );
};

export default ItineraryDetailsPage;
