import { useRef, useState } from "react";
import { Loader2, Video, X, Replace, UploadCloud, Film, MapPin, Eye, Text } from "lucide-react";
import { toast } from "react-toastify";
import { apiClient } from "../../stores/authStore";

const styleProps = {
  inputStyle:
    "block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500",
  labelStyle: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
  cardStyle:
    "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700",
  buttonStyle:
    "flex items-center cursor-pointer gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500",
  removeButtonStyle:
    "flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500",
};

const UploadVideoTestimonial = () => {
  const { cardStyle, labelStyle, inputStyle, buttonStyle } = styleProps;

  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for input fields
  const nameRef = useRef();
  const locationRef = useRef();
  const visibilityRef = useRef();

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    } else if (file) {
      toast.error("Invalid file type. Please select a video.");
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    const videoInput = document.getElementById("videoUpload");
    if (videoInput) videoInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error("Please select a video file.");
      return;
    }

    const name = nameRef.current?.value.trim();
    const location = locationRef.current?.value.trim();
    const visibility = visibilityRef.current?.value;

    if (!name || !location) {
      toast.error("Please fill out the video name and location fields.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("image", videoFile);
    submissionData.append("title", name);
    submissionData.append("location", location);
    submissionData.append("visibility", visibility);

    try {
      setIsLoading(true);
      const response = await apiClient.post("/admin/testimonial-video", submissionData);

      if (response.data.success) {
        toast.success(response.data.message || "Upload successful!");
        setVideoFile(null);
        // Reset form fields
        if (nameRef.current) nameRef.current.value = "";
        if (locationRef.current) locationRef.current.value = "";
        if (visibilityRef.current) visibilityRef.current.value = "public";
        document.getElementById("videoUpload").value = "";
      } else {
        toast.error(response.data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Video Upload Error:", error);
      toast.error("An error occurred during the upload.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit} className={cardStyle}>
        <h1 className="text-xl font-semibold mb-6 flex items-center border-b dark:text-white border-gray-200 dark:border-gray-700 pb-3">
          <Film className="inline mr-3 text-blue-500 dark:text-white" size={22} />
          Upload Video to Gallery
        </h1>

        <div className="space-y-6">
          {/* Video Upload & Preview */}
          <div>
            <label className={labelStyle}>
              <UploadCloud className="mr-2" size={16} /> Video File
            </label>
            {videoFile ? (
              <div className="mt-2 relative rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden group bg-black">
                <video
                  src={URL.createObjectURL(videoFile)}
                  controls
                  muted
                  className="w-full h-auto max-h-72 object-contain"
                  onLoadedData={(e) => URL.revokeObjectURL(e.target.src)}
                />
                <div className="absolute top-2 right-2 flex gap-2 transition-opacity opacity-0 group-hover:opacity-100">
                  <label
                    htmlFor="videoUpload"
                    className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 cursor-pointer"
                    title="Change video"
                  >
                    <Replace size={18} />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
                    title="Remove video"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="videoUpload"
                className="mt-2 flex flex-col items-center justify-center gap-2 cursor-pointer rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 p-10 text-center transition hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800"
              >
                <Video size={36} className="text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
                  Click to upload or drag & drop
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  A single video file (MP4, WebM)
                </span>
              </label>
            )}
            <input id="videoUpload" type="file" accept="video/*" onChange={handleVideoFileChange} className="hidden" />
          </div>

          {/* Text Fields */}
          <div>
            <label htmlFor="name" className={labelStyle}>
              <Text className="mr-2" size={16} /> Title
            </label>
            <input
              type="text"
              name="name"
              id="name"
              ref={nameRef}
              className={inputStyle}
              placeholder="e.g., Summer Highlights"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className={labelStyle}>
              <MapPin className="mr-2" size={16} /> Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              ref={locationRef}
              className={inputStyle}
              placeholder="e.g., California, USA"
              required
            />
          </div>
          <div>
            <label htmlFor="visibility" className={labelStyle}>
              <Eye className="mr-2" size={16} /> Visibility
            </label>
            <select
              id="visibility"
              name="visibility"
              ref={visibilityRef}
              defaultValue="public"
              className={inputStyle}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button type="submit" disabled={!videoFile || isLoading} className={buttonStyle}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Upload Video</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadVideoTestimonial;
