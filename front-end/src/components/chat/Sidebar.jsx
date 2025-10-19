import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../../contexts/ChatContext'
import { useAuth } from '../../contexts/AuthContext'
import { Search, LogOut, Plus, Users, MessageCircle } from 'lucide-react'
import RoomList from './RoomList'
import CreateRoomModal from './CreateRoomModal'

const Sidebar = () => {
  const { rooms, loadRooms, activeRoom } = useChat()
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadRooms()
  }, [])

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div
      className="sidebar"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h6 className="username">{user?.username}</h6>
            <span className="user-status online">Online</span>
          </div>
        </div>
        <motion.button
          className="logout-btn"
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Logout"
        >
          <LogOut size={18} />
        </motion.button>
      </div>

      {/* Search and Create */}
      <div className="sidebar-actions">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <motion.button
          className="create-room-btn"
          onClick={() => setShowCreateModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Create New Room"
        >
          <Plus size={18} />
        </motion.button>
      </div>

      {/* Rooms Section */}
      <div className="sidebar-section">
        <div className="section-header">
          <MessageCircle size={18} />
          <span>Chat Rooms</span>
          <span className="badge">{filteredRooms.length}</span>
        </div>
        <RoomList rooms={filteredRooms} />
      </div>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateRoomModal onClose={() => setShowCreateModal(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Sidebar
