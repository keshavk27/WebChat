import { useEffect } from 'react'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
export const ProtectedRoutes = ({children}) => {
    const {isAuthenticated,screenLoading}=useSelector(state=>state.userSlice)
    const navigate=useNavigate()
    useEffect(()=>{
       if(!screenLoading&&!isAuthenticated)
       {
          navigate('/login')
       }
    },[isAuthenticated,screenLoading]) 
  return (
    children
  )
}
