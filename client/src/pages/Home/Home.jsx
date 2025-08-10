import React, { useEffect } from 'react'
import UserSidebar from './Usersidebar'
import MessageContainer from './MessageContainer'
import { toast } from "react-hot-toast";

// import io from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { initializeSocket, setOnlineUsers } from '../../store/slice/socket/socket.slice.js'
import { setNewMessage,clearMessagesWithUser } from '../../store/slice/message/message.slice.js'


function Home() {
  const dispatch=useDispatch();
  const {isAuthenticated,userprofile}=useSelector(state=>state.userSlice)
  const {socket}=useSelector(state=>state.socketSlice)


  useEffect(()=>{
    if(isAuthenticated)
    {
      dispatch(initializeSocket(userprofile?.profile?._id))
    }
  },[isAuthenticated]);

  useEffect(()=>{
    if(!socket) return;
    socket.on('onlineUsers', (onlineusers) => {
        dispatch(setOnlineUsers(onlineusers))
    });

    socket.on('newMessage', (newmessage) => {
      dispatch(setNewMessage(newmessage)) 

    });

    socket.on('chatCleared', () => {
      dispatch(clearMessagesWithUser()); 

      toast.success('Chat cleared', {
            duration: 1000,
            style: { background: '#333', color: '#fff' }
        });
    });



    return () => {
      socket.off('onlineUsers');
      socket.off('newMessage');
      socket.off('chatCleared'); 
      socket.close();
    }
  },[socket])
  



  return (
    <div className='flex gap-1 '>
      <UserSidebar/>
      <MessageContainer/>
    </div>
  )
}

export default Home