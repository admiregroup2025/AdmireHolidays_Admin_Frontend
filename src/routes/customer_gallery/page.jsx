import { useEffect, useState } from "react";
import { ImagePlus, Loader2, X, Trash2, CheckCircle } from "lucide-react";
import { toast } from 'react-toastify';
import { apiClient } from "../../stores/authStore";

const CustomerGallery = () => {
  // --- STATE MANAGEMENT ---
  const [newImages, setNewImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- API CALLS & DATA FETCHING ---

  const fetchGalleryImages = async () => {
    setIsGalleryLoading(true);
    try {
      const response = await apiClient.get("/admin/customer-gallery");
      console.log(response);
      setGalleryImages(response?.data?.images || []);
    } catch (error) {
      console.error("Failed to fetch gallery images:", error);
      toast.error("Could not load gallery images.");
    } finally {
      setIsGalleryLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  // --- EVENT HANDLERS ---

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + newImages.length > 20) {
      toast.warn("You can upload a maximum of 20 images.");
      return;
    }
    setNewImages((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newImages.length === 0) {
      toast.error("Please select at least one new image to upload.");
      return;
    }

    const formData = new FormData();
    newImages.forEach((image) => {
      formData.append("image", image);
    });

    const toastId = toast.loading("Uploading images...");
    setIsLoading(true);

    try {
      await apiClient.post("/admin/customer-gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.update(toastId, {
        render: "Images uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
      setNewImages([]);
      fetchGalleryImages();
    } catch (error) {
      console.error("Image Upload Error:", error);
      toast.update(toastId, {
        render: "An error occurred while uploading.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETION LOGIC ---

  const handleToggleSelection = (imageId) => {
    setSelectedForDeletion((prevSelected) =>
      prevSelected.includes(imageId)
        ? prevSelected.filter((id) => id !== imageId)
        : [...prevSelected, imageId]
    );
  };

  // highlight-start
  // --- UNIFIED DELETION HANDLER ---
  const handleDelete = async (imageIds) => {
    // Exit if the array is empty or null
    if (!imageIds || imageIds.length === 0) {
      toast.info("No images selected for deletion.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${imageIds.length} image(s)?`)) return;

    setIsDeleting(true);
    try {
      // Always send an array of IDs to the backend
      await apiClient.delete("/admin/customer-gallery/delete", {
        data: { imageIds: imageIds },
      });

      toast.success(`${imageIds.length} image(s) deleted successfully.`);

      // Refresh gallery by filtering out all deleted images
      setGalleryImages((prev) => prev.filter((img) => !imageIds.includes(img._id)));

      // Clear any deleted images from the selection state
      setSelectedForDeletion((prev) => prev.filter((id) => !imageIds.includes(id)));

    } catch (error) {
      console.error("Failed to delete images:", error);
      toast.error("Failed to delete the selected images.");
    } finally {
      setIsDeleting(false);
    }
  };
  // highlight-end

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* UPLOAD FORM */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-8 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold border-b pb-3 border-gray-300 dark:border-gray-600">
            Customer Gallery
          </h1>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload New Images (Max 20)
            </label>
            <label htmlFor="imageUpload" className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950">
              <ImagePlus size={36} className="text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">Click to upload images</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{newImages.length} / 20 selected</span>
              <input id="imageUpload" type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>
          </div>
          {newImages.length > 0 && (
            <div>
              <p className="text-lg font-semibold mb-3">New Image Preview</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {newImages.map((img, idx) => (
                  <div key={idx} className="relative rounded border border-gray-300 dark:border-gray-600 overflow-hidden group">
                    <img src={URL.createObjectURL(img)} alt={`preview-${idx}`} onLoad={(e) => URL.revokeObjectURL(e.target.src)} className="h-24 w-full object-cover" />
                    <button type="button" onClick={() => handleRemoveNewImage(idx)} className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-opacity opacity-0 group-hover:opacity-100">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button type="submit" disabled={newImages.length === 0 || isLoading} className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800">
            {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /><span>Uploading...</span></> : <span>Upload Images</span>}
          </button>
        </form>

        {/* EXISTING GALLERY SECTION */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-3 border-gray-300 dark:border-gray-600">
            <div>
              <h2 className="text-2xl font-bold">Existing Gallery</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Click images to select for bulk deletion.</p>
            </div>
            {/* highlight-start */}
            {/* Button for deleting all selected images */}
            <button
              type="button"
              onClick={() => handleDelete(selectedForDeletion)}
              disabled={selectedForDeletion.length === 0 || isDeleting}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Trash2 className="mr-2 h-5 w-5" />}
              <span>Delete ({selectedForDeletion.length}) Selected</span>
            </button>
            {/* highlight-end */}
          </div>

          {isGalleryLoading ? (
            <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="ml-3">Loading Gallery...</p>
            </div>
          ) : galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {galleryImages.map((image) => {
                const isSelected = selectedForDeletion.includes(image._id);
                return (
                  <div key={image._id} onClick={() => handleToggleSelection(image._id)} className={`relative rounded-md group cursor-pointer border-2 transition-all ${isSelected ? 'border-blue-500 scale-105' : 'border-gray-300 dark:border-gray-600'}`}>
                    <img src={image.url} alt="Customer submission" className="h-32 w-full object-cover rounded-md" />
                    {isSelected && <CheckCircle size={20} className="absolute top-1.5 right-1.5 text-blue-600 bg-white rounded-full" />}
                    {/* highlight-start */}
                    {/* Button for deleting a single image */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent toggling selection when clicking delete
                        handleDelete([image._id]); // Pass the ID in an array
                      }}
                      disabled={isDeleting}
                      className="absolute bottom-1 right-1 bg-black/60 hover:bg-red-600/90 text-white rounded-full p-1.5 transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                    {/* highlight-end */}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">The customer gallery is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerGallery;