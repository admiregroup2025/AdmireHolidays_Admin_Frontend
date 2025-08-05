import { useEffect, useState, useMemo } from "react";
import { apiClient } from "../../../stores/authStore";

// --- Mock API & Configuration ---

const ITEMS_PER_PAGE = 10;

const deleteSubscriberAPI = (subscriberId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real API, you would execute a DELETE query in your database.
      console.log(`Successfully deleted subscriber with ID: ${subscriberId} on the server.`);
      resolve({ success: true });
    }, 500);
  });
};


// --- React Component ---

const Subscribe = () => {
  // --- State Management ---
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSubscribers, setTotalSubscribers] = useState(0);

  // Memoized calculation for the total number of pages to prevent recalculation
  const totalPages = useMemo(() => Math.ceil(totalSubscribers / ITEMS_PER_PAGE), [totalSubscribers]);

  // --- Data Fetching Hook ---
  // This effect runs on component mount and whenever the currentPage changes.
  useEffect(() => {
    const loadSubscribers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/admin/get-subscribe");
        console.log(response.data.Data);
        if (response.data.Data) {
          setSubscribers(response.data.Data);
          setTotalSubscribers(response.data.Data.length);
        }
      } catch (err) {
        setError("Failed to load subscribers. Please try refreshing the page.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscribers();
  }, [currentPage]);


  // --- Event Handlers ---
  const handleDelete = async (subscriberId) => {
    if (window.confirm("Are you sure you want to delete this subscriber?")) {
      try {
        await deleteSubscriberAPI(subscriberId);

        // After deletion, intelligently refresh the data.
        if (subscribers.length === 1 && currentPage > 1) {
          // If it was the last item on the page, go to the previous page.
          setCurrentPage(prevPage => prevPage - 1);
        } else {
          // Otherwise, just re-fetch the current page.
          const response = await fetchSubscribers(currentPage);
          setSubscribers(response.data);
          setTotalSubscribers(response.total);
        }
      } catch (err) {
        alert("Failed to delete the subscriber. Please try again.");
        console.error("Deletion error:", err);
      }
    }
  };

  const goToNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  // --- Render Logic ---
  return (
    <div className="flex flex-col gap-y-8 p-4 md:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Newsletter Subscribers
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Manage all users subscribed to your newsletter.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {isLoading ? (
          <p className="text-center p-8 text-slate-600 dark:text-slate-400">Loading Subscribers...</p>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/10 rounded-xl">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : subscribers.length > 0 ? (
          <>
            {/* Grid of Subscriber Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscribers.map((subscriber) => (
                <div key={subscriber.id} className="rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 p-6 flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{subscriber.name}</h2>
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-400 space-y-1">
                       <p className="flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                         <a href={`mailto:${subscriber.email}`} className="text-blue-600 hover:underline">{subscriber.email}</a>
                       </p>
                       <p className="flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                         <span>{subscriber.phone}</span>
                       </p>
                    </div>
                  </div>
                   <div className="mt-6">
                      <button
                        onClick={() => handleDelete(subscriber.id)}
                        className="w-full inline-flex items-center justify-center rounded-lg border border-red-600/30 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/10 dark:focus:ring-offset-slate-900"
                      >
                        Delete
                      </button>
                   </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4">
               <p className="text-sm text-slate-600 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
               </p>
               <div className="flex gap-x-2">
                  <button onClick={goToPreviousPage} disabled={currentPage === 1} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                    Previous
                  </button>
                  <button onClick={goToNextPage} disabled={currentPage === totalPages} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                    Next
                  </button>
               </div>
            </div>
          </>
        ) : (
          // Message for when there are no subscribers
          <div className="text-center py-16 px-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
             <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">No Subscribers Found</h3>
             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">When users subscribe to the newsletter, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribe;