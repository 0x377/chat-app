// src/components/chat/MessageList.jsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import Message from './Message'

const MessageList = ({ messages }) => {
  const { user } = useAuth()

  return (
    <div className="message-list">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Message
              message={message}
              isOwn={message.sender?._id === user?._id}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {messages.length === 0 && (
        <div className="empty-messages">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="empty-state"
          >
            <h4>No messages yet</h4>
            <p>Start the conversation by sending a message!</p>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default MessageList
