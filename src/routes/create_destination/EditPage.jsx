import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "../../stores/authStore";

const EditDestination = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    type: "",
    destination_name: "",
    image: [], // ✅ consistent key
    existingImages: [],
    destination_type: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiClient.get(`/admin/destination/edit/${id}`);
        if (res.data.success) {
          setData({
            type: res.data.destination.domestic_or_international
              ?.toLowerCase()
              .trim(),
            destination_name: res.data.destination.destination_name || "",
            image: [],
            existingImages: res.data.destination.title_image || [],
            destination_type: res.data.destination.destination_type || []
          });
        } else {
          toast.error("Failed to load destination data.");
        }
      } catch {
        toast.error("Server error while fetching destination.");
      }
    }
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files, checked, type } = e.target;

    if (name === "image") { // ✅ match state key
      setData({ ...data, image: Array.from(files) });
    } else if (name === "destination_type") {
      setData({
        ...data,
        destination_type: checked
          ? [...data.destination_type, value]
          : data.destination_type.filter((t) => t !== value)
      });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("destination_name", data.destination_name);

    data.destination_type.forEach((t) =>
      formData.append("destination_type", t)
    );

    data.image.forEach((file) => {
      formData.append("image", file); // ✅ backend field name
    });

    try {
      const response = await apiClient.patch(`/admin/destination/${id}`,
        formData
      );
      if (response.data.success) {
        toast.success("Destination updated successfully.");
        navigate("/create_destination");
      } else {
        toast.error(response.data.message || "Update failed.");
      }
    } catch {
      toast.error("Server error while updating destination.");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Edit Destination
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Destination Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Destination Type
          </label>
          <select
            name="type"
            value={data.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            <option value="">Select Type</option>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
        </div>

        {/* Destination Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Destination Name
          </label>
          <input
            type="text"
            name="destination_name"
            value={data.destination_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          />
        </div>

        {/* Destination Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Categories
          </label>
          <div className="flex gap-4 flex-wrap">
            {["trending", "exclusive", "weekend", "home"].map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="destination_type"
                  value={opt}
                  checked={data.destination_type.includes(opt)}
                  onChange={handleChange}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Upload New Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload New Images
          </label>
          <input
            type="file"
            name="image" // ✅ match handleChange
            multiple
            onChange={handleChange}
            className="mt-1 block w-full text-gray-900 dark:text-gray-200"
          />
        </div>

        {/* Existing Images from Backend */}
        {data.existingImages.length > 0 && (
          <div>
            <h2 className="mt-4 mb-2 font-medium text-gray-700 dark:text-gray-300">
              Existing Images
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {data.existingImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative border rounded-md overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Existing ${idx}`}
                    className="w-full h-28 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md shadow-md"
          >
            {isLoading ? "Updating..." : "Update Destination"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDestination;
