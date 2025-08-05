import  { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UploadCloud, PlusCircle, Blinds, Eye, Edit, Loader2 } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useParams, useNavigate } from "react-router-dom";
import { useBlogStore } from "../../stores/blogStore";


const inputStyle = "block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500";
const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";


const CreateBlog = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams(); // Get blog ID from URL if it exists
  const isEditMode = Boolean(id);

  // Get state and actions from the Zustand store
  const { 
      isLoading,
      isFetchingDetails,
      blogToEdit, 
      createBlog, 
      updateBlog, 
      fetchBlogById,
      clearBlogToEdit 
    } = useBlogStore();

    // Add this before the component
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold", "italic", "underline", "strike",
  "list", "bullet",
  "link", "image"
];

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [visibility, setVisibility] = useState("private");
  const [imagePreview, setImagePreview] = useState("");

  // Effect to fetch blog data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchBlogById(id);
    }
    // Cleanup function to clear data when component unmounts
    return () => {
        clearBlogToEdit();
    };
  }, [id, isEditMode, fetchBlogById, clearBlogToEdit]);

  // Effect to populate form when blogToEdit data arrives
  useEffect(() => {
    if (isEditMode && blogToEdit) {
      setTitle(blogToEdit.title || "");
      setContent(blogToEdit.content || "");
      setVisibility(blogToEdit.visibility || "private");
      setImagePreview(blogToEdit.cover_image || "");
      setCoverImage(null); // Reset file input
    }
  }, [blogToEdit, isEditMode]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('visibility', visibility);
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }
    
    if (isEditMode) {
      await updateBlog(id, formData, navigate);
    } else {
      await createBlog(formData, navigate);
    }
  };

  if (isFetchingDetails) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="ml-3 text-lg">Loading Blog Details...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title flex items-center gap-x-2">
        {isEditMode ? <Edit size={24}/> : <PlusCircle size={24}/>}
        {isEditMode ? "Edit Blog Post" : "Create a New Blog Post"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        <div className="card">
          <div className="card-header"><p className="card-title">Blog Details</p></div>
          <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className={labelStyle}><Blinds className="inline mr-2" size={16} /> Title</label>
              <input type="text" name="title" id="title" placeholder="Enter Blog Title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputStyle} required />
            </div>
            <div>
              <label htmlFor="visibility" className={labelStyle}><Eye className="inline mr-2" size={16} /> Visibility</label>
              <select name="visibility" id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)} className={inputStyle} required>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><p className="card-title">Cover Image</p></div>
          <div className="card-body">
            <label htmlFor="dropzone-file" className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-900">
              {imagePreview ? (
                <img src={imagePreview} alt="Cover preview" className="absolute inset-0 w-full h-full object-cover rounded-lg"/>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
                  <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, or GIF</p>
                </div>
              )}
               <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
            {coverImage && <p className="mt-2 text-sm text-blue-500">New image selected: {coverImage.name}</p>}
          </div>
        </div>

        <div>
          <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} placeholder="Write your blog content here..." className={theme === 'dark' ? 'quill-dark' : ''} />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="bg-blue-600 p-2 rounded-md text-white flex items-center gap-x-2 disabled:bg-blue-400">
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : (isEditMode ? <Edit size={20} /> : <PlusCircle size={20} />)}
            {isLoading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Publish Post')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;