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
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-black via-zinc-900 to-black text-white font-sans">
      <h1 className="text-4xl font-bold text-center mb-10 text-pink-600 drop-shadow-md">
        Manage Users
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

          <div className="w-full md:w-4/5 p-6 bg-black/60 backdrop-blur-lg rounded-2xl shadow-2xl border border-pink-600">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-pink-600 scrollbar-track-black/20">
              <table className="min-w-full text-sm border-separate border-spacing-y-2">
                <thead className="bg-pink-600 text-white rounded">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-center">Admin</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="bg-black/50 hover:bg-black/70 transition rounded-lg shadow-sm"
                    >
                      <td className="px-4 py-3 rounded-l-lg">{user._id}</td>

                      <td className="px-4 py-3">
                        {editableUserId === user._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editableUserName}
                              onChange={(e) =>
                                setEditableUserName(e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-md bg-black border border-pink-600 text-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-600"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="p-2 rounded-md bg-pink-600 text-white hover:bg-pink-700 transition"
                              aria-label="Save name"
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
                              className="text-pink-500 hover:text-pink-700 transition"
                              aria-label="Edit name"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {editableUserId === user._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editableUserEmail}
                              onChange={(e) =>
                                setEditableUserEmail(e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-md bg-black border border-pink-600 text-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-600"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="p-2 rounded-md bg-pink-600 text-white hover:bg-pink-700 transition"
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
                              className="text-pink-500 hover:text-pink-700 transition"
                              aria-label="Edit email"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {user.isAdmin ? (
                          <FaCheck className="text-pink-500 mx-auto" />
                        ) : (
                          <FaTimes className="text-red-500 mx-auto" />
                        )}
                      </td>

                      <td className="px-4 py-3 text-center rounded-r-lg">
                        {!user.isAdmin && (
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="p-2 rounded-md bg-pink-600 text-white hover:bg-pink-700 transition"
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
