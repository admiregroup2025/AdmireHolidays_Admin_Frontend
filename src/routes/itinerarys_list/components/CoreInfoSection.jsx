const CoreDetails = ({ formData, setFormData, isEditing }) => {
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div>
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          disabled={!isEditing}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full border p-2"
        />
      </div>

      <div>
        <label>Destination Name</label>
        <input
          type="text"
          value={formData.destination_detail}
          disabled
          className="w-full border p-2 bg-gray-100"
        />
      </div>

      <div>
        <label>Type</label>
        <input
          type="text"
          value={formData.itinerary_type}
          disabled={!isEditing}
          onChange={(e) => handleChange("itinerary_type", e.target.value)}
          className="w-full border p-2"
        />
      </div>

      <div>
        <label>Theme</label>
        <input
          type="text"
          value={formData.itinerary_theme.join(", ")}
          disabled={!isEditing}
          onChange={(e) =>
            handleChange("itinerary_theme", e.target.value.split(","))
          }
          className="w-full border p-2"
        />
      </div>
      <div>
        <label>Visibility</label>
        <input
          type="text"
          value={formData.itinerary_visibility}
          disabled={!isEditing}
          onChange={(e) =>
            handleChange("itinerary_theme", e.target.value.split(","))
          }
          className="w-full border p-2"
        />
      </div>
    </div>
  );
};

export default CoreDetails;
