import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slice/user/user.slice.js'
import messageSlice from './slice/message/message.slice.js'
import  socketSlice  from './slice/socket/socket.slice.js'

export const store = configureStore({
    reducer: {
        userSlice,
        messageSlice,
        socketSlice

    },
    middleware: (defaultMiddleware) =>(
        defaultMiddleware({
            serializableCheck: {
                ignoredPaths: ["socketSlice.socket"]
            }
        })
    )
})