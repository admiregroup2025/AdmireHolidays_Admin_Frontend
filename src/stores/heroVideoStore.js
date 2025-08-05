import { create } from 'zustand';
import { toast } from 'react-toastify';
import { apiClient } from './authStore';

export const useHeroVideoStore = create((set, get) => ({
  videos: [],
  isLoading: false,
  error: null,
  visibility: 'public',
  title: null,

  fetchVideos: async (page) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/admin/hero-section/${page}`);
      console.log('Fetch Videos Response by page:', response.data);
      if (response.data.success) {
        set({ videos: response.data.heroVideoData[0].video_url || [] });
        set({ visibility: response.data.heroVideoData[0].visibility });
        set({ title: response.data.heroVideoData[0].title || null });
      } else {
        throw new Error(response.data.msg || 'Failed to fetch videos.');
      }
    } catch (error) {
      console.error('Fetch Videos Error:', error);
      toast.error(error.message || 'An error occurred while fetching videos.');
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteVideo: async (videoId) => {

    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        const response = await apiClient.delete(
          `/admin/hero-section/${videoId}?title=${get().title}`
        );
        if (response.data.success) {
          toast.success(response.data.msg || 'Video deleted successfully!');
          get().fetchVideos(get().title); // Refresh the list for the current page
        } else {
          throw new Error(response.data.msg || 'Failed to delete video.');
        }
      } catch (error) {
        console.error('Delete Video Error:', error);
        toast.error(error.message || 'An error occurred while deleting the video.');
      }
    }
  },

  updateVisibility: async (videoId, currentVisibility, page) => {
    const newVisibility = currentVisibility === 'Public' ? 'Private' : 'Public';
    try {
      const response = await apiClient.patch(`/admin/hero-section/${videoId}`, {
        title: get().title
      });
      if (response.data.success) {
        toast.success(`Video is now ${response.data.msg}.`);
        get().fetchVideos(get().title); // Refresh the list for the current page
      } else {
        throw new Error(response.data.msg || 'Failed to update visibility.');
      }
    } catch (error) {
      console.error('Visibility Change Error:', error);
      toast.error(error.message || 'An error occurred while updating visibility.');
    }
  },
}));