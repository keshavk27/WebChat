import { createSlice } from '@reduxjs/toolkit'
import { getOtherUsersThunk, getProfileThunk, loginUserThunk, logoutUserThunk, registerUserThunk } from './user.thunk'

const initialState = {
    isAuthenticated: false,
    screenLoading: true,
    userprofile: null,
    buttonLoading: false,
    otherUsers: null,
    selectedUser: JSON.parse(localStorage.getItem("selectedUser")) || null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
            localStorage.setItem("selectedUser", JSON.stringify(action.payload));

        }

    },
    extraReducers: (builder) => {
        //loginuserthunk
        builder.addCase(loginUserThunk.pending, (state, action) => {
            console.log("login pending")
            state.buttonLoading = true
        });
        builder.addCase(loginUserThunk.fulfilled, (state, action) => {
            console.log("login fullfilled")
            state.userprofile = action.payload?.responseData?.user     //loginuserhtunk se return hone wali cheez payload me ayegi
            state.buttonLoading = false
            state.isAuthenticated = true
        });
        builder.addCase(loginUserThunk.rejected, (state, action) => {
            console.log("login rejected")
            state.buttonLoading = false
        });


        //registeruserthunk
        builder.addCase(registerUserThunk.pending, (state, action) => {
            console.log("register pending")
            state.buttonLoading = true
        });
        builder.addCase(registerUserThunk.fulfilled, (state, action) => {

            console.log("register fullfilled")
            state.userprofile = action.payload?.responseData?.user     //registeruserthunk se return hone wali cheez payload me ayegi
            state.buttonLoading = false
            state.isAuthenticated = true
        });
        builder.addCase(registerUserThunk.rejected, (state, action) => {
            console.log("register rejected")
            state.buttonLoading = false
        });

        //logoutuser
        builder.addCase(logoutUserThunk.pending, (state, action) => {
            console.log("logout pending")
            state.buttonLoading = true
        });
        builder.addCase(logoutUserThunk.fulfilled, (state, action) => {

            console.log("logout fullfilled")
            localStorage.clear()
            state.userprofile = null
            state.buttonLoading = false
            state.selectedUser = null
            state.isAuthenticated = false
            state.otherUsers = null
        });
        builder.addCase(logoutUserThunk.rejected, (state, action) => {
            console.log("logout rejected")
            state.buttonLoading = false
        });

        //getprofile
        builder.addCase(getProfileThunk.pending, (state, action) => {
            console.log("profilegetting pending")
        });
        builder.addCase(getProfileThunk.fulfilled, (state, action) => {
            console.log("get profile done")
            state.screenLoading = false
            state.isAuthenticated = true
            state.userprofile = action.payload?.responseData    //getprofilethunk se return hone wali cheez payload me ayegi
            console.log(action.payload?.responseData)
        });
        builder.addCase(getProfileThunk.rejected, (state, action) => {
            console.log("profile not got")
            state.screenLoading = false
        });


        //getotherusers
        builder.addCase(getOtherUsersThunk.pending, (state, action) => {
            console.log("otheruserprofile pending")
            state.screenLoading = true;
        });
        builder.addCase(getOtherUsersThunk.fulfilled, (state, action) => {
            console.log("otheruserprofile fetched")
            state.screenLoading = false
            state.otherUsers = action.payload?.responseData?.otheruser
            //getotherusersthunk se return hone wali cheez payload me ayegi   // user.js file me responseData key me data hai
        });
        builder.addCase(getOtherUsersThunk.rejected, (state, action) => {
            console.log("otheruserprofile not got")
            state.screenLoading = false
        });

    },


})

export const { setSelectedUser } = userSlice.actions

export default userSlice.reducer