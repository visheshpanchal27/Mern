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
    <div className="min-h-screen p-6 bg-black text-white font-sans">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-pink-300">
        User List
      </h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Massage variant="danger">
          {error?.data?.message || error.message}
        </Massage>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <AdminMenu />

          <div className="w-full md:w-4/5 p-6 bg-gray-900 rounded-md shadow-md border border-pink-300">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm border-collapse">
                <thead className="bg-pink-300 text-black font-semibold rounded-t-md">
                  <tr>
                    <th className="px-5 py-4 border-b border-pink-300">ID</th>
                    <th className="px-5 py-4 border-b border-pink-300">Name</th>
                    <th className="px-5 py-4 border-b border-pink-300">Email</th>
                    <th className="px-5 py-4 border-b border-pink-300 text-center">
                      Admin
                    </th>
                    <th className="px-5 py-4 border-b border-pink-300 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-800 transition-colors duration-200"
                    >
                      <td className="px-5 py-3 border-b border-gray-700">{user._id}</td>

                      <td className="px-5 py-3 border-b border-gray-700">
                        {editableUserId === user._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editableUserName}
                              onChange={(e) => setEditableUserName(e.target.value)}
                              className="w-full px-3 py-2 rounded border border-pink-300 bg-black text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="p-2 rounded bg-pink-300 text-black hover:bg-pink-400 transition"
                              aria-label="Save username"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{user.username}</span>
                            <button
                              onClick={() =>
                                toggleEdit(user._id, user.username, user.email)
                              }
                              className="text-pink-300 hover:text-pink-400 transition"
                              aria-label="Edit username"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-3 border-b border-gray-700">
                        {editableUserId === user._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editableUserEmail}
                              onChange={(e) => setEditableUserEmail(e.target.value)}
                              className="w-full px-3 py-2 rounded border border-pink-300 bg-black text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="p-2 rounded bg-pink-300 text-black hover:bg-pink-400 transition"
                              aria-label="Save email"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{user.email}</span>
                            <button
                              onClick={() =>
                                toggleEdit(user._id, user.username, user.email)
                              }
                              className="text-pink-300 hover:text-pink-400 transition"
                              aria-label="Edit email"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-3 border-b border-gray-700 text-center">
                        {user.isAdmin ? (
                          <FaCheck className="mx-auto text-pink-300" />
                        ) : (
                          <FaTimes className="mx-auto text-red-500" />
                        )}
                      </td>

                      <td className="px-5 py-3 border-b border-gray-700 text-center">
                        {!user.isAdmin && (
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="p-2 rounded bg-pink-300 text-black hover:bg-pink-400 transition"
                            aria-label="Delete user"
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
