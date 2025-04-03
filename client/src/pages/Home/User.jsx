import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from '../../store/slice/user/user.slice';
function User({ userdetails }) {

    const dispatch = useDispatch();
    const { selectedUser } = useSelector(state => state.userSlice)
    const {onlineUsers} = useSelector(state => state.socketSlice)
    const isUserOnline=onlineUsers?.includes(userdetails?._id)


    const handleUserClick = () => {
        dispatch(setSelectedUser(userdetails))
    }
    return (
        <div onClick={handleUserClick} className={`flex items-center gap-5 py-1 px-2 cursor-pointer hover:bg-gray-700 rounded-lg ${userdetails?._id === selectedUser?._id && 'bg-gray-600'}`}>
            <div className={`avatar ${isUserOnline && 'avatar-online'}`}>
                <div className="w-12 rounded-full">
                    <img src={userdetails?.avatar} />
                </div>
            </div>
            <div>
                <h2 className='line-clamp-1'>{userdetails?.fullname}</h2>
                <p className='text-xs'>{userdetails?.username}</p>
            </div>
        </div>
    )
}

export default User