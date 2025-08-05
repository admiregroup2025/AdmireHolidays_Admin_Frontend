import React, { useEffect, useState, useMemo } from "react";
import { usePlaceStore } from "@/stores/usePlaceStore"; // Adjust path if necessary
import { toast } from "react-toastify";

const DestinationSelector = ({
  value,
  onChange,
  label = "Select Destination",
  defaultType = "domestic",
  required = false,
}) => {
  const [travelType, setTravelType] = useState(defaultType);

  const {
    destinationList,
    isListLoading,
    fetchDestinationList,
  } = usePlaceStore();

  // --- LOGIC (Unchanged) ---
  // Fetch destination list whenever travel type changes
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        await fetchDestinationList(travelType);
      } catch (err) {
        console.error("Failed to fetch destinations", err);
        // Avoid toast spam on every type change error if desired
        // toast.error("Failed to load destinations"); 
      }
    };
    loadDestinations();
    // Reset the parent component's selected destination ID
    if (onChange) {
        onChange(""); 
    }
  }, [travelType, fetchDestinationList]); // Dependencies remain correct

  // Memoize dropdown options for performance
  const destinationOptions = useMemo(() => {
    return destinationList.map((place) => (
      <option key={place._id} value={place._id}>
        {place.destination_name}
      </option>
    ));
  }, [destinationList]);

  // Handler for changing travel type radio buttons
  const handleTypeChange = (e) => {
    setTravelType(e.target.value);
  };
  
  // --- UI (Updated) ---
  return (
    <div className="w-full space-y-6">
      {/* Travel Type Radio Buttons */}
      <div>
        <p className="text-lg font-medium mb-2 text-slate-800 dark:text-slate-200">Select Travel Type:</p>
        <div className="flex gap-6">
          {["domestic", "international"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={type}
                checked={travelType === type}
                onChange={handleTypeChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-transparent"
              />
              <span className="capitalize text-gray-700 dark:text-gray-300">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Destination Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isListLoading}
          required={required}
        >
          <option value="">
            {isListLoading ? "Loading..." : "-- Select a Destination --"}
          </option>
          {destinationOptions}
        </select>
        
        {/* Loading and empty state feedback */}
        {!isListLoading && destinationList.length === 0 && travelType && (
            <p className="text-sm text-red-500 mt-1">
              No destinations found for '{travelType}'.
            </p>
        )}
      </div>
    </div>
  );
};

export default DestinationSelector;