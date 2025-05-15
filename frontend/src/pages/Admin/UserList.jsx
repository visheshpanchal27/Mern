import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import Massage from "../../components/Massage";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted");
      } catch (error) {
        toast.error(error.data.message || error.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
      toast.success("User updated");
    } catch (error) {
      toast.error(error.data.message || error.error);
    }
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">User List</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Massage variant="danger">
          {error?.data?.message || error.message}
        </Massage>
      ) : (
        <div className="flex flex-col md:flex-row">
          <AdminMenu />

          <div className="w-full md:w-4/5 p-4">
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full text-sm text-left table-auto border border-gray-700">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-700">ID</th>
                    <th className="px-4 py-3 border-b border-gray-700">Name</th>
                    <th className="px-4 py-3 border-b border-gray-700">Email</th>
                    <th className="px-4 py-3 border-b border-gray-700">Admin</th>
                    <th className="px-4 py-3 border-b border-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-800 transition">
                      <td className="px-4 py-3">{user._id}</td>

                      {/* Username Field */}
                      <td className="px-4 py-3">
                        {editableUserId === user._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editableUserName}
                              onChange={(e) => setEditableUserName(e.target.value)}
                              className="p-2 rounded bg-gray-900 border border-gray-600 text-white w-full"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="bg-green-600 hover:bg-green-700 p-2 rounded"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {user.username}
                            <button
                              onClick={() =>
                                toggleEdit(user._id, user.username, user.email)
                              }
                              className="text-blue-400 hover:text-blue-600"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Email Field */}
                      <td className="px-4 py-3">
                        {editableUserId === user._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editableUserEmail}
                              onChange={(e) => setEditableUserEmail(e.target.value)}
                              className="p-2 rounded bg-gray-900 border border-gray-600 text-white w-full"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="bg-green-600 hover:bg-green-700 p-2 rounded"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {user.email}
                            <button
                              onClick={() =>
                                toggleEdit(user._id, user.username, user.email)
                              }
                              className="text-blue-400 hover:text-blue-600"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Admin Icon */}
                      <td className="px-4 py-3 text-center">
                        {user.isAdmin ? (
                          <FaCheck className="text-green-500 mx-auto" />
                        ) : (
                          <FaTimes className="text-red-500 mx-auto" />
                        )}
                      </td>

                      {/* Delete Button */}
                      <td className="px-4 py-3 text-center">
                        {!user.isAdmin && (
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="bg-red-600 hover:bg-red-700 p-2 rounded text-white"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
