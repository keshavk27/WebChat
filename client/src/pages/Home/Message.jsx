import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

function Message({ mssgDetails }) {
    const mssgref=useRef(null)
    const { selectedUser } = useSelector(state => state.userSlice)
    const sendertime=mssgDetails?.createdAt;
    const formattedTime = new Date(sendertime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const {userprofile}=useSelector(state=>state.userSlice)
    
    useEffect(()=>{
        if(mssgref.current){
            mssgref.current.scrollIntoView({ behavior: "smooth" });
        }
    })

    return (
        <div ref={mssgref} className={`chat  ${userprofile?.profile?._id===mssgDetails?.senderId ? 'chat-end': 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img
                        alt="Tailwind CSS chat bubble component"
                        src={selectedUser?.avatar} />
                </div>
            </div>
            <div className="chat-bubble">{mssgDetails?.message}</div>
            <div className="chat-footer opacity-50">
                <time className="text-xs opacity-50">{formattedTime}</time>

            </div>
        </div>
    )
}

export default Message