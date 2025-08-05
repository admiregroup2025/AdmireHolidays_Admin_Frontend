import { useState, useEffect } from "react";
import { Users, Loader2, Trash2, ShieldX } from "lucide-react";
import { useUserStore } from "../../stores/userStore";
import ConfirmationModal from "../../components/ConfirmationModal";
import { formatToHumanDate } from "../../utils/formatToHumanDate";

const UsersList = () => {
  const { users, isLoadingUsers, isDeleting, fetchUsers, deleteUser } = useUserStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <Users className="size-6 text-slate-800 dark:text-slate-200" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              User List
            </h2>
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {users.length} {users.length === 1 ? 'user' : 'users'}
          </span>
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
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-50 sm:pl-0"
                      >
                        Username
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-50"
                      >
                        Created At
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-slate-50 sm:pl-0">
                          {user.username}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {formatToHumanDate(user.createdAt)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                            aria-label={`Delete user ${user.username}`}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16">
                  <ShieldX className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                    No Users Found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    There are currently no users in the system.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Confirm User Deletion"
      >
        <p>
          Are you sure you want to delete the user "
          <strong>{userToDelete?.username}</strong>"? This action cannot be
          undone.
        </p>
      </ConfirmationModal>
    </>
  );
};

export default UsersList;