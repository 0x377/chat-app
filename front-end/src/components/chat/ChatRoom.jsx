// src/components/chat/ChatRoom.jsx
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../../contexts/ChatContext'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import RoomHeader from './RoomHeader'
import { useAuth } from '../../contexts/AuthContext'

const ChatRoom = () => {
  const { roomId } = useParams()
  const { activeRoom, messages, loadMessages, setActiveRoom } = useChat()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (roomId && (!activeRoom || activeRoom._id !== roomId)) {
      // Load room data and set as active
      // This would typically involve fetching room details
    }
  }, [roomId, activeRoom])

  useEffect(() => {
    if (activeRoom && activeRoom._id === roomId) {
      loadMessages(roomId)
    }
  }, [activeRoom, roomId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!activeRoom || activeRoom._id !== roomId) {
    return (
      <div className="chat-room loading">
        <div className="loading-spinner">Loading room...</div>
      </div>
    )
  }

  return (
    <motion.div
      className="chat-room"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <RoomHeader room={activeRoom} />
      
      <div className="messages-container">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      <MessageInput room={activeRoom} />
    </motion.div>
  )
}

export default ChatRoom
