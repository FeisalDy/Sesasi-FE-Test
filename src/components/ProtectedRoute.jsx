import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoute = () => {
  const location = useLocation()
  const jwtToken = localStorage.getItem('jwtToken')

  if (!jwtToken) {
    return (
      <Navigate
        to='/login'
        state={{ from: location, message: 'Please login to access this page.' }}
        replace
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
