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
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] text-white font-sans">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
          User Management
        </h1>
        <p className="text-gray-400">Manage user accounts and permissions</p>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Massage variant="danger">
          {error?.data?.message || error.message}
        </Massage>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-blue-400 text-sm font-medium">Total Users</h3>
              <p className="text-2xl font-bold text-white mt-2">{users?.length || 0}</p>
            </div>
            <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-green-400 text-sm font-medium">Admin Users</h3>
              <p className="text-2xl font-bold text-white mt-2">{users?.filter(u => u.isAdmin).length || 0}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-purple-400 text-sm font-medium">Regular Users</h3>
              <p className="text-2xl font-bold text-white mt-2">{users?.filter(u => !u.isAdmin).length || 0}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">

          <div className="w-full md:w-4/5 p-6 bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-2xl shadow-2xl border border-gray-800/50">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-pink-600 scrollbar-track-black/20">
              <table className="min-w-full text-sm border-separate border-spacing-y-2">
                <thead className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded">
                  <tr>
                    <th className="px-4 py-3 text-left rounded-l-lg">User</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-center">Role</th>
                    <th className="px-4 py-3 text-center">Joined</th>
                    <th className="px-4 py-3 text-center rounded-r-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...users]
                    .sort((a, b) => {
                      if (b.isAdmin !== a.isAdmin) {
                        return b.isAdmin - a.isAdmin; // Admins first
                      }
                      return new Date(b.createdAt) - new Date(a.createdAt); // Latest users first within group
                    })
                    .map((user) => (
                    <tr
                      key={user._id}
                      className="bg-black/50 hover:bg-black/70 transition rounded-lg shadow-sm"
                    >
                      <td className="px-4 py-3 rounded-l-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.username?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            {editableUserId === user._id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editableUserName}
                                  onChange={(e) => setEditableUserName(e.target.value)}
                                  className="px-3 py-1 rounded-md bg-black border border-pink-600 text-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-600"
                                />
                                <button
                                  onClick={() => updateHandler(user._id)}
                                  className="p-1 rounded-md bg-pink-600 text-white hover:bg-pink-700 transition"
                                >
                                  <FaCheck size={12} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div>
                                  <p className="font-medium text-white">{user.username}</p>
                                  <p className="text-xs text-gray-400">ID: {user._id.slice(-6)}</p>
                                </div>
                                <button
                                  onClick={() => toggleEdit(user._id, user.username, user.email)}
                                  className="text-pink-500 hover:text-pink-700 transition"
                                >
                                  <FaEdit size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
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
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center gap-1 w-fit mx-auto">
                            <FaCheck size={10} /> Admin
                          </span>
                        ) : (
                          <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-xs font-medium">User</span>
                        )}
                      </td>
                      
                      <td className="px-4 py-3 text-center">
                        <span className="text-gray-400 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center rounded-r-lg">
                        {!user.isAdmin && (
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="p-2 rounded-md bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition border border-red-600/30"
                            aria-label="Delete user"
                          >
                            <FaTrash size={12} />
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
        </>
      )}
    </div>
  );
};

export default UserList;
