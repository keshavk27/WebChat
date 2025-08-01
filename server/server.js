import dotenv from 'dotenv';
dotenv.config();

import {app,server} from './socket/socket.js'

import express from 'express'
import userRouter from './routes/user.route.js';
import messageRouter from './routes/message.route.js';
import adminRouter from './routes/admin.route.js';
import { connectDB } from './db/connection1.db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


connectDB()
app.use(cors({
    origin: process.env.CLIENT_URL, 
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT || 3000;

//routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/message', messageRouter)
app.use('/api/v1/user/admin',adminRouter)
//middleware
import { errorMiddleware } from './middleware/error.middleware.js'
app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send("hello world");
})


server.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`);
})