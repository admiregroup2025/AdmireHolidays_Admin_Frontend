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
    title_image: null,
    existingImageUrl: "",
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
            destination_name: res.data.destination.destination_name,
            title_image: null,
            existingImageUrl: res.data.destination.title_image || "",
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
    const { name, value, files } = e.target;
    if (name === "title_image") {
      setData({ ...data, title_image: files[0] });
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
    if (data.title_image) {
      formData.append("image", data.title_image);
    }

    try {
      const response = await apiClient.patch(
        `/admin/destination/${id}`,
        formData
      );
      if (response.data.success) {
        toast.success("Destination updated successfully.");
        navigate("/create_destination");
      }
    } catch {
      toast.error("Server error while updating destination.");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
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
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:border-blue-400 dark:focus:ring-blue-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:border-blue-400 dark:focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Title Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title Image
          </label>
          <input
            type="file"
            name="title_image"
            onChange={handleChange}
            className="mt-1 block w-full text-gray-900 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 dark:file:border-gray-700 file:text-sm file:font-medium file:bg-gray-100 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-200 hover:file:bg-gray-200 dark:hover:file:bg-gray-600"
          />
          {data.existingImageUrl && (
            <img
              src={data.existingImageUrl}
              alt="Existing"
              className="mt-3 w-40 h-auto rounded-md border border-gray-300 dark:border-gray-700"
            />
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            {isLoading ? "Updating..." : "Update Destination"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDestination;
