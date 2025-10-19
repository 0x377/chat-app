// src/components/chat/RoomList.jsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../../contexts/ChatContext'
import { Users, Lock } from 'lucide-react'

const RoomItem = ({ room, isActive, onClick }) => {
  const memberCount = room.members?.length || 0

  return (
    <motion.div
      className={`room-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="room-avatar">
        {room.type === 'private' ? <Lock size={16} /> : <Users size={16} />}
      </div>
      <div className="room-info">
        <h6 className="room-name">{room.name}</h6>
        <p className="room-meta">
          {memberCount} member{memberCount !== 1 ? 's' : ''}
        </p>
      </div>
      {room.unreadCount > 0 && (
        <div className="unread-badge">{room.unreadCount}</div>
      )}
    </motion.div>
  )
}

const RoomList = ({ rooms }) => {
  const { activeRoom, setActiveRoom } = useChat()

  return (
    <div className="room-list">
      <AnimatePresence>
        {rooms.map((room, index) => (
          <motion.div
            key={room._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <RoomItem
              room={room}
              isActive={activeRoom?._id === room._id}
              onClick={() => setActiveRoom(room)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {rooms.length === 0 && (
        <div className="empty-state">
          <Users size={48} className="empty-icon" />
          <p>No rooms found</p>
          <small>Create a room to start chatting</small>
        </div>
      )}
    </div>
  )
}

export default RoomList
