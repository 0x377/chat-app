// src/components/chat/Chat.jsx
import React, { useEffect, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useChat } from '../../contexts/ChatContext'
import ChatRoom from './ChatRoom'
import WelcomeScreen from './WelcomeScreen'

const Chat = () => {
  const { activeRoom } = useChat()

  return (
    <div className="chat-container">
      <Routes>
        <Route
          path="/"
          element={
            activeRoom ? (
              <Navigate to={`/room/${activeRoom._id}`} replace />
            ) : (
              <WelcomeScreen />
            )
          }
        />
        <Route path="/room/:roomId" element={<ChatRoom />} />
      </Routes>
    </div>
  )
}

export default Chat
