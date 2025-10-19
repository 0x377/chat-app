import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../chat/Sidebar'
import { useChat } from '../../contexts/ChatContext'

const Layout = () => {
  const { activeRoom } = useChat()

  return (
    <div className="layout">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
