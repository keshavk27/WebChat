import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getAdminProfileThunk, logoutAdminThunk } from '../../store/slice/admin/admin.thunk.js';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { adminProfile, screenLoading, isAdminAuthenticated } = useSelector(state => state.adminSlice);

  const [usernameToDelete, setUsernameToDelete] = useState('');
  const [convUser1, setConvUser1] = useState('');
  const [convUser2, setConvUser2] = useState('');

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/adminlogin');
    }
  }, [isAdminAuthenticated, navigate]);

  useEffect(() => {
    dispatch(getAdminProfileThunk());
    // console.log(adminProfile)
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutAdminThunk());
    navigate('/adminlogin');
  };

  const handleDeleteUser = async () => {
    await dispatch(deleteUserByAdminThunk({ username: usernameToDelete }));
  };

  const handleDeleteConversations = async () => {
    await dispatch(deleteUserConversationsOnlyThunk({ username: usernameToDelete }));
  };

  const handleDeleteChatBetweenUsers = async () => {
    await dispatch(deleteChatBetweenUsersThunk({ username1: convUser1, username2: convUser2 }));
  };

  if (screenLoading) return <div className="text-white p-4">Loading admin data...</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="btn btn-outline btn-error"
        >
          Logout
        </button>
      </div>

      {adminProfile && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">Admin Info</h2>
          <div className="flex justify-center mb-4">
          <img
            src={adminProfile?.adminprofile?.avatar ||'/default-avatar.png'} // fallback image
            alt="Admin Avatar"
            className="w-24 h-24 rounded-full border-2 border-gray-500 object-cover"
          />
        </div>
          <p><strong>Fullname:</strong> {adminProfile?.adminprofile?.fullname}</p>
          <p><strong>Username:</strong> {adminProfile?.adminprofile?.username}</p>
          <p><strong>Gender:</strong> {adminProfile?.adminprofile?.gender}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Delete Entire User Account</h2>
          <input
            type="text"
            value={usernameToDelete}
            onChange={(e) => setUsernameToDelete(e.target.value)}
            placeholder="Enter username"
            className="input input-bordered w-full mb-2 text-black"
          />
          <button onClick={handleDeleteUser} className="btn btn-error w-full">Delete User Account</button>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Delete User Conversations Only</h2>
          <input
            type="text"
            value={usernameToDelete}
            onChange={(e) => setUsernameToDelete(e.target.value)}
            placeholder="Enter username"
            className="input input-bordered w-full mb-2 text-black"
          />
          <button onClick={handleDeleteConversations} className="btn btn-warning w-full">Delete Conversations</button>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Delete Chat Between Two Users</h2>
          <input
            type="text"
            value={convUser1}
            onChange={(e) => setConvUser1(e.target.value)}
            placeholder="Username 1"
            className="input input-bordered w-full mb-2 text-black"
          />
          <input
            type="text"
            value={convUser2}
            onChange={(e) => setConvUser2(e.target.value)}
            placeholder="Username 2"
            className="input input-bordered w-full mb-2 text-black"
          />
          <button onClick={handleDeleteChatBetweenUsers} className="btn btn-error w-full">Delete Chat</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
