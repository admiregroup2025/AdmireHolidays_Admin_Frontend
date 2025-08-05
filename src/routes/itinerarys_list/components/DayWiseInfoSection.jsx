const DaysInformation = ({ formData, setFormData, isEditing }) => {
  const handleChange = (idx, field, value) => {
    const updated = [...formData.days_information];
    updated[idx][field] = value;
    setFormData({ ...formData, days_information: updated });
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Day-wise Plan</h2>
      {formData.days_information.map((day, idx) => (
        <div key={idx} className="mb-4 border p-4 rounded">
          <div className="mb-2">
            <label>Day</label>
            <input
              type="text"
              value={day.day}
              disabled={!isEditing}
              onChange={(e) => handleChange(idx, "day", e.target.value)}
              className="w-full border p-2"
            />
          </div>
          <div className="mb-2">
            <label>Location Name</label>
            <input
              type="text"
              value={day.locationName}
              disabled={!isEditing}
              onChange={(e) => handleChange(idx, "locationName", e.target.value)}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label>Location Detail</label>
            <textarea
              value={day.locationDetail}
              disabled={!isEditing}
              onChange={(e) => handleChange(idx, "locationDetail", e.target.value)}
              className="w-full border p-2"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DaysInformation;
