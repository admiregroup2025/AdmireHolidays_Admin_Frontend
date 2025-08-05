import { Footer } from "@/layouts/footer";
import { MapPin, PencilLine, Trash, ArrowRight } from "lucide-react";

// --- API Integration Placeholder ---
// This is where you'd fetch data from your API.
// For now, we're using a static array to simulate the API response.
// The structure (id, name, image, etc.) should match your actual API data.
const destinationsData = [
    {
        id: 1,
        name: "Santorini, Greece",
        image: "https://images.unsplash.com/photo-1582999274888-21f7e0349f17?q=80&w=2835&auto=format&fit=crop",
        description: "Famous for its stunning sunsets and white-washed villages.",
        location: "Aegean Sea",
    },
    {
        id: 2,
        name: "Kyoto, Japan",
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2940&auto=format&fit=crop",
        description: "Known for its beautiful temples, gardens, and traditional geishas.",
        location: "Honshu Island",
    },
    {
        id: 3,
        name: "Bora Bora, French Polynesia",
        image: "https://images.unsplash.com/photo-1565191284218-1c39474c1a53?q=80&w=2874&auto=format&fit=crop",
        description: "A luxury destination with iconic overwater bungalows.",
        location: "South Pacific Ocean",
    },
    {
        id: 4,
        name: "Amalfi Coast, Italy",
        image: "https://images.unsplash.com/photo-1533162312635-43848b594103?q=80&w=2835&auto=format&fit=crop",
        description: "A stunning coastline with colorful villages and sheer cliffs.",
        location: "Province of Salerno",
    },
     {
        id: 5,
        name: "Serengeti National Park, Tanzania",
        image: "https://images.unsplash.com/photo-1534437433858-4a5e36f4c954?q=80&w=2940&auto=format&fit=crop",
        description: "Home to the Great Migration and vast African plains.",
        location: "Tanzania",
    },
    {
        id: 6,
        name: "Machu Picchu, Peru",
        image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2940&auto=format&fit=crop",
        description: "An ancient Incan citadel set high in the Andes Mountains.",
        location: "Cusco Region",
    },
    {
        id: 7,
        name: "Zermatt, Switzerland",
        image: "https://images.unsplash.com/photo-1579758629938-03607ccDB445?q=80&w=2832&auto=format&fit=crop",
        description: "A mountain resort famed for skiing, climbing and the iconic Matterhorn.",
        location: "Valais",
    },
    {
        id: 8,
        name: "Plitvice Lakes, Croatia",
        image: "https://images.unsplash.com/photo-1559599554-ba8f0f5b15b1?q=80&w=2835&auto=format&fit=crop",
        description: "A forest reserve with a chain of 16 terraced lakes, joined by waterfalls.",
        location: "Central Croatia",
    },
];

const DestinationList = () => {
    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h1 className="title">Destinations</h1>
                <button className="flex items-center gap-x-2 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                    Add New
                </button>
            </div>

            {/* Destination Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {destinationsData.map((destination) => (
                    <div
                        key={destination.id}
                        className="card flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl"
                    >
                        {/* Card Image */}
                        <div className="relative h-48 w-full">
                            <img
                                src={destination.image}
                                alt={destination.name}
                                className="size-full object-cover"
                            />
                        </div>

                        {/* Card Content */}
                        <div className="flex flex-1 flex-col justify-between p-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{destination.name}</h3>
                                <div className="mt-1 flex items-center gap-x-2">
                                    <MapPin
                                        size={16}
                                        className="text-slate-500 dark:text-slate-400"
                                    />
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{destination.location}</p>
                                </div>
                                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{destination.description}</p>
                            </div>
                            
                            {/* Card Actions */}
                            <div className="mt-4 flex items-center justify-between">
                               <a href="#" className="inline-flex items-center gap-x-2 font-semibold text-blue-500 transition-colors hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-500">
                                   View Details <ArrowRight size={16} />
                               </a>
                               <div className="flex items-center gap-x-2">
                                    <button className="text-slate-500 transition-colors hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-600">
                                        <PencilLine size={18} />
                                    </button>
                                    <button className="text-slate-500 transition-colors hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500">
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default DestinationList;