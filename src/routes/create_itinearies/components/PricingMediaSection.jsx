import {
  Image as ImageIcon,
  CheckCircle,
  IndianRupee,
  Percent,
  GalleryHorizontal,
  BadgeIndianRupee,
} from "lucide-react";

const dummyImageData = {
  Delhi: [
    "https://placehold.co/600x400?text=Delhi+1",
    "https://placehold.co/600x400?text=Delhi+2",
    "https://placehold.co/600x400?text=Delhi+3",
  ],
  Goa: [
    "https://placehold.co/600x400?text=Goa+1",
    "https://placehold.co/600x400?text=Goa+2",
    "https://placehold.co/600x400?text=Goa+3",
  ],
  Jaipur: [
    "https://placehold.co/600x400?text=Jaipur+1",
    "https://placehold.co/600x400?text=Jaipur+2",
    "https://placehold.co/600x400?text=Jaipur+3",
  ],
};

const PricingMediaSection = ({
  formData,
  setFormData,
  handleInputChange,
  styles,
}) => {
  const { cardStyle, labelStyle, inputStyle } = styles;

  const handleImageToggle = (imgUrl) => {
    const isSelected = formData.destination_images.includes(imgUrl);
    const updatedImages = isSelected
      ? formData.destination_images.filter((url) => url !== imgUrl)
      : [...formData.destination_images, imgUrl];

    setFormData((prev) => ({
      ...prev,
      destination_images: updatedImages,
    }));
  };

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
        Pricing & Media
      </h2>

      {/* Pricing Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standard Pricing */}
        <div>
          <label htmlFor="pricing" className={labelStyle}>
            <IndianRupee className="inline mr-1 text-muted-foreground" size={16} />
            Standard Price
          </label>
          <input
            type="number"
            name="pricing"
            id="pricing"
            value={formData.pricing}
            onChange={handleInputChange}
            className={inputStyle}
            placeholder="Enter standard price"
          />
        </div>

        {/* Best Quote */}
        <div>
          <label htmlFor="best_price" className={labelStyle}>
            <BadgeIndianRupee className="inline mr-1 text-muted-foreground" size={16} />
            Best Quote (optional)
          </label>
          <input
            type="number"
            name="best_price"
            id="best_price"
            value={formData.best_price || ""}
            onChange={handleInputChange}
            className={inputStyle}
            placeholder="Enter best deal quote"
          />
        </div>

        {/* Discount */}
        <div className="md:col-span-2">
          <label htmlFor="discount" className={labelStyle}>
            <Percent className="inline mr-1 text-muted-foreground" size={16} />
            Discount
          </label>
          <input
            type="number"
            name="discount"
            id="discount"
            value={formData.discount}
            onChange={handleInputChange}
            className={inputStyle}
            placeholder="Enter discount if any"
          />
        </div>

        {/* Thumbnail */}
        <div className="md:col-span-2">
          <label htmlFor="destination_thumbnail" className={labelStyle}>
            <ImageIcon className="inline mr-1 text-muted-foreground" size={16} />
            Thumbnail Image URL
          </label>
          <input
            type="url"
            name="destination_thumbnail"
            id="destination_thumbnail"
            value={formData.destination_thumbnail}
            onChange={handleInputChange}
            className={inputStyle}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      {/* Image Picker */}
      {formData.selected_destination && dummyImageData[formData.selected_destination] ? (
        <div className="mt-6">
          <label className={labelStyle}>
            <GalleryHorizontal className="inline mr-1 text-muted-foreground" size={16} />
            Select Images for {formData.selected_destination}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-2">
            {dummyImageData[formData.selected_destination].map((imgUrl, idx) => {
              const isSelected = formData.destination_images.includes(imgUrl);
              return (
                <div
                  key={idx}
                  className={`relative cursor-pointer border-2 rounded-md transition ${isSelected ? "border-blue-500" : "border-gray-300"}`}
                  onClick={() => handleImageToggle(imgUrl)}
                >
                  <img
                    src={imgUrl}
                    alt={`img-${idx}`}
                    className="w-full h-20 object-cover rounded-md"
                  />
                  {isSelected && (
                    <CheckCircle
                      size={18}
                      className="absolute top-1 right-1 text-blue-600 bg-white rounded-full"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm mt-4 text-gray-500 italic">
          Please select a destination in Core Details section to show available images.
        </p>
      )}
    </div>
  );
};

export default PricingMediaSection;
