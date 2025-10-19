import React, { createContext, useContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null)
  const { token, isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated && token && !socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      })

      socketRef.current.on('connect', () => {
        console.log('Connected to server with ID:', socketRef.current.id)
        toast.success('Connected to chat server')
      })

      socketRef.current.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason)
        if (reason === 'io server disconnect') {
          socketRef.current.connect()
        }
      })

      socketRef.current.on('connect_error', (error) => {
        console.error('Connection error:', error)
        toast.error('Connection to chat server failed')
      })

      // Handle global errors
      socketRef.current.on('error', (error) => {
        console.error('Socket error:', error)
        toast.error(error.message || 'An error occurred')
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [isAuthenticated, token])

  const value = {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
