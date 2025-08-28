import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useProfileMutation } from "../../redux/api/usersApiSlice";

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
        <div className="container mx-auto p-3 sm:p-4 mt-16 sm:mt-20 lg:mt-24 ml-12 sm:ml-16 lg:ml-20">
            <div className="flex justify-center">
                <div className="w-full max-w-md sm:max-w-lg">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white text-center">Update Profile</h2>
                    <form onSubmit={submitHandler}>
                        <div className="mb-4">
                            <label className="block text-white mb-2 text-sm sm:text-base">Name</label>
                            <input
                                type="text"
                                placeholder="Enter name"
                                className="form-input p-3 sm:p-4 rounded-lg w-full border border-gray-500 bg-black text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-2 text-sm sm:text-base">Email</label>
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="form-input p-3 sm:p-4 rounded-lg w-full border border-gray-500 bg-black text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-2 text-sm sm:text-base">Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="form-input p-3 sm:p-4 rounded-lg w-full border border-gray-500 bg-black text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-white mb-2 text-sm sm:text-base">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className="form-input p-3 sm:p-4 rounded-lg w-full border border-gray-500 bg-black text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button
                                type="submit"
                                className="bg-pink-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-pink-600 transition-colors text-sm sm:text-base font-medium flex-1"
                                disabled={loadingUpdateProfile}
                            >
                                {loadingUpdateProfile ? 'Updating...' : 'Update Profile'}
                            </button>
                            <Link
                                to="/user-orders"
                                className="bg-pink-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-pink-700 transition-colors text-sm sm:text-base font-medium text-center flex-1"
                            >
                                My Orders
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
