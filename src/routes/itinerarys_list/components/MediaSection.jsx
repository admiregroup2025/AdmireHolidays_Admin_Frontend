const MediaSection = ({ formData, isEditing }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Media</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {formData.destination_images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Image ${idx}`}
            className="w-full h-48 object-cover rounded"
          />
        ))}
      </div>

      <div className="mt-4">
        <video controls className="w-full rounded">
          <source src={formData.destination_video} type="video/mp4" />
          Your browser does not support video.
        </video>
      </div>
    </div>
  );
};

export default MediaSection;
