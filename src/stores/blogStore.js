import { create } from 'zustand';
import { apiClient } from './authStore'; // Assuming your apiClient is here
import { toast } from 'react-toastify';

export const useBlogStore = create((set, get) => ({
  blogs: [],
  blogToEdit: null,
  isLoading: false,
  isFetchingDetails: false,

  // --- ACTIONS ---

  // Fetch all blogs for the list page
  fetchBlogs: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get("/admin/blog");
      const blogData = res?.data?.blogData || [];
      set({ blogs: blogData, isLoading: false });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs.");
      set({ isLoading: false });
    }
  },

  // Fetch a single blog's details for the edit page
  fetchBlogById: async (id) => {
    set({ isFetchingDetails: true, blogToEdit: null }); // Reset previous one
    try {
      const res = await apiClient.get(`/admin/blog/${id}`);
      if (res.data.success) {
        set({ blogToEdit: res.data.blogData, isFetchingDetails: false });
      } else {
        toast.error(res.data.msg || "Failed to fetch blog details.");
        set({ isFetchingDetails: false });
      }
    } catch (error) {
      console.error("Error fetching blog by ID:", error);
      toast.error("An error occurred while fetching blog details.");
      set({ isFetchingDetails: false });
    }
  },

  // Create a new blog post
  createBlog: async (formData, navigate) => {
    set({ isLoading: true });
    try {
      const res = await apiClient.post('/admin/blog', formData);
      if (res.data.success) {
        toast.success(res.data.msg || "Blog created successfully!");
        get().fetchBlogs(); // Refresh the blog list
        navigate('/blogs_list'); // Navigate back to the list
      } else {
        toast.error(res.data.msg || "Failed to create blog.");
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      set({ isLoading: false });
    }
  },

  // Update an existing blog post
  updateBlog: async (id, formData, navigate) => {
    set({ isLoading: true });
    try {
      console.log("Update formData:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await apiClient.patch(`/admin/blog/${id}`, formData);
      if (res.data.success) {
        toast.success(res.data.msg || "Blog updated successfully!");
        get().fetchBlogs(); // Refresh the blog list
        navigate('/blogs_list'); // Navigate back to the list
      } else {
        toast.error(res.data.msg || "Failed to update blog.");
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete a blog post
  deleteBlog: async (id) => {
    try {
      await apiClient.delete(`/admin/blog/${id}`);
      toast.success("Blog deleted successfully.");
      // Optimistically update UI by removing the blog from the local state
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog.");
    }
  },

  // Clear blogToEdit when leaving the create/edit page
  clearBlogToEdit: () => {
    set({ blogToEdit: null });
  }
}));