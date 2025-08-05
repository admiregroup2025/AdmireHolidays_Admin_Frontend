import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin, Calendar, Plus, List, ArrowRight, Search, Pencil, Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../stores/authStore";
import { toast } from "react-toastify";

// --- ItineraryCard COMPONENT ---
const ItineraryCard = ({ itinerary, onEdit, onDelete }) => {
  const { title, duration, selected_destination, destination_thumbnails, itinerary_visibility } = itinerary;
  const destination = selected_destination?.destination_name || "N/A";
  const thumbnail = destination_thumbnails?.[0] || "https://via.placeholder.com/400x300";
  const status = itinerary_visibility === "public" ? "public" : "private";
  const navigate = useNavigate();
  return (
    <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <div className="overflow-hidden relative">
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(itinerary._id); }}
            className="p-1.5 bg-white/80 dark:bg-slate-900/80 rounded-full text-blue-600 hover:bg-white transition"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(itinerary._id); }}
            className="p-1.5 bg-white/80 dark:bg-slate-900/80 rounded-full text-red-600 hover:bg-white transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <img
          src={thumbnail}
          alt={`Thumbnail for ${title}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate mb-2">{title}</h3>
        <div className="space-y-2.5 text-sm">
          <p className="flex items-center text-slate-600 dark:text-slate-400">
            <MapPin size={14} className="mr-2 text-slate-500" />
            <span className="font-medium">{destination}</span>
          </p>
          <p className="flex items-center text-slate-600 dark:text-slate-400">
            <Calendar size={14} className="mr-2 text-slate-500" />
            <span className="font-medium">{duration}</span>
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status === 'published'
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
            }`}>
            {status}
          </span>
          <a onClick={(e)=>navigate(`itinerary_details/${itinerary._id}`)} className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700">
            View Details
            <ArrowRight size={14} className="ml-1 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

// --- ItinerariesListPage COMPONENT ---
const ItinerariesListPage = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ type: "all", status: "all", destination: "all" });

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const { data } = await apiClient.get("/admin/itinerary");
        setItineraries(data?.data || []);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
        toast.error("Failed to load itineraries.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredItineraries = useMemo(() => {
    return itineraries
      .filter((it) => {
        const query = searchQuery.toLowerCase();
        return (
          it.title.toLowerCase().includes(query) ||
          it?.selected_destination?.destination_name?.toLowerCase()?.includes(query)
        );
      })
      .filter((it) => {
        if (filters.type === "all") return true;
        return it.selected_destination.domestic_or_international.toLowerCase() === filters.type.toLocaleLowerCase();
      })
      .filter((it) => {
        if (filters.status === "all") return true;
        return it.itinerary_visibility === (filters.status === "published" ? "public" : "private");
      })
      .filter((it) => {
        if (filters.destination === "all") return true;
        return it?.selected_destination?.destination_name?.toLowerCase() === filters.destination;
      });
  }, [searchQuery, filters, itineraries]);

  const handleEdit = (id) => navigate(`/edit_itinerary/${id}`);
  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/admin/itinerary/${id}`);
      setItineraries((prev) => prev.filter((it) => it._id !== id));
      toast.success("Itinerary deleted.");
    } catch {
      toast.error("Failed to delete itinerary.");
    }
  };

  const inputStyle = "block w-full rounded-md border bg-white dark:bg-gray-700 p-2";

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <List className="mr-2 text-blue-500" /> All Itineraries
            </h1>
            <p className="text-slate-500 dark:text-slate-400">Browse or manage travel plans</p>
          </div>
          <button
            onClick={() => navigate("/create_itinerary")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            <Plus size={16} className="inline mr-1" />
            Create New
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl flex flex-wrap gap-4">
          <input
            type="search"
            placeholder="Search by title or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border rounded-md"
          />
          <select name="type" value={filters.type} onChange={handleFilterChange} className={inputStyle}>
            <option value="all">-- Type --</option>
            <option value="Domestic">Domestic</option>
            <option value="International">International</option>
          </select>
          <select name="status" value={filters.status} onChange={handleFilterChange} className={inputStyle}>
            <option value="all">-- Status --</option>
            <option value="published">Published</option>
            <option value="private">Private</option>
          </select>
          <select name="destination" value={filters.destination} onChange={handleFilterChange} className={inputStyle}>
            <option value="all">-- Destination --</option>
            {Array.from(new Set(itineraries.map((it) => it?.selected_destination?.destination)))
              .filter(Boolean)
              .map((dest) => (
                <option key={dest} value={dest.toLowerCase()}>{dest}</option>
              ))}
          </select>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading itineraries...</div>
        ) : filteredItineraries.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No itineraries found.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItineraries.map((item) => (
              <ItineraryCard key={item._id} itinerary={item} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItinerariesListPage;
