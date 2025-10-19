// src/components/chat/Message.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Smile, Reply, MoreVertical } from 'lucide-react'

const Message = ({ message, isOwn }) => {
  const [showActions, setShowActions] = useState(false)
  const [showReactions, setShowReactions] = useState(false)

  const formatTime = (timestamp) => {
    return format(new Date(timestamp), 'HH:mm')
  }

  return (
    <motion.div
      className={`message ${isOwn ? 'own-message' : 'other-message'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {!isOwn && (
        <div className="message-avatar">
          {message.sender?.username?.charAt(0).toUpperCase()}
        </div>
      )}
      
      <div className="message-content">
        {!isOwn && (
          <div className="message-sender">
            {message.sender?.username}
          </div>
        )}
        
        <div className="message-bubble">
          {message.replyTo && (
            <div className="reply-preview">
              <div className="reply-sender">
                {message.replyTo.sender?.username}
              </div>
              <div className="reply-content">
                {message.replyTo.content}
              </div>
            </div>
          )}
          
          <div className="message-text">{message.content}</div>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="message-attachments">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="attachment">
                  {/* Attachment preview would go here */}
                </div>
              ))}
            </div>
          )}
          
          <div className="message-footer">
            <span className="message-time">
              {formatTime(message.createdAt)}
            </span>
            {message.readBy && message.readBy.length > 0 && (
              <span className="read-receipt">✓✓</span>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showActions && (
            <motion.div
              className="message-actions"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <button
                className="action-btn"
                onClick={() => setShowReactions(!showReactions)}
                title="Add Reaction"
              >
                <Smile size={16} />
              </button>
              <button className="action-btn" title="Reply">
                <Reply size={16} />
              </button>
              {isOwn && (
                <button className="action-btn" title="More">
                  <MoreVertical size={16} />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isOwn && (
        <div className="message-status">
          {message.readBy && message.readBy.length > 0 ? '✓✓' : '✓'}
        </div>
      )}
    </motion.div>
  )
}

export default Message
