import { useEffect, useState } from "react";
import { apiClient } from "../../../stores/authStore";

// --- Mock API Functions ---

const deleteJourneyAPI = (journeyId) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // In a real API, you would check if the delete was successful.
      console.log(`Successfully deleted journey with ID: ${journeyId} on the server.`);
      resolve({ success: true });
    }, 500);
  });
};


// --- React Component ---

const PlanYourJourney = () => {
  // --- State Management ---

  // State to hold the list of journey plans
  const [journeys, setJourneys] = useState([]);
  // State to manage the loading status while fetching data
  const [isLoading, setIsLoading] = useState(true);
  // State to hold any potential errors during data fetching
  const [error, setError] = useState(null);

  // --- Data Fetching ---

  // useEffect hook to fetch data when the component mounts.
  useEffect(() => {
    const loadJourneys = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get("/admin/plan-your-journey");
        if (res.data.Data) {
          setJourneys(res.data.Data);
        }
      } catch (err) {
        setError("Failed to load journey plans. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadJourneys();
  }, []);


  // --- Event Handlers ---

  // Handles the deletion of a journey plan.
  const handleDelete = async (journeyId) => {
    // User confirmation to prevent accidental deletion
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        // Call the API to delete the journey on the server
        await deleteJourneyAPI(journeyId);

        // If the API call is successful, update the UI by filtering out the deleted journey
        setJourneys(currentJourneys => currentJourneys.filter(journey => journey.id !== journeyId));
      } catch (err) {
        // In a real app, you might show a notification to the user
        alert("Failed to delete the journey. Please try again.");
        console.error("Deletion error:", err);
      }
    }
  };


  // --- Render Logic ---

  // Display a loading message while data is being fetched
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-600 dark:text-slate-400">Loading Journey Plans...</p>
      </div>
    );
  }

  // Display an error message if data fetching fails
  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 dark:bg-red-900/10 rounded-xl">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-8 p-4 md:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Plan Your Journey Submissions
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Here are all the journey plans submitted by users.
        </p>
      </div>

      {/* List of Journey Plans */}
      <div className="space-y-6">
        {journeys.length > 0 ? (
          journeys.map((journey) => (
            <div key={journey.id} className="rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">

                  {/* User details and message */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{journey.name}</h2>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <p><strong>Email:</strong> <a href={`mailto:${journey.email}`} className="text-blue-600 hover:underline">{journey.email}</a></p>
                      <p><strong>Phone:</strong> {journey.phone}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <h3 className="text-md font-medium text-slate-700 dark:text-slate-300">Message:</h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{journey.destination}</p>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="flex-shrink-0 mt-4 md:mt-0">
                    <button
                      onClick={() => handleDelete(journey.id)}
                      className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Message to show when there are no submissions
          <div className="text-center py-12 px-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">No Submissions Yet</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">When users submit their journey plans, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanYourJourney;