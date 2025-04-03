import React from 'react'
import { FiSend } from "react-icons/fi";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageThunk } from '../../store/slice/message/message.thunk';
function Sendmessage() {
    const [message, setmessage] = useState("");
    const dispatch = useDispatch();
    const {selectedUser}=useSelector(state => state.userSlice)

    const handleSendMessage = () =>{
        if (!message.trim()) return;
        dispatch(sendMessageThunk({recieverId:selectedUser?._id,message}));
        setmessage("")

    }
    return (
        <div className='w-full p-2 flex gap-0.5'>
            <input value={message} onChange={(e) => setmessage(e.target.value)} type="text" placeholder="Type here..." class="input input-bordered w-full " />
            <button onClick={handleSendMessage} className="btn btn-square mb-0.5">
                <FiSend />
            </button>
        </div>
    )
}

export default Sendmessage