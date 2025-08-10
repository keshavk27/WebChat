import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../components/utilities/axiosInstance";


export const sendMessageThunk = createAsyncThunk("message/send", async ({ recieverId, message,messageType = "text", fileName = "" }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/message/send/${recieverId}`, {
            message,
            messageType,
            fileName
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


export const clearChatThunk = createAsyncThunk(
    'message/clearChat',
    async ({ receiverId }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/message/clearchat/${receiverId}`);
            return res.data; 
        } catch (err) {
            return rejectWithValue(err.response?.data || { error: 'Something went wrong' });
        }
    }
);