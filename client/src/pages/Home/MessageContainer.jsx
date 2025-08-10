import React, { useEffect } from 'react'
import User from './User'
import Message from './Message'
import { useDispatch, useSelector } from 'react-redux';
import { getMessageThunk, clearChatThunk } from '../../store/slice/message/message.thunk';
import Sendmessage from './Sendmessage';
import UserProfile from './UserProfile';
import { useState } from 'react';
function MessageContainer() {
    const { selectedUser, selectedPage } = useSelector(state => state.userSlice)
    const { messages } = useSelector(state => state.messageSlice)
    const dispatch = useDispatch();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (selectedUser?._id && selectedPage === 'chat') {
            dispatch(getMessageThunk({ recieverId: selectedUser?._id }));
        }

    }, [selectedUser, selectedPage, dispatch]);

    const handleClearChat = () => {
        if (selectedUser?._id) {
            dispatch(clearChatThunk({ receiverId: selectedUser._id }));
        }
        setDropdownOpen(false);
    };

    if (selectedPage === 'profile') {
        return <UserProfile />;
    }
    return (
        <>
            {!selectedUser ? (
                <>
                    <div className='w-full h-screen flex flex-col items-center justify-center text-4xl font-semibold' >
                        Welcome to WebChat
                        <p className='flex items-center text-lg mt-2 text-gray-500 '>Copyright@kk2025</p>
                    </div>

                </>
            ) : (
                <div className="w-full h-screen flex flex-col">

                    <div className='border-b border-b-white/25 px-3 py-1 flex items-center justify-between'>
                        <div className="flex-1">
                            <User userdetails={selectedUser} />
                        </div>

                        <div className="relative">
                            <button
                                className="p-2 hover:bg-gray-700 rounded-full"
                                onClick={() => setDropdownOpen(prev => !prev)}
                            >
                                ⋮
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                                    <button
                                        onClick={handleClearChat}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Clear Chat
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {messages?.map(mssgDetails => {
                            return (
                                <Message key={mssgDetails?._id} mssgDetails={mssgDetails} />
                            )
                        })}

                    </div>
                    <Sendmessage />

                </div>
            )}
        </>
    )
}

export default MessageContainer