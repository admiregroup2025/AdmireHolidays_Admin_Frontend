import { useRef, useState, useEffect } from 'react';
import { Loader2, Video, X, Replace, LayoutTemplate, Eye, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiClient } from '../../stores/authStore';
import { useHeroVideoStore } from '../../stores/heroVideoStore';

const HeroVideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [visibility, setVisibility] = useState('public');
  const [activePage, setActivePage] = useState('home');

  console.log('Active Page:', activePage);

  // Zustand store integration
  const { videos, isLoading,title, fetchVideos, deleteVideo, updateVisibility } = useHeroVideoStore();

  const pageRef = useRef();

  // Fetch videos whenever the activePage changes
  useEffect(() => {
    fetchVideos(activePage);
  }, [activePage, fetchVideos]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideo(file);
    } else if (file) {
      toast.error('Invalid file type. Please select a video file.');
    }
  };

  const handleRemoveVideo = () => {
    setVideo(null);
    if (document.getElementById('videoUpload')) {
      document.getElementById('videoUpload').value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      toast.error('Please select a video to upload.');
      return;
    }

    const page = pageRef.current?.value;
    if (!page) {
      toast.error('Please select a page.');
      return;
    }

    const formData = new FormData();
    formData.append('image', video);
    formData.append('title', page);
    formData.append('visibility', visibility);

    try {
      setIsUploading(true);
      const response = await apiClient.post('/admin/hero-section', formData);

      if (response.data.success) {
        toast.success(response.data.msg || 'Video uploaded successfully!');
        handleRemoveVideo();
        pageRef.current.value = 'home';
        setVisibility('public');
        fetchVideos(page); // Refresh the video list for the uploaded page
        setActivePage(page); // Switch to the page where the video was uploaded
      } else {
        toast.error(response.data.msg || 'Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Video Upload Error:', error);
      toast.error('An error occurred while uploading the video.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (videoId) => {
    deleteVideo(videoId, activePage);
  };

  const handleVisibilityChange = (videoId, currentVisibility) => {
    updateVisibility(videoId, currentVisibility);
  };

  const inputStyle =
    'block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500';
  const labelStyle = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
  const pageOptions = ['home', 'about', 'domestic', 'international', 'contact', 'blog'];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-8 border border-gray-200 dark:border-gray-700"
        >
          <h1 className="text-3xl font-bold border-b pb-3 border-gray-300 dark:border-gray-600">
            Manage All Page Hero Videos
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Page Dropdown */}
            <div>
              <label htmlFor="page" className={labelStyle}>
                <span className="inline-flex items-center gap-1">
                  <LayoutTemplate size={16} /> Select Page
                </span>
              </label>
              <select ref={pageRef} id="page" defaultValue="home" className={inputStyle} required>
                {pageOptions.map((page) => (
                  <option key={page} value={page} className="capitalize">{page}</option>
                ))}
              </select>
            </div>

            {/* Visibility Dropdown */}
            <div>
              <label htmlFor="visibility" className={labelStyle}>
                <span className="inline-flex items-center gap-1">
                  <Eye size={16} /> Visibility
                </span>
              </label>
              <select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className={inputStyle}
                required
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* Video Upload & Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hero Section Video
            </label>

            {video ? (
              <div className="relative rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden group bg-black">
                <video src={URL.createObjectURL(video)} controls autoPlay muted loop className="w-full h-auto max-h-96 object-contain" />
                <div className="absolute top-2 right-2 flex gap-2 transition-opacity opacity-0 group-hover:opacity-100">
                  <label
                    htmlFor="videoUpload"
                    className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 cursor-pointer"
                    title="Change video"
                  >
                    <Replace size={18} />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
                    title="Remove video"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="videoUpload"
                className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-10 text-center transition hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <Video size={36} className="text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
                  Click to upload or drag & drop a video
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  MP4, WebM, or Ogg formats recommended
                </span>
              </label>
            )}
            <input id="videoUpload" type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!video || isUploading}
            className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Upload and Set as Hero Video</span>
            )}
          </button>
        </form>

        {/* Video List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 border-gray-300 dark:border-gray-600 mb-6">
            <h2 className="text-2xl font-bold mb-4 sm:mb-0">Uploaded Videos</h2>
            <div className="flex flex-wrap gap-2">
              {pageOptions.map((page) => (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${
                    activePage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : videos?.length > 0 ? (
            <div className="space-y-4">
              {videos.map((v) => (
                <div
                  key={v._id}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border rounded-md dark:border-gray-700"
                >
                  <div className="w-full md:w-1/3">
                    <video src={v.url} controls muted className="w-full h-auto rounded-md bg-black" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold capitalize">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {v._id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleVisibilityChange(v._id, visibility)}
                      className="flex items-center gap-2 text-sm"
                      title={`Click to make ${v.visibility === 'public' ? 'private' : 'public'}`}
                    >
                      {v.visibility === 'public' ? (
                        <ToggleRight className="h-6 w-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-500" />
                      )}
                      <span className="capitalize">{v.visibility}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
                      title="Delete video"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              No videos found for the <span className="font-semibold capitalize">{activePage}</span> page.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroVideoUpload;