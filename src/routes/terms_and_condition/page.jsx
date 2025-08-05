import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { usePlaceStore } from "../../stores/usePlaceStore";
import { Loader2, FileText, Edit, Save, MapPin } from "lucide-react";

const TermsAndCondition = () => {
  // --- Local state for UI control ---
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [travelType, setTravelType] = useState("domestic");


  // State now holds the destination NAME, not the ID
  const [selectedPlaceName, setSelectedPlaceName] = useState("");

  
  // Local state for the text area, synced with the store's content
  const [textContent, setTextContent] = useState("");

  
  // --- Get state and actions from the Zustand store ---
  const {
    destinationList,
    isListLoading,
    currentTermsContent,
    isContentLoading,
    fetchDestinationList,
    fetchTermsContent,
    updateTermsContent
  } = usePlaceStore();


  // Effect to fetch the destination list ONLY when travelType changes
  useEffect(() => {
    fetchDestinationList(travelType);
  }, [travelType, fetchDestinationList]); 

  
  // Effect to fetch the content when a new destination is selected
  useEffect(() => {
    // highlight-start
    if (selectedPlaceName) {
      // Pass the destination id to the fetch action
      fetchTermsContent(selectedPlaceName);
      setIsEditing(false); 
    } else {
      setTextContent(""); 
    }
  }, [selectedPlaceName, fetchTermsContent]);
  // highlight-end

  // Effect to sync the local text area's content with the store's content
  useEffect(() => {
    setTextContent(currentTermsContent);
  }, [currentTermsContent]);


  // Handle saving the updated content via the store action
  const handleSave = async () => {
    // highlight-start
    if (!selectedPlaceName) {
      toast.warn("Please select a destination to save terms for.");
      return;
    }
    setIsSaving(true);
    const data = { id:selectedPlaceName, terms_and_conditions: textContent };
    // Pass the destination NAME to the update action
    await updateTermsContent(data);
    setIsSaving(false);
    setIsEditing(false);
    // highlight-end
  };

  const handleTypeChange = (e) => {
    setTravelType(e.target.value);
    // highlight-start
    // Reset the destination NAME state
    setSelectedPlaceName("");
    // highlight-end
  };
  
  const handlePlaceChange = (e) => {
    setSelectedPlaceName(e.target.value);
  };

  return (
    <div className="flex flex-col gap-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Destination Terms Management
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Select a destination to view, edit, and manage its associated terms.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Category
                </label>
                <div className="flex gap-6">
                    {["domestic", "international"].map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value={type}
                                checked={travelType === type}
                                onChange={handleTypeChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 bg-transparent"
                            />
                            <span className="capitalize text-slate-800 dark:text-slate-200">
                                {type}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="placeSelect" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Select Destination
                </label>
                <select
                    id="placeSelect"
                    // highlight-start
                    value={selectedPlaceName} // Controlled by the new state
                    // highlight-end
                    onChange={handlePlaceChange}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                    disabled={isListLoading || destinationList.length === 0}
                >
                    <option value="">
                      {isListLoading ? "Loading Destinations..." : "-- Select a Destination --"}
                    </option>
                    {destinationList.map((place) => (
                        // highlight-start
                        // The key remains the unique _id for React's rendering.
                        // The value is now the destination_name for the API call.
                        <option key={place._id} value={place._id}>
                            {place.destination_name}
                        </option>
                        // highlight-end
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* highlight-start */}
      <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 ${!selectedPlaceName ? 'opacity-50' : ''}`}>
      {/* highlight-end */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-x-3">
                <FileText className="size-6 text-slate-800 dark:text-slate-200" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  Associated Terms
                </h2>
            </div>
            <div className="flex items-center gap-x-3">
                {!isEditing ? (
                  // highlight-start
                  <button onClick={() => setIsEditing(true)} disabled={!selectedPlaceName || isSaving || isContentLoading} className="inline-flex items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-600">
                  {/* highlight-end */}
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                  </button>
                ) : (
                  <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600">
                      {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /><span>Saving...</span></> : <><Save className="mr-2 h-4 w-4" /><span>Save</span></>}
                  </button>
                )}
            </div>
        </div>

        <div className="mt-6 min-h-[300px]">
            {isContentLoading ? (
                <div className="text-center py-20 flex flex-col items-center justify-center">
                    <Loader2 className="size-8 text-slate-400 animate-spin mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">Loading Terms...</p>
                </div>
            // highlight-start
            ) : selectedPlaceName ? (
            // highlight-end
                <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    readOnly={!isEditing}
                    className="w-full min-h-[300px] rounded-lg border border-slate-300 bg-transparent p-4 text-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/80 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-slate-50/50 dark:disabled:bg-slate-800/50"
                    placeholder="Enter terms and conditions for this destination..."
                    disabled={!isEditing}
                />
            ) : (
              <div className="text-center py-20 flex flex-col items-center justify-center">
                  <MapPin className="size-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {isListLoading ? "Loading..." : "Please select a destination to manage its terms."}
                  </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TermsAndCondition;