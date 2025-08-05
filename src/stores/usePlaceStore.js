import { create } from "zustand";
import { toast } from "react-toastify";
import { apiClient } from "./authStore"; // Your configured axios instance


export const usePlaceStore = create((set, get) => ({
  // =================================================================
  //  STATE
  // =================================================================


  isContentLoading: false,
  currentTermsContent: "",
  isListLoading: false,
  destinationList: [],


  createDestination: async (destinationData) => {
    try {
      await apiClient.post(`/admin/new-destination`, destinationData);
      toast.success(`Destination "${destinationData.destination_name}" created successfully!`);
      // After creating, call the single, consolidated fetch action.
      await get().fetchDestinationList(destinationData.type);
      return { success: true };
    } catch (error) {
      console.error("Error creating destination:", error);
      toast.error(error.response?.data?.msg || "Failed to create destination.");
      return { success: false };
    }
  },

  /**
   * The main action to fetch the list of destinations.
   * @param {'domestic' | 'international'} travelType
   */
  fetchDestinationList: async (travelType) => {
    set({ isListLoading: true });
    try {
      const res = await apiClient.get(`/admin/destination/${travelType}`);
      // console.log("Console in use place:-->",res.data);
      set({
        destinationList: res.data.places,
        isListLoading: false
      });
    } catch (error) {
      console.error("Error fetching destination list:", error);
      set({ destinationList: [], isListLoading: false });
    }
  },

  /**
   * Fetches the "Terms and Conditions" content for a specific destination.
   * @param {string} placeId - The ID of the destination.
   */
  fetchTermsContent: async (placeId) => {
    if (!placeId) {
      set({ currentTermsContent: "" });
      return;
    }
    set({ isContentLoading: true });
    try {
      // API endpoint for fetching specific terms content
      const res = await apiClient.get(`/admin/tnc/${placeId}`);

      set({
        currentTermsContent: res.data.tnc.terms_And_condition || "",
        isContentLoading: false
      });

    } catch (error) {
      console.error("Error fetching terms content:", error);
      set({
        currentTermsContent: "Failed to load content.",
        isContentLoading: false
      });
    }
  },


 
  updateTermsContent: async (data) => {
    try {
      const res = await apiClient.patch(`/admin/tnc`, data);
      // console.log("res.data.destinationData.terms_and_conditions-->", res.data);
      
      toast.success("Terms and conditions saved successfully!");
      // Optimistically update the state for a responsive UI
      set({ currentTermsContent: res.data.data.terms_And_condition || "" });
      return { success: true };
    } catch (error) {
      console.error("Error saving terms content:", error);
      toast.error("Something went wrong while saving.");
      return { success: false };
    }
  },

  // =================================================================
  //  BACKWARDS COMPATIBILITY LAYER
  // =================================================================

  // These getters and actions ensure older components that haven't been
  // updated to use `destinationList` will continue to work without any changes.

  // --- COMPATIBILITY GETTERS (STATE) ---
  get termsList() {
    return get().destinationList;
  },
  get galleryPlaces() {
    return get().destinationList;
  },
  get itineraryPlaces() {
    return get().destinationList;
  },

  // --- COMPATIBILITY ACTIONS ---
  fetchTermsList: (travelType) => get().fetchDestinationList(travelType),
  fetchGalleryPlaces: (travelType) => get().fetchDestinationList(travelType),
  fetchItineraryPlaces: (travelType) => get().fetchDestinationList(travelType),

}));