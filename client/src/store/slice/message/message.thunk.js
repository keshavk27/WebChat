import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../components/utilities/axiosInstance";


export const sendMessageThunk = createAsyncThunk("message/send", async ({ recieverId, message }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/message/send/${recieverId}`, {
            message
        })
        
        return response.data;    

    } catch (error) {
        console.error(error)

        const errorMessage = error?.response?.data?.errorMessage;
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);

    }
})


export const getMessageThunk = createAsyncThunk("message/get", async ({ recieverId }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/message/getmessage/${recieverId}`)
        
        return response.data;    

    } catch (error) {
        console.error(error)

        const errorMessage = error?.response?.data?.errorMessage;
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);

    }
})
