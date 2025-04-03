import React, { useEffect } from 'react'
import UserSidebar from './Usersidebar'
import MessageContainer from './MessageContainer'
// import io from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { initializeSocket, setOnlineUsers } from '../../store/slice/socket/socket.slice.js'
import { setNewMessage } from '../../store/slice/message/message.slice.js'


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

    return () => {
        socket.close()
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