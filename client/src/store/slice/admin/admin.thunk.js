import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from "../../../components/utilities/axiosInstance";


export const loginAdminThunk = createAsyncThunk(
    'admin/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            
            const response = await axiosInstance.post('/user/admin/login',{
                username,
                password
            });
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const logoutAdminThunk = createAsyncThunk(
    'admin/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/user/admin/adminlogout', {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const getAdminProfileThunk = createAsyncThunk(
    'admin/profile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/user/admin/adminprofile', {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);



export const deleteUserByAdminThunk = createAsyncThunk(
  'admin/deleteUserByAdmin',
  async ({ username }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/admin/deleteUser', {
         username 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 2. Delete only conversations of a user
export const deleteUserConversationsOnlyThunk = createAsyncThunk(
  'admin/deleteUserConversationsOnly',
  async ({ username }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/admin/deleteUserconversation', {
        username 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 3. Delete chat between two users
export const deleteChatBetweenUsersThunk = createAsyncThunk(
  'admin/deleteChatBetweenUsers',
  async ({ username1, username2 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/admin/deletechatbetweenUsers', {
        username1, username2 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

