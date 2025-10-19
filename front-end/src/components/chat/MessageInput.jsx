// src/components/chat/MessageInput.jsx
import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useChat } from '../../contexts/ChatContext'
import { Send, Paperclip, Smile } from 'lucide-react'

const MessageInput = ({ room }) => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const { sendMessage, startTyping, stopTyping } = useChat()
  const textareaRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const handleInputChange = (e) => {
    const value = e.target.value
    setMessage(value)

    // Handle typing indicators
    if (value.trim() && !isTyping) {
      setIsTyping(true)
      startTyping(room._id)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      stopTyping(room._id)
    }, 1000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!message.trim()) return

    try {
      await sendMessage({
        content: message.trim(),
        roomId: room._id,
        type: 'text'
      })
      
      setMessage('')
      setIsTyping(false)
      stopTyping(room._id)
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (isTyping) {
        stopTyping(room._id)
      }
    }
  }, [room._id])

  return (
    <motion.div
      className="message-input-container"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <form onSubmit={handleSubmit} className="message-input-form">
        <div className="input-actions">
          <button type="button" className="action-btn" title="Attach file">
            <Paperclip size={20} />
          </button>
          <button type="button" className="action-btn" title="Add emoji">
            <Smile size={20} />
          </button>
        </div>
        
        <div className="message-input-wrapper">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={`Message #${room.name}`}
            className="message-input"
            rows={1}
            maxLength={1000}
          />
        </div>
        
        <motion.button
          type="submit"
          className="send-button"
          disabled={!message.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Send message"
        >
          <Send size={20} />
        </motion.button>
      </form>
    </motion.div>
  )
}

export default MessageInput
