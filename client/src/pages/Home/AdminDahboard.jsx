import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getAllUsersThunk, getAdminProfileThunk, logoutAdminThunk, deleteUserByAdminThunk, deleteUserConversationsOnlyThunk, deleteChatBetweenUsersThunk } from '../../store/slice/admin/admin.thunk.js';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { adminProfile, screenLoading, isAdminAuthenticated, users } = useSelector(state => state.adminSlice);
  const [deleteUserAccount, setDeleteUserAccount] = useState('');
  const [deleteUserConversations, setDeleteUserConversations] = useState('');
  const [convUser1, setConvUser1] = useState('');
  const [convUser2, setConvUser2] = useState('');

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/adminlogin');
    }
  }, [isAdminAuthenticated, navigate]);

  useEffect(() => {
    dispatch(getAdminProfileThunk());
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutAdminThunk());
    navigate('/adminlogin');
  };

  const handleDeleteUser = async () => {
    await dispatch(deleteUserByAdminThunk({ username: deleteUserAccount }));
    dispatch(getAllUsersThunk());
    setDeleteUserAccount("")
  };

  const handleDeleteConversations = async () => {
    await dispatch(deleteUserConversationsOnlyThunk({ username: deleteUserConversations }));
    setDeleteUserConversations("")
  };

  const handleDeleteChatBetweenUsers = async () => {
    await dispatch(deleteChatBetweenUsersThunk({ username1: convUser1, username2: convUser2 }));
    setConvUser1("");
    setConvUser2("");
  };

  //Graph section
  const createUserRegistrationChart = useCallback(() => {
    const canvas = document.getElementById('userRegistrationChart');
    if (!canvas || !users || users.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const currentYear = new Date().getFullYear();
      const yearCounts = {};

      for (let year = 2024; year <= currentYear; year++) {
        yearCounts[year] = 0;
      }

      users.forEach(user => {
        if (user.createdAt) {
          const userYear = new Date(user.createdAt).getFullYear();
          if (yearCounts.hasOwnProperty(userYear)) {
            yearCounts[userYear]++;
          }
        }
      });

      const years = Object.keys(yearCounts);
      const counts = Object.values(yearCounts);
      const maxCount = Math.max(...counts, 1);

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const padding = 40;
      const chartWidth = canvas.width - (padding * 2);
      const chartHeight = canvas.height - (padding * 2);

      if (chartWidth <= 0 || chartHeight <= 0) return;

      const barWidth = Math.max(chartWidth / years.length * 0.6, 20);
      const barSpacing = (chartWidth - (barWidth * years.length)) / Math.max(years.length - 1, 1);

      years.forEach((year, index) => {
        const barHeight = (counts[index] / maxCount) * chartHeight;
        const x = padding + (index * (barWidth + barSpacing));
        const y = canvas.height - padding - barHeight;

        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(year, x + barWidth / 2, canvas.height - 10);

        if (barHeight > 20) {
          ctx.fillText(counts[index].toString(), x + barWidth / 2, y - 5);
        }
      });

      ctx.save();
      ctx.translate(15, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Users', 0, 0);
      ctx.restore();
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, [users]);

  useEffect(() => {
    if (users && users.length > 0) {
      const timer = setTimeout(() => {
        createUserRegistrationChart();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [users, createUserRegistrationChart]);

  useEffect(() => {
    const handleResize = () => {
      if (users && users.length > 0) {
        setTimeout(createUserRegistrationChart, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [createUserRegistrationChart, users]);

  if (screenLoading) return <div className="text-white p-4">Loading admin data...</div>;

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="btn btn-outline btn-error btn-sm sm:btn-md"
        >
          Logout
        </button>
      </div>

      <div className="xl:grid xl:grid-cols-3 xl:gap-4 xl:h-[calc(100vh-8rem)] space-y-4 xl:space-y-0">

        <div className="xl:col-span-2 xl:flex xl:flex-col xl:h-full xl:min-h-0">
          <div className="xl:flex-1 xl:overflow-y-auto space-y-4 xl:pr-1">

            {adminProfile && (
              <div className="bg-gray-800 p-4 rounded-lg xl:flex-shrink-0">
                <h2 className="text-lg font-semibold mb-3">Admin Info</h2>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={adminProfile?.adminprofile?.avatar || '/default-avatar.png'}
                      alt="Admin Avatar"
                      className="w-20 h-20 rounded-full border-2 border-gray-500 object-cover"
                    />
                  </div>
                  <div className="space-y-1 text-sm text-center sm:text-left flex-1">
                    <p><strong>Fullname:</strong> {adminProfile?.adminprofile?.fullname}</p>
                    <p><strong>Username:</strong> {adminProfile?.adminprofile?.username}</p>
                    <p><strong>Email:</strong> {adminProfile?.adminprofile?.email}</p>
                    <p><strong>Gender:</strong> {adminProfile?.adminprofile?.gender}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-800 p-4 rounded-lg xl:flex-shrink-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                <div>
                  <h2 className="text-lg font-semibold mb-3">Admin Actions</h2>
                  <div className="space-y-3">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <h3 className="text-xs font-bold mb-2">Delete Entire User Account</h3>
                      <input
                        type="text"
                        value={deleteUserAccount}
                        onChange={(e) => setDeleteUserAccount(e.target.value)}
                        placeholder="Enter username"
                        className="input input-bordered w-full mb-2 text-black text-xs h-7"
                      />
                      <button onClick={handleDeleteUser} className="btn btn-error w-full btn-xs text-xs">
                        Delete User Account
                      </button>
                    </div>

                    <div className="bg-gray-700 p-3 rounded-lg">
                      <h3 className="text-xs font-bold mb-2">Delete User Conversations Only</h3>
                      <input
                        type="text"
                        value={deleteUserConversations}
                        onChange={(e) => setDeleteUserConversations(e.target.value)}
                        placeholder="Enter username"
                        className="input input-bordered w-full mb-2 text-black text-xs h-7"
                      />
                      <button onClick={handleDeleteConversations} className="btn btn-warning w-full btn-xs text-xs">
                        Delete Conversations
                      </button>
                    </div>

                    <div className="bg-gray-700 p-3 rounded-lg">
                      <h3 className="text-xs font-bold mb-2">Delete Chat Between Two Users</h3>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={convUser1}
                          onChange={(e) => setConvUser1(e.target.value)}
                          placeholder="Username 1"
                          className="input input-bordered w-full text-black text-xs h-7"
                        />
                        <input
                          type="text"
                          value={convUser2}
                          onChange={(e) => setConvUser2(e.target.value)}
                          placeholder="Username 2"
                          className="input input-bordered w-full text-black text-xs h-7"
                        />
                      </div>
                      <button onClick={handleDeleteChatBetweenUsers} className="btn btn-error w-full btn-xs text-xs mt-2">
                        Delete Chat
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-3">User Registration Trends</h2>
                  <div className="bg-gray-700 p-3 rounded-lg" style={{ height: '390px' }}>
                    <canvas
                      id="userRegistrationChart"
                      className="w-full h-full"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:flex xl:flex-col xl:h-full xl:min-h-0 space-y-4 xl:space-y-0">

          <div className="bg-gray-800 p-4 rounded-lg xl:flex-shrink-0 xl:mb-4">
            <h2 className="text-lg font-semibold mb-3">User Statistics</h2>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {users?.length || 0}
              </div>
              <p className="text-gray-300 text-sm">Total Users</p>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg xl:flex-1 xl:flex xl:flex-col xl:min-h-0">
            <h2 className="text-lg font-semibold mb-3 xl:flex-shrink-0">Users List</h2>

            <div className="xl:flex-1 xl:overflow-y-auto xl:min-h-0">
              <div className="space-y-2 xl:pr-2">
                {users?.map((user) => (
                  <div key={user.id} className="bg-gray-700 p-3 rounded-lg hover:bg-gray-650 transition-colors xl:flex-shrink-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <img
                        src={user.avatar || '/default-avatar.png'}
                        alt={`${user.fullname}'s avatar`}
                        className="w-10 h-10 rounded-full border border-gray-500 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {user.fullname}
                        </h4>
                        <p className="text-xs text-gray-400 truncate">
                          Usename: {user.username}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-300 truncate">
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p className="text-xs text-gray-300 truncate">
                        <strong>Gender: </strong> {user.gender}
                      </p>
                      <p className="text-xs text-gray-400">
                        <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}

                {(!users || users.length === 0) && (
                  <div className="text-center text-gray-400 py-8">
                    No users found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
