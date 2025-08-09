import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getProfileThunk,updateFullnameThunk,changePasswordThunk,updateAvatarThunk,} from "../../store/slice/user/user.thunk.js";
import { FaCamera } from "react-icons/fa";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userprofile, screenLoading } = useSelector((state) => state.userSlice);

  const [fullname, setFullname] = useState("");
  const [currentPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  const handleFullnameUpdate = async () => {
    if (!fullname.trim()) return;
    await dispatch(updateFullnameThunk( fullname ));
    setFullname("");
    dispatch(getProfileThunk());
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) return;
    await dispatch(changePasswordThunk({ currentPassword, newPassword }));
    setOldPassword("");
    setNewPassword("");
    dispatch(getProfileThunk());
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await dispatch(updateAvatarThunk(file));
    dispatch(getProfileThunk());
  };

  if (screenLoading) {
    return <div className="text-white p-4">Loading profile...</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {/* User Detail Card */}
      <div className="bg-gray-800 p-4 rounded-lg flex items-center relative">
        {/* Avatar Container */}
        <div className="relative w-28 h-28">
          <img
            src={userprofile?.profile?.avatar || "/default-avatar.png"}
            alt="Profile Avatar"
            className="w-28 h-28 rounded-full border-2 border-gray-500 object-cover"
          />
          {/* Edit Icon */}
          <label
            htmlFor="avatarUpload"
            className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer 
                       hover:bg-blue-700 transform hover:scale-110 transition-all duration-300 shadow-lg"
          >
            <FaCamera size={16} />
          </label>
          <input
            type="file"
            id="avatarUpload"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>

        {/* User Info */}
        <div className="ml-6">
          <h2 className="text-xl font-bold">{userprofile?.profile?.fullname || "No Name"}</h2>
          <p className="text-gray-300">Username: {userprofile?.profile?.username}</p>
          <p className="text-gray-300">
            Gender: {userprofile?.profile?.gender || "Not specified"}
          </p>
        </div>
      </div>

      {/* User Action Card */}
      <div className="bg-gray-800 p-4 rounded-lg mt-6 space-y-6">
        {/* Fullname Update */}
        <div>
          <h2 className="text-lg font-bold mb-2">Update Fullname</h2>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="input input-bordered w-full mb-2 text-black"
          />
          <button
            onClick={handleFullnameUpdate}
            className="btn btn-primary w-full"
          >
            Save Fullname
          </button>
        </div>

        {/* Change Password */}
        <div>
          <h2 className="text-lg font-bold mb-2">Change Password</h2>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Old Password"
            className="input input-bordered w-full mb-2 text-black"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="input input-bordered w-full mb-2 text-black"
          />
          <button
            onClick={handlePasswordChange}
            className="btn btn-warning w-full"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
