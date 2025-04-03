import { createSlice } from '@reduxjs/toolkit'
import { getMessageThunk, sendMessageThunk } from './message.thunk';

const initialState = {
    buttonLoading: false,
    messages: null,
    screenLoading: false,
}

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setNewMessage: (state, action) => {
            state.messages = [...(state.messages || []), action.payload];
        }
    },
    extraReducers: (builder) => {

        //sendmessagethunk
        builder.addCase(sendMessageThunk.pending, (state, action) => {
            state.buttonLoading = true
        });
        builder.addCase(sendMessageThunk.fulfilled, (state, action) => {
            state.messages = [...state.messages, action.payload?.responseData?.newMessage];
            state.buttonLoading = false
        });
        builder.addCase(sendMessageThunk.rejected, (state, action) => {
            state.buttonLoading = false
        });

        //getmessagethunk
        builder.addCase(getMessageThunk.pending, (state, action) => {
            state.buttonLoading = true
        });
        builder.addCase(getMessageThunk.fulfilled, (state, action) => {
            state.messages = action.payload?.responseData?.conversation?.messages;
            state.buttonLoading = false
        });
        builder.addCase(getMessageThunk.rejected, (state, action) => {
            state.buttonLoading = false
        });

    },


})

export const { setNewMessage } = messageSlice.actions

export default messageSlice.reducer