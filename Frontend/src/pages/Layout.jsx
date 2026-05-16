import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import Login from './Login'

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
  </div>
)

const Layout = () => {

  const { user, loading } = useSelector((state) => state.auth)

  if (loading) {
    return <Loader />
  }

  return (
    <div>{
      user ? (<div className='min-h-screen bg-gray-50'>
        <Navbar />
        <Outlet />
      </div>
      )
        : <Login />
    }
    </div>
  )
}

export default Layout
