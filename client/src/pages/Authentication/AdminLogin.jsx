import React, { useState, useEffect } from 'react'
import { FaUser } from "react-icons/fa6"
import { MdPassword } from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginAdminThunk } from '../../store/slice/admin/admin.thunk.js'

const AdminLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAdminAuthenticated } = useSelector(state => state.adminSlice)

  const [adminData, setAdminData] = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard')
    }
  }, [isAdminAuthenticated])

  const handleInputChange = (e) => {
    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value
    })
  }

  const handleAdminLogin = async () => {
    const response = await dispatch(loginAdminThunk(adminData))
    if (response?.payload?.success) {
      navigate('/admin/dashboard')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-[80%] max-w-[30rem] bg-gray-800 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4 text-white">Admin Login</h1>
        <div className="flex flex-col gap-4">
          <label className="flex items-center px-4 py-3 bg-gray-900 text-white rounded-lg">
            <FaUser className="mr-3 text-xl" />
            <input
              type="text"
              name="username"
              required
              placeholder="Admin Username"
              className="bg-transparent border-none outline-none flex-1 text-white text-lg"
              onChange={handleInputChange}
            />
          </label>

          <label className="flex items-center px-4 py-3 bg-gray-900 text-white rounded-lg">
            <MdPassword className="mr-3 text-xl" />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="bg-transparent border-none outline-none flex-1 text-white text-lg"
              onChange={handleInputChange}
            />
          </label>

          <button className="btn btn-warning" onClick={handleAdminLogin}>Login as Admin</button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
