import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import User from './User';
import { useDispatch, useSelector } from 'react-redux';
import { getOtherUsersThunk, logoutUserThunk } from '../../store/slice/user/user.thunk';
import { useNavigate } from 'react-router-dom';
import { setSelectedPage } from '../../store/slice/user/user.slice.js';
function UserSidebar() {
    const [user,setuser]=useState([])
    const [searchvalue,setsearchvalue]=useState("")
    
    const { userprofile,otherUsers } = useSelector(state => state.userSlice)
    const currentuser = userprofile?.profile;


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogOut = async () => {
        const response = await dispatch(logoutUserThunk())
        if (response?.payload?.success) {
            navigate('/login')

        }

    }
    useEffect(()=>{
        if(!searchvalue) {
            setuser(otherUsers);
        }
        else{
            setuser(otherUsers.filter((user)=>{
                return user.username.toLowerCase().includes(searchvalue.toLowerCase())||
                user.fullname.toLowerCase().includes(searchvalue.toLowerCase())
            }))

        }

    },[searchvalue])

    useEffect(()=>{
        (async()=>{
            await dispatch(getOtherUsersThunk())
        })()


    },[])
    return (
        <div className='bg-gray-800 max-w-[20rem] w-full h-screen flex flex-col'>

            <h1 className='font-bold my-2 mx-1 px-2 text-xl '>WebChat</h1>

            <div className='p-2 py-0 '>
                <label className="input input-bordered flex items-center gap-2">
                    <input onChange={(e)=>setsearchvalue(e.target.value)} type="search" className="grow" placeholder="Search" />
                    <IoSearch />
                </label>
            </div>
            <div className='h-full overflow-y-auto px-3 py-3 flex flex-col gap-2 '>
                {user?.map(userdetails => {
                    return (
                        <User key={userdetails._id} userdetails={userdetails} />
                    )
                })}

            </div>
            <div className='h-[3rem] bg-gray-800 flex items-center justify-between p-2 border-t-1 border-t-blue-300'>
                <div className='flex items-center gap-2'>  
                    <div className="avatar">
                        <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-1">
                            <img src={currentuser?.avatar} className='cursor-pointer' onClick={()=>dispatch(setSelectedPage('profile'))}/>
                        </div>
                    </div>
                    <div className='text-white text-sm cursor-pointer' onClick={()=>dispatch(setSelectedPage('profile'))}>{currentuser?.fullname}</div> 
                </div>
                <button onClick={handleLogOut} className="btn btn-error btn-sm bg-red-400">Logout</button>
            </div>
        </div>
    )
}

export default UserSidebar