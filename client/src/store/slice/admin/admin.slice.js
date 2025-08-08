
import { createSlice } from '@reduxjs/toolkit'
import {getAdminProfileThunk, loginAdminThunk,logoutAdminThunk} from './admin.thunk' 

const initialState = {
    isAdminAuthenticated: false, 
    adminProfile: null,
    buttonLoading: false,
    screenLoading: true
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        // LOGIN
        builder.addCase(loginAdminThunk.pending, (state) => {
            state.buttonLoading = true
        })
        builder.addCase(loginAdminThunk.fulfilled, (state, action) => {
            state.buttonLoading = false
            state.isAdminAuthenticated = true
            state.adminProfile = action.payload?.responseData?.loggedinAdmin
        })
        builder.addCase(loginAdminThunk.rejected, (state) => {
            state.buttonLoading = false
        })

        // LOGOUT
        builder.addCase(logoutAdminThunk.pending, (state) => {
            state.buttonLoading = true
        })
        builder.addCase(logoutAdminThunk.fulfilled, (state) => {
            state.buttonLoading = false
            state.isAdminAuthenticated = false
            state.adminProfile = null
        })
        builder.addCase(logoutAdminThunk.rejected, (state) => {
            state.buttonLoading = false
        })

        // GET ADMIN PROFILE
        builder.addCase(getAdminProfileThunk.pending, (state) => {
            state.screenLoading = true
        })
        builder.addCase(getAdminProfileThunk.fulfilled, (state, action) => {
            state.screenLoading = false
            state.isAdminAuthenticated = true
            state.adminProfile = action.payload?.responseData
        })
        builder.addCase(getAdminProfileThunk.rejected, (state) => {
            state.screenLoading = false
        })
    }
})

export default adminSlice.reducer
