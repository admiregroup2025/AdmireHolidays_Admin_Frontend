const HotelAndPolicy = ({ formData, setFormData, isEditing }) => {
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div>
        <label>Hotel Category</label>
        <input
          value={formData.hotel_as_per_category}
          onChange={(e) => handleChange("hotel_as_per_category", e.target.value)}
          disabled={!isEditing}
          className="w-full border p-2"
        />
      </div>

      <div>
        <label>Pricing</label>
        <input
          value={formData.pricing}
          onChange={(e) => handleChange("pricing", e.target.value)}
          disabled={!isEditing}
          className="w-full border p-2"
        />
      </div>

      <div>
        <label>Inclusion</label>
        <textarea
          value={formData.inclusion}
          onChange={(e) => handleChange("inclusion", e.target.value)}
          disabled={!isEditing}
          className="w-full border p-2"
        />
      </div>

      <div>
        <label>Exclusion</label>
        <textarea
          value={formData.exclusion}
          onChange={(e) => handleChange("exclusion", e.target.value)}
          disabled={!isEditing}
          className="w-full border p-2"
        />
      </div>

      <div className="md:col-span-2">
        <label>Terms & Conditions</label>
        <textarea
          value={formData.terms_and_conditions}
          onChange={(e) => handleChange("terms_and_conditions", e.target.value)}
          disabled={!isEditing}
          className="w-full border p-2"
        />
      </div>

      <div className="md:col-span-2">
        <label>Cancellation Policy</label>
        <textarea
          value={formData.cancellation_policy}
          onChange={(e) => handleChange("cancellation_policy", e.target.value)}
          disabled={!isEditing}
          className="w-full border p-2"
        />
      </div>
    </div>
  );
};

export default HotelAndPolicy;
