import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slice/user/user.slice.js'
import messageSlice from './slice/message/message.slice.js'
import  socketSlice  from './slice/socket/socket.slice.js'
import adminSlice from './slice/admin/admin.slice.js'

export const store = configureStore({
    reducer: {
        userSlice,
        messageSlice,
        socketSlice,
        adminSlice

    },
    middleware: (defaultMiddleware) =>(
        defaultMiddleware({
            serializableCheck: {
                ignoredPaths: ["socketSlice.socket"]
            }
        })
    )
})