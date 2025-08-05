import React, { useEffect } from "react";
import { Pencil, Trash2, PlusCircle, Eye, EyeOff, ArrowRight, List, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBlogStore } from "../../stores/blogStore";

// BlogCard component remains the same as in your original code
const BlogCard = ({ blog, onEdit, onDelete, onToggleVisibility }) => {
  return (
    <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <div className="overflow-hidden relative">
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(blog._id); }}
            className="p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-900 transition"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(blog._id); }}
            className="p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-slate-900 transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <img src={blog.cover_image} alt={`Thumbnail for ${blog.title}`} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate mb-2">{blog.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{blog.description}</p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleVisibility(blog._id, blog.visibility); }}
            className={`flex items-center gap-x-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${blog.visibility === "public" ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"}`}
          >
            {blog.visibility === "public" ? <Eye size={14} /> : <EyeOff size={14} />}
            <span className="capitalize">{blog.visibility}</span>
          </button>
          <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            Read More <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

const BlogList = () => {
  const navigate = useNavigate();
  // Get state and actions from the Zustand store
  const { blogs, isLoading, fetchBlogs, deleteBlog } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleEdit = (id) => {
    // Navigate to the create/edit page with the blog's ID
    navigate(`/create_blog/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteBlog(id);
    }
  };

  const handleVisibilityToggle = (id, currentVisibility) => {
    // This logic would be moved to the store if you want to persist the change
    console.log(`Toggling visibility for blog ${id}. This is a UI-only example.`);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <h1 className="title flex items-center gap-x-2">
            <List size={28} />
            Blog Posts
        </h1>
        <button
          onClick={() => navigate("/create_blog")}
          className="bg-blue-600 p-2 rounded-md text-white flex items-center gap-x-2"
        >
          <PlusCircle size={16} />
          Create New Post
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 animate-pulse">
              <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
              <div className="mt-4 h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="mt-3 h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="mt-1 h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No Blog Posts Found</h3>
          <p className="text-slate-500 mt-2">Get started by creating a new post.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleVisibility={handleVisibilityToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;