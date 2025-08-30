import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { FaUser, FaEnvelope, FaLock, FaShoppingBag, FaEdit } from "react-icons/fa";

const Profile = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { userInfo } = useSelector((state) => state.auth);

    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

    useEffect(() => {
        setUsername(userInfo.username);
        setEmail(userInfo.email);
    }, [userInfo]);

    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return; // Stops further execution
        }

        try {
            const res = await updateProfile({
                _id: userInfo._id,
                username,
                email,
                password,
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4 py-8">
            <div className="container mx-auto max-w-4xl">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500">
                            <div className="relative mb-6">
                                <div className="w-24 h-24 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                    <FaUser className="text-white text-3xl" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800 flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">{userInfo?.username}</h3>
                            <p className="text-gray-300 mb-4 break-all">{userInfo?.email}</p>
                            <div className="bg-gray-700/30 rounded-xl p-3 mb-4">
                                <p className="text-sm text-gray-400">Member since</p>
                                <p className="text-white font-semibold">{new Date(userInfo?.createdAt).getFullYear() || '2024'}</p>
                            </div>
                            <div className="flex justify-center gap-2">
                                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Update Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <FaEdit className="text-pink-500 text-xl" />
                                <h2 className="text-2xl font-bold text-white">Update Profile</h2>
                            </div>
                            
                            <form onSubmit={submitHandler} className="space-y-6">
                                <div className="relative">
                                    <div className="absolute left-4 top-4 z-10">
                                        <FaUser className="text-pink-500" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-700/30 border border-gray-600/50 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 focus:bg-gray-700/50 transition-all duration-300 hover:border-gray-500"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <label className="absolute left-12 -top-2 bg-gray-800 px-2 text-xs text-pink-400 font-medium">Name</label>
                                </div>
                                
                                <div className="relative">
                                    <div className="absolute left-4 top-4 z-10">
                                        <FaEnvelope className="text-pink-500" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-700/30 border border-gray-600/50 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 focus:bg-gray-700/50 transition-all duration-300 hover:border-gray-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label className="absolute left-12 -top-2 bg-gray-800 px-2 text-xs text-pink-400 font-medium">Email</label>
                                </div>
                                
                                <div className="relative">
                                    <div className="absolute left-4 top-4 z-10">
                                        <FaLock className="text-pink-500" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Leave blank to keep current"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-700/30 border border-gray-600/50 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 focus:bg-gray-700/50 transition-all duration-300 hover:border-gray-500"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <label className="absolute left-12 -top-2 bg-gray-800 px-2 text-xs text-pink-400 font-medium">New Password</label>
                                </div>
                                
                                <div className="relative">
                                    <div className="absolute left-4 top-4 z-10">
                                        <FaLock className="text-pink-500" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Confirm your new password"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-700/30 border border-gray-600/50 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 focus:bg-gray-700/50 transition-all duration-300 hover:border-gray-500"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <label className="absolute left-12 -top-2 bg-gray-800 px-2 text-xs text-pink-400 font-medium">Confirm Password</label>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loadingUpdateProfile}
                                    >
                                        {loadingUpdateProfile ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                                Updating...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <FaEdit />
                                                Update Profile
                                            </div>
                                        )}
                                    </button>
                                    
                                    <Link
                                        to="/user-orders"
                                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-center flex items-center justify-center gap-2"
                                    >
                                        <FaShoppingBag />
                                        My Orders
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
