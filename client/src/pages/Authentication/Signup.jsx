import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Link, useNavigate } from 'react-router-dom'
import { FaUser } from "react-icons/fa6";
import { MdPassword } from "react-icons/md";
import { registerUserThunk } from '../../store/slice/user/user.thunk';
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast';
function Signup() {

  const { isAuthenticated } = useSelector(state => state.userSlice)

  const navigate=useNavigate()
  const dispatch = useDispatch();
  const [signupdata, setsignupdata] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmpassword: "",
    gender: ""
  })
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  },[isAuthenticated])
  const handleInputChange = (e) => {
    setsignupdata({
      ...signupdata,
      [e.target.name]: e.target.value
    })
    console.log(signupdata)
  };

  const handleSignup = async () => {
    if (signupdata.password === signupdata.confirmpassword) {

      const response = await dispatch(registerUserThunk(signupdata));
      if(response?.payload?.success)
      {
        navigate('/')

      }
    }
    else{
      toast.error("Passwords do not match")
      
    }

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-[80%] max-w-[30rem] bg-gray-800 p-6 rounded-lg">
        {/* Combined Input Container */}
        <h1 className="flex justify-center items-center text-2xl mt-0 mb-4 font-bold  ">Please Signup </h1>
        <div className="flex flex-col  gap-4 rounded-lg w-full">
          <label className="flex items-center px-4 py-3 rounded-lg bg-gray-900 text-white w-full">
            <FaUser className="mr-3 text-xl" />
            <input
              onChange={handleInputChange}
              type="text"
              name='fullname'
              required
              placeholder="Full Name"
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength="3"
              maxLength="30"
              title="Only letters, numbers or dash"
              className="bg-transparent border-none outline-none flex-1 text-white text-lg w-full"
            />
          </label>

          <label className="flex items-center px-4 py-3 rounded-lg bg-gray-900 text-white w-full">
            <FaUser className="mr-3 text-xl" />
            <input
              type="text"
              required
              name='username'
              onChange={handleInputChange}
              placeholder="Username"
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength="3"
              maxLength="30"
              title="Only letters, numbers or dash"
              className="bg-transparent border-none outline-none flex-1 text-white text-lg w-full"
            />
          </label>

          <label className="flex items-center rounded-lg px-4 py-3 bg-gray-900 text-white border-t border-gray-500 w-full">
            <MdPassword className="mr-3 text-xl" />
            <input
              onChange={handleInputChange}
              type="password"
              required
              name='password'
              placeholder="Password"
              minLength="8"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              className="bg-transparent border-none outline-none flex-1 text-white text-lg w-full"
            />
          </label>
          <label className="flex items-center rounded-lg px-4 py-3 bg-gray-900 text-white border-t border-gray-500 w-full">
            <MdPassword className="mr-3 text-xl" />
            <input
              onChange={handleInputChange}
              type="password"
              required
              name='confirmpassword'
              placeholder="Confirm Password"
              minLength="8"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              className="bg-transparent border-none outline-none flex-1 text-white text-lg w-full"
            />
          </label>


          <div className="flex items-center justify-center gap-8">
            <label className="flex items-center space-x-2">
              <input onChange={handleInputChange} type="radio" name="gender" value="male" className="radio radio-info" />
              <span>Male</span>
            </label>
            <label className="flex items-center space-x-2">
              <input onChange={handleInputChange} type="radio" name="gender" value="female" className="radio radio-info" />
              <span>Female</span>
            </label>
          </div>

          <button onClick={handleSignup} className="btn btn-info">Signup</button>
          <p className='flex justify-center '>Already have an account?
            <Link to='/login'> Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup