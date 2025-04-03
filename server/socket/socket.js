import dotenv from 'dotenv';
dotenv.config();
import { Server } from 'socket.io'
import http from 'http'
import express from 'express'


const app = express();
const server=http.createServer(app);


const ioServer=new Server(server,{
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});

const userSocketMap={
    // userId:socketId
    
}
ioServer.on('connection',(socket) => {
    const userId = socket.handshake.query.userId;
    if(!userId)
    {        
        return;
    }
    userSocketMap[userId] = socket.id;
    // console.log(Object.keys(userSocketMap))
    ioServer.emit('onlineUsers',Object.keys(userSocketMap));

    socket.on('disconnect',()=>{
        delete userSocketMap[userId];
        ioServer.emit('onlineUsers',Object.keys(userSocketMap));
    })
})

const getSocketId=(userId)=>{
    return userSocketMap[userId];
}

export {ioServer,server,app,getSocketId}