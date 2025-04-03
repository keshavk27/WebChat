import React, { useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa6";
import { MdPassword } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { loginUserThunk } from '../../store/slice/user/user.thunk';
const Login = () => {

  const { isAuthenticated } = useSelector(state => state.userSlice)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logindata, setlogindata] = useState({
    username: "",
    password: ""
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  },[isAuthenticated])

  const handleInputChange = (e) => {
    setlogindata({
      ...logindata,
      [e.target.name]: e.target.value
    })
  };

  const handlelogin = async () => {
    const response = await dispatch(loginUserThunk(logindata))
    if (response?.payload?.success) {
      navigate('/')

    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-[80%] max-w-[30rem] bg-gray-800 p-6 rounded-lg">
        {/* Combined Input Container */}
        <h1 className="flex justify-center items-center text-2xl mt-0 mb-4 font-bold  ">Please Login </h1>
        <div className="flex flex-col  gap-4 rounded-lg w-full">
          <label className="flex items-center px-4 py-3 rounded-lg bg-gray-900 text-white w-full">
            <FaUser className="mr-3 text-xl" />
            <input
              type="text"
              name='username'
              required
              placeholder="Username"
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength="3"
              maxLength="30"
              title="Only letters, numbers or dash"
              className="bg-transparent border-none outline-none flex-1 text-white text-lg w-full"
              onChange={handleInputChange}
            />
          </label>

          <label className="flex items-center rounded-lg px-4 py-3 bg-gray-900 text-white border-t border-gray-500 w-full">
            <MdPassword className="mr-3 text-xl" />
            <input
              onChange={handleInputChange}
              type="password"
              name='password'
              required
              placeholder="Password"
              minLength="8"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              className="bg-transparent border-none outline-none flex-1 text-white text-lg w-full"
            />
          </label>
          <button className="btn btn-info" onClick={handlelogin}>Login</button>
          <p className='flex justify-center items-center'>Don't have an account?
            <Link to='/signup'> Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
};

export default Login;
