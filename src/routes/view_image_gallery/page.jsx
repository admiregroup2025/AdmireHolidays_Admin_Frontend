import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, ChevronLeft, ChevronRight, ImageOff, Loader2, Search, Trash2 } from "lucide-react";

import ConfirmationModal from "../../components/ConfirmationModal"; // Adjust path if necessary
import DestinationSelector from "../../components/DestinationSelector"; // Adjust path if necessary
import { apiClient } from "../../stores/authStore"; // Adjust path if necessary

const IMAGES_PER_PAGE = 20;

// --- Helper Components for better UI States ---

// 1. Skeleton Loader for the Image Grid
const GallerySkeleton = () => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="aspect-square w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
    ))}
  </div>
);

// 2. Initial Prompt to guide the user
const InitialPrompt = () => (
  <div className="text-center py-16">
    <Search className="mx-auto h-12 w-12 text-slate-400" />
    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
      Select a Destination
    </h3>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Please choose a destination above to view its image gallery.
    </p>
  </div>
);

// 3. Specific "No Images" message
const NoImagesFound = () => (
   <div className="text-center py-16">
    <ImageOff className="mx-auto h-12 w-12 text-slate-400" />
    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
      No Images Found
    </h3>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      There are no images uploaded for this destination.
    </p>
  </div>
);


// --- Main Component ---

const ViewImageGallery = () => {
  // --- STATE MANAGEMENT ---
  const [allImages, setAllImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // False initially
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [selectedDestinationId, setSelectedDestinationId] = useState("");
  // CRITICAL FIX: Store URLs for selection, as they are the only unique identifier from the backend
  const [selectedImageUrls, setSelectedImageUrls] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null); // Stores the full image object

  // --- DATA FETCHING ---
  useEffect(() => {
    // PREVENTS API CALL ON INITIAL RENDER
    if (!selectedDestinationId) {
      setAllImages([]); // Clear images if no destination is selected
      return;
    }

    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/admin/image-Gallery/${selectedDestinationId}`);
        console.log(response.data);
        // The backend returns an array of simple string URLs
        const imageUrls = response.data?.imageGalleryData?.image || [];

        // Transform into a structured object for easier management
        const transformedImages = imageUrls.map(url => ({
          // Use the URL itself as the unique ID for the key and selection
          id: url, 
          image_url: url,
          destination_id: selectedDestinationId,
        }));

        setAllImages(transformedImages);

      } catch (error) {
        toast.error(error.response?.data?.message || "Image not available for this destination.");
        setAllImages([]); // Ensure gallery is empty on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [selectedDestinationId]); // Dependency array ensures this runs only when the destination changes

  // --- DERIVED STATE & MEMOIZATION ---
  const paginatedImages = useMemo(() => {
    const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
    return allImages.slice(startIndex, startIndex + IMAGES_PER_PAGE);
  }, [allImages, currentPage]);

  const totalPages = Math.ceil(allImages.length / IMAGES_PER_PAGE);

  // --- EVENT HANDLERS ---
  const handleDestinationChange = (destinationId) => {
    setSelectedDestinationId(destinationId);
    setCurrentPage(1);
    setSelectedImageUrls([]); // Clear selections on destination change
  };

  const handleSelectImage = (imageUrl) => {
    setSelectedImageUrls((prev) =>
      prev.includes(imageUrl)
        ? prev.filter((url) => url !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  const openConfirmationModal = (image = null) => {
    setImageToDelete(image);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    // CRITICAL FIX: Send image URLs to the backend, not temporary IDs
    const urlsToDelete = imageToDelete ? [imageToDelete.image_url] : selectedImageUrls;

    if (urlsToDelete.length === 0) {
      toast.warn("No images selected for deletion.");
      setIsDeleting(false);
      return;
    }

    try {
      // API endpoint needs to accept the destination ID and an array of URLs to delete
      await apiClient.delete(`/admin/image-Gallery/delete`, { 
        data: { 
          destination_id: selectedDestinationId,
          image_urls: urlsToDelete 
        } 
      });
      
      // Update state optimistically
      setAllImages((prev) => prev.filter((img) => !urlsToDelete.includes(img.image_url)));
      toast.success(`${urlsToDelete.length} image(s) deleted successfully!`);
      
      setSelectedImageUrls([]);
      setImageToDelete(null);
      setIsModalOpen(false);

    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete images.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- RENDER LOGIC ---
  const renderContent = () => {
    if (isLoading) {
      return <GallerySkeleton />;
    }
    if (!selectedDestinationId) {
      return <InitialPrompt />;
    }
    if (allImages.length === 0) {
      return <NoImagesFound />;
    }
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {paginatedImages.map((image) => {
          const isSelected = selectedImageUrls.includes(image.image_url);
          return (
            <div
              key={image.id} // Use the unique URL as the key
              className="relative group cursor-pointer"
              onClick={() => handleSelectImage(image.image_url)}
            >
              <div className={`absolute inset-0 z-10 rounded-lg ring-2 ring-offset-2 transition-all ${ isSelected ? "ring-blue-600 bg-black/40" : "ring-transparent group-hover:ring-slate-300 dark:group-hover:ring-slate-600" }`}></div>
              {isSelected && <CheckCircle2 className="absolute top-2 right-2 z-20 h-6 w-6 text-white bg-blue-600 rounded-full" />}
              <button onClick={(e) => { e.stopPropagation(); openConfirmationModal(image); }} className="absolute bottom-2 right-2 z-20 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600" aria-label="Delete image">
                <Trash2 className="h-4 w-4" />
              </button>
              <img src={image.image_url} alt="Gallery" className="aspect-square w-full rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Header & Controls */}
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 dark:border-slate-700 md:flex-row md:items-start md:justify-between">
            <div className="flex-grow">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                Image Gallery Management
              </h2>
              <div className="mt-4">
                <DestinationSelector
                  value={selectedDestinationId}
                  onChange={handleDestinationChange}
                />
              </div>
            </div>
            
            {selectedImageUrls.length > 0 && (
              <button onClick={() => openConfirmationModal(null)} className="inline-flex flex-shrink-0 items-center justify-center gap-x-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50">
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedImageUrls.length})
              </button>
            )}
          </div>
          
          {/* Main Content Area */}
          <div className="mt-6 min-h-[300px]">
            {renderContent()}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <div className="mt-8 flex items-center justify-between">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="inline-flex items-center gap-x-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="inline-flex items-center gap-x-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>
            {imageToDelete ? `this image` : `${selectedImageUrls.length} selected images`}
          </strong>
          ? This action cannot be undone.
        </p>
      </ConfirmationModal>
    </>
  );
};

export default ViewImageGallery;