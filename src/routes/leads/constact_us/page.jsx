import { useEffect, useState, useMemo } from "react";
import { apiClient } from "../../../stores/authStore";

// --- Mock API & Configuration ---

const ITEMS_PER_PAGE = 10;


const deleteContactAPI = (contactId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real API, you would remove this from your database.
      // For the mock, we don't need to mutate the original array as we will re-fetch.
      console.log(`Successfully deleted contact with ID: ${contactId} on the server.`);
      resolve({ success: true });
    }, 500);
  });
};


// --- React Component ---

const ContactUs = () => {
  // --- State Management ---
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);

  // Calculate the total number of pages. useMemo prevents recalculation on every render.
  const totalPages = useMemo(() => Math.ceil(totalContacts / ITEMS_PER_PAGE), [totalContacts]);

  // --- Data Fetching Hook ---
  useEffect(() => {
    const loadContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch data for the current page
        const response = await apiClient.get("/admin/get-contact");
        // console.log(response.data.Data);
        if(response.data.Data){
          setContacts(response.data.Data);
          setTotalContacts(response.data.Data.length);
        }
        // setContacts(response.data);
        // setTotalContacts(response.total);
      } catch (err) {
        setError("Failed to load contact messages. Please try refreshing the page.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, [currentPage]); // Re-run this effect whenever the currentPage changes.


  // --- Event Handlers ---
  const handleDelete = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact message?")) {
      try {
        await deleteContactAPI(contactId);

        // After successful deletion, refresh the data.
        // Check if we deleted the last item on the current page.
        if (contacts.length === 1 && currentPage > 1) {
          // If so, navigate to the previous page.
          setCurrentPage(prevPage => prevPage - 1);
        } else {
          // Otherwise, just re-fetch the current page data.
          const response = await fetchContacts(currentPage);
          setContacts(response.data);
          setTotalContacts(response.total);
        }
      } catch (err) {
        alert("Failed to delete the message. Please try again.");
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
          Contact Us Messages
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Review and manage all messages submitted through the contact form.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {isLoading ? (
          <p className="text-center p-8 text-slate-600 dark:text-slate-400">Loading Messages...</p>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/10 rounded-xl">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : contacts.length > 0 ? (
          <>
            {/* Grid of Contact Cards */}
            <div className="grid grid-cols-1 gap-6">
              {contacts.map((contact) => (
                <div key={contact._id} className="rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">{contact.subject}</p>
                        <h2 className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100">{contact.name}</h2>
                        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                          <span>{contact.email}</span>
                          <span>{contact.phone_no}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 mt-4 sm:mt-0">
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="inline-flex items-center justify-center rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-500/10 dark:focus:ring-offset-slate-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{contact.message}</p>
                    </div>
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
          // Message for when there are no contacts
          <div className="text-center py-16 px-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
             <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">No Contact Messages</h3>
             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">When users submit messages, they will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;