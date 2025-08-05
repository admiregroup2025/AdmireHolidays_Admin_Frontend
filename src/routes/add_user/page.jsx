// AddUser.jsx
import { useState, useEffect } from "react";
import { User, Lock, Loader2, Users, Trash2 } from "lucide-react";
import { useUserStore } from "../../stores/userStore";
import ConfirmationModal from "../../components/ConfirmationModal";

const AddUser = () => {
  const {
    users,
    isLoadingUsers,
    isSubmitting,
    isDeleting,
    fetchUsers,
    addUser,
    deleteUser,
  } = useUserStore();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      // You can keep toast here or handle it in the store
      toast.error("Please fill in both username and password.");
      return;
    }
    await addUser(formData);
    setFormData({ username: "", password: "" });
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isDeleting) return;
    setUserToDelete(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    await deleteUser(userToDelete._id, userToDelete.username);
    handleCloseModal();
  };

  return (
    <>
      <div className="flex flex-col gap-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            User Management
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Add, view, and manage user accounts.
          </p>
        </div>

        {/* Add New User Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            Add New User
          </h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Username
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 size-5 text-slate-400" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-transparent py-2 pl-10 pr-3 text-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus-visible:ring-blue-600"
                  placeholder="Enter a unique username"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 size-5 text-slate-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-transparent py-2 pl-10 pr-3 text-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus-visible:ring-blue-600"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Adding User...</span>
                  </>
                ) : (
                  <span>Add User</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* User List Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <Users className="size-6 text-slate-800 dark:text-slate-200" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                    User List
                </h2>
            </div>
            <div className="mt-6 flow-root">
                <div className="-mx-6 -my-2 overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {isLoadingUsers ? (
                             <div className="flex justify-center items-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                             </div>
                        ) : users.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-50 sm:pl-0">
                                        Username
                                    </th>
                                    
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Delete</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-slate-50 sm:pl-0">
                                            {user.username}
                                        </td>
                                       
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <button onClick={() => handleDeleteClick(user)} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">
                                                <Trash2 className="h-5 w-5"/>
                                                <span className="sr-only">, {user.username}</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-sm text-slate-500 dark:text-slate-400">No users found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Confirm Deletion"
      >
        <p>
            Are you sure you want to delete the user "{userToDelete?.username}"? 
            This action cannot be undone.
        </p>
      </ConfirmationModal>
    </>
  );
};

export default AddUser;