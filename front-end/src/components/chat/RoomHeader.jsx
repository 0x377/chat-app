import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Search, 
  MoreVertical, 
  Settings, 
  UserPlus, 
  Shield,
  Pin,
  Bell,
  BellOff
} from 'lucide-react'
import { useChat } from '../../contexts/ChatContext'

const RoomHeader = ({ room }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const { typingUsers } = useChat()

  const onlineMembers = room.members?.filter(member => 
    member.user?.isOnline
  ) || []

  const typingInRoom = typingUsers.filter(user => 
    user.roomId === room._id
  )

  const getTypingText = () => {
    if (typingInRoom.length === 0) return null
    if (typingInRoom.length === 1) return `${typingInRoom[0].username} is typing...`
    if (typingInRoom.length === 2) return `${typingInRoom[0].username} and ${typingInRoom[1].username} are typing...`
    return 'Several people are typing...'
  }

  const menuItems = [
    {
      icon: <Pin size={16} />,
      label: 'Pin Room',
      action: () => console.log('Pin room')
    },
    {
      icon: <Bell size={16} />,
      label: 'Mute Notifications',
      action: () => console.log('Mute notifications')
    },
    {
      icon: <UserPlus size={16} />,
      label: 'Invite People',
      action: () => console.log('Invite people')
    },
    {
      icon: <Settings size={16} />,
      label: 'Room Settings',
      action: () => console.log('Room settings')
    }
  ]

  return (
    <motion.div
      className="room-header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Room Info */}
      <div className="room-info">
        <div className="room-avatar">
          {room.type === 'private' ? <Shield size={20} /> : <Users size={20} />}
        </div>
        <div className="room-details">
          <h2 className="room-title">{room.name}</h2>
          <div className="room-status">
            <AnimatePresence mode="wait">
              {getTypingText() ? (
                <motion.span
                  key="typing"
                  className="typing-indicator"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="typing-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                  {getTypingText()}
                </motion.span>
              ) : (
                <motion.span
                  key="members"
                  className="members-count"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {onlineMembers.length} of {room.members?.length || 0} online
                  {room.description && ` • ${room.description}`}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="room-actions">
        {/* Search Button */}
        <motion.button
          className="room-action-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Search messages"
        >
          <Search size={18} />
        </motion.button>

        {/* Members Button */}
        <motion.button
          className="room-action-btn"
          onClick={() => setShowMembers(!showMembers)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="View members"
        >
          <Users size={18} />
          {onlineMembers.length > 0 && (
            <span className="online-badge">{onlineMembers.length}</span>
          )}
        </motion.button>

        {/* Menu Button */}
        <div className="menu-container">
          <motion.button
            className="room-action-btn"
            onClick={() => setShowMenu(!showMenu)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Room options"
          >
            <MoreVertical size={18} />
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showMenu && (
              <>
                <div
                  className="menu-backdrop"
                  onClick={() => setShowMenu(false)}
                />
                <motion.div
                  className="room-menu"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={index}
                      className="menu-item"
                      onClick={() => {
                        item.action()
                        setShowMenu(false)
                      }}
                      whileHover={{ backgroundColor: 'var(--surface-hover)' }}
                      transition={{ duration: 0.1 }}
                    >
                      <span className="menu-item-icon">{item.icon}</span>
                      <span className="menu-item-label">{item.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Members Panel */}
      <AnimatePresence>
        {showMembers && (
          <>
            <div
              className="panel-backdrop"
              onClick={() => setShowMembers(false)}
            />
            <motion.div
              className="members-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="panel-header">
                <h3>Room Members</h3>
                <button
                  className="close-panel"
                  onClick={() => setShowMembers(false)}
                >
                  ×
                </button>
              </div>
              <div className="members-list">
                {room.members?.map((member) => (
                  <div key={member.user?._id} className="member-item">
                    <div className="member-avatar">
                      {member.user?.username?.charAt(0).toUpperCase()}
                      {member.user?.isOnline && (
                        <div className="online-indicator" />
                      )}
                    </div>
                    <div className="member-info">
                      <span className="member-name">
                        {member.user?.username}
                        {member.role === 'admin' && (
                          <span className="role-badge admin">Admin</span>
                        )}
                        {member.role === 'moderator' && (
                          <span className="role-badge moderator">Mod</span>
                        )}
                      </span>
                      <span className="member-status">
                        {member.user?.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default RoomHeader