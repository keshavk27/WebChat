import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../components/utilities/axiosInstance"; 


export const loginUserThunk = createAsyncThunk("user/login", async ({ username, password }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/user/login', {
            username,
            password
        })
        
        toast.success("Login successful")
        return response.data;     //ye data fullfilled hone k baad payload me jayegi

    } catch (error) {
        console.error(error)

        const errorMessage = error?.response?.data?.errorMessage;
        // console.log(errorMessage)
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);

    }
})

export const registerUserThunk = createAsyncThunk("user/register", async ({ fullname,username, password,gender }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/user/register', {
            fullname,
            username,
            password,
            gender
        })
    
        toast.success("Account created successfully")
        return response.data;     //ye data fullfilled hone k baad payload me jayegi

    } catch (error) {
        console.error(error)

        const errorMessage = error?.response?.data?.errorMessage;
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);

    }
})

export const logoutUserThunk = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/user/logout')
        
        toast.success("Logged out")
        return response.data;     //ye data fullfilled hone k baad payload me jayegi

    } catch (error) {
        console.error(error)

        const errorMessage = error?.response?.data?.errorMessage;
        // console.log(errorMessage)
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);

    }
})


export const getProfileThunk = createAsyncThunk("user/getprofile", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/user/getprofile')
        return response.data;     

    } catch (error) {
        console.error("error")

        const errorMessage = error?.response?.data?.errorMessage;
        return rejectWithValue(errorMessage);

    }
})



export const getOtherUsersThunk = createAsyncThunk("user/getotheruser", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/user/getotheruser')
        return response.data;     

    } catch (error) {
        console.error("error")

        const errorMessage = error?.response?.data?.errorMessage;
        return rejectWithValue(errorMessage);

    }
})
