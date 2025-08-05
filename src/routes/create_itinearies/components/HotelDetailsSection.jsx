import { PlusCircle, Trash2 } from "lucide-react";

const HotelDetailsSection = ({
  formData,
  handleArrayChange,
  handleAddItem,
  handleRemoveItem,
  styles,
  handleInputChange,
}) => {
  const { cardStyle, labelStyle } = styles;

  // Convert the string to a boolean for checkbox checked state
  const isChecked = formData.hotel_as_per_category === "As per category";

  return (
    <div className={cardStyle}>
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
        Hotel Details
      </h2>

      {/* Checkbox input */}
      <div className="mb-4">
        <label htmlFor="hotel_as_per_category" className={labelStyle}>
          <input
            type="checkbox"
            id="hotel_as_per_category"
            name="hotel_as_per_category"
            checked={isChecked}
            onChange={(e) =>
              handleInputChange({
                target: {
                  name: "hotel_as_per_category",
                  value: e.target.checked ? "As per category" : "",
                },
              })
            }
            className="mr-2"
          />
          As per category
        </label>
      </div>

      {/* Add hotel-related fields here if needed */}

    </div>
  );
};

export default HotelDetailsSection;
