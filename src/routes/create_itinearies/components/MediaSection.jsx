import { useEffect, useState } from "react";
import { CheckCircle, GalleryHorizontal, Image as ImageIcon, Video, X } from "lucide-react";
import { apiClient } from "../../../stores/authStore";

const MediaSection = ({ formData, setFormData, styles }) => {
    // console.log("MediaSection formData:", formData);
    const { labelStyle, cardStyle } = styles;

    const [galleryImages, setGalleryImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            if (!formData.selected_destination_id) {
                setGalleryImages([]);
                return;
            }

            try {
                setIsLoading(true);
                const res = await apiClient.get(`/admin/image-Gallery/${formData.selected_destination_id}`);
                setGalleryImages(res?.data?.imageGalleryData?.image || []);
            } catch (error) {
                console.error("Error fetching gallery images:", error);
                setGalleryImages([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [formData.selected_destination_id]);

    const handleImageToggle = (imgUrl) => {
        const isSelected = formData.destination_images.includes(imgUrl);
        const updatedImages = isSelected ? formData.destination_images.filter((url) => url !== imgUrl) : [...formData.destination_images, imgUrl];

        setFormData((prev) => ({
            ...prev,
            destination_images: updatedImages,
        }));
    };

    const handleThumbnailToggle = (thumbUrl) => {
        const isSelected = formData.destination_thumbnails.includes(thumbUrl);
        const updatedThumbnails = isSelected
            ? formData.destination_thumbnails.filter((url) => url !== thumbUrl)
            : [...formData.destination_thumbnails, thumbUrl];

        setFormData((prev) => ({
            ...prev,
            destination_thumbnails: updatedThumbnails,
        }));
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                video: file, // ✅ Correct field name
            }));
        }
    };

    const handleRemoveVideo = () => {
        setFormData((prev) => ({
            ...prev,
            video: null, // ✅ Reset 'video' field
        }));
        const fileInput = document.getElementById("video-upload");
        if (fileInput) fileInput.value = "";
    };

    const renderImageGrid = (images, selectedImages, onToggle, type) => {
        if (isLoading) {
            return <p className="text-sm italic text-gray-500">Loading images...</p>;
        }
        if (images.length > 0) {
            return (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                    {images.map((imgUrl, idx) => {
                        const isSelected = selectedImages.includes(imgUrl);
                        return (
                            <div
                                key={`${type}-${idx}`}
                                className={`relative cursor-pointer rounded-md border-2 transition ${
                                    isSelected ? "border-blue-500" : "border-gray-300"
                                }`}
                                onClick={() => onToggle(imgUrl)}
                            >
                                <img
                                    src={imgUrl}
                                    alt={`${type}-${idx}`}
                                    className="h-20 w-full rounded-md object-cover"
                                />
                                {isSelected && (
                                    <CheckCircle
                                        size={18}
                                        className="absolute right-1 top-1 rounded-full bg-white text-blue-600"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }
        return <p className="text-sm italic text-gray-500">No images found for this destination.</p>;
    };

    return (
        <div className={`mt-8 space-y-6 ${cardStyle}`}>
            <h2 className="border-b border-gray-700 pb-2 text-xl font-semibold">Media</h2>

            {formData.selected_destination_id ? (
                <>
                    {/* Video Upload Section */}
                    <div className="space-y-3">
                        <label className={`${labelStyle}`}>
                            <Video
                                className="text-muted-foreground mr-1 inline"
                                size={16}
                                src={formData.destination_video? formData.destination_video : ''}
                            />
                            Upload a Video for {formData.selected_destination}
                        </label>
                        {formData.video ? (
                            <div className="flex items-center gap-2 rounded-md border bg-gray-50 p-2">
                                <p className="truncate text-sm font-medium text-gray-700">{formData.video.name}</p>
                               
                                <button
                                    type="button"
                                    onClick={handleRemoveVideo}
                                    className="ml-auto cursor-pointer p-1 text-gray-500 hover:text-red-600"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <input
                                id="video-upload"
                                type="file"
                                accept="video/*"
                                name="video"
                                onChange={handleVideoChange}
                                className="block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                            />
                        )}
                    </div>

                    {/* Thumbnail Selection Section */}
                    <div className="space-y-3 pt-4">
                        <label className={labelStyle}>
                            <ImageIcon
                                className="text-muted-foreground mr-1 inline"
                                size={16}
                            />
                            Select Thumbnail Images for {formData.selected_destination}
                        </label>
                        {renderImageGrid(galleryImages, formData.destination_thumbnails, handleThumbnailToggle, "thumbnail")}
                    </div>

                    {/* Destination Images Selection Section */}
                    <div className="space-y-3 pt-4">
                        <label className={labelStyle}>
                            <GalleryHorizontal
                                className="text-muted-foreground mr-1 inline"
                                size={16}
                            />
                            Select Destination Images for {formData.selected_destination}
                        </label>
                        {renderImageGrid(galleryImages, formData.destination_images, handleImageToggle, "gallery")}
                    </div>
                </>
            ) : (
                <p className="text-sm italic text-gray-500">Please select a destination in Core Details section to show available images.</p>
            )}
        </div>
    );
};

export default MediaSection;
