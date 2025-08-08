import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Authentication/Login.jsx'
import Signup from './pages/Authentication/Signup.jsx'
import { store } from './store/store.js'
import { Provider } from "react-redux"
import { ProtectedRoutes } from './components/ProtectedRoutes.jsx'
import AdminLogin from './pages/Authentication/AdminLogin.jsx'
import AdminDashboard from './pages/Home/AdminDahboard.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><Home /></ProtectedRoutes>
  },
  {
    path:"admin/dashboard",
    element: <AdminDashboard />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path:"/adminlogin",
    element: <AdminLogin/>
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    <RouterProvider router={router} />

  </Provider>
)
