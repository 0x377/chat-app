import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useSocket } from './SocketContext'
import { chatService } from '../services/api'
import { useAuth } from './AuthContext'

const ChatContext = createContext()

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload }
    case 'ADD_ROOM':
      return {
        ...state,
        rooms: [action.payload, ...state.rooms]
      }
    case 'UPDATE_ROOM':
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room._id === action.payload._id ? action.payload : room
        )
      }
    case 'SET_ACTIVE_ROOM':
      return { ...state, activeRoom: action.payload }
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload }
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      }
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg._id === action.payload._id ? action.payload : msg
        )
      }
    case 'SET_TYPING_USERS':
      return {
        ...state,
        typingUsers: action.payload
      }
    case 'ADD_TYPING_USER':
      return {
        ...state,
        typingUsers: [...state.typingUsers.filter(u => u.userId !== action.payload.userId), action.payload]
      }
    case 'REMOVE_TYPING_USER':
      return {
        ...state,
        typingUsers: state.typingUsers.filter(u => u.userId !== action.payload.userId)
      }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

const initialState = {
  rooms: [],
  activeRoom: null,
  messages: [],
  typingUsers: [],
  loading: false,
  error: null
}

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const { socket } = useSocket()
  const { user } = useAuth()

  useEffect(() => {
    if (socket) {
      // Message events
      socket.on('new_message', (data) => {
        dispatch({ type: 'ADD_MESSAGE', payload: data.message })
      })

      socket.on('message_read', (data) => {
        // Update message read status
      })

      // Typing events
      socket.on('user_typing', (data) => {
        dispatch({
          type: 'ADD_TYPING_USER',
          payload: {
            userId: data.userId,
            username: data.username,
            roomId: data.roomId
          }
        })
      })

      socket.on('user_stop_typing', (data) => {
        dispatch({
          type: 'REMOVE_TYPING_USER',
          payload: { userId: data.userId }
        })
      })

      // Room events
      socket.on('user_joined_room', (data) => {
        // Update room members
      })

      socket.on('user_left_room', (data) => {
        // Update room members
      })

      // User status events
      socket.on('user_online', (data) => {
        // Update user online status in rooms
      })

      socket.on('user_offline', (data) => {
        // Update user offline status in rooms
      })
    }

    return () => {
      if (socket) {
        socket.off('new_message')
        socket.off('message_read')
        socket.off('user_typing')
        socket.off('user_stop_typing')
        socket.off('user_joined_room')
        socket.off('user_left_room')
        socket.off('user_online')
        socket.off('user_offline')
      }
    }
  }, [socket])

  const loadRooms = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await chatService.getMyRooms()
      dispatch({ type: 'SET_ROOMS', payload: response.data.data.rooms })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to load rooms' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const loadMessages = async (roomId, page = 1) => {
    try {
      const response = await chatService.getMessages(roomId, page)
      if (page === 1) {
        dispatch({ type: 'SET_MESSAGES', payload: response.data.data.messages })
      } else {
        dispatch({ type: 'SET_MESSAGES', payload: [...response.data.data.messages, ...state.messages] })
      }
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  const sendMessage = async (messageData) => {
    if (!socket) throw new Error('Socket not connected')
    
    return new Promise((resolve, reject) => {
      socket.emit('send_message', messageData, (response) => {
        if (response.error) {
          reject(new Error(response.error))
        } else {
          resolve(response)
        }
      })
    })
  }

  const startTyping = (roomId) => {
    if (socket) {
      socket.emit('typing_start', { roomId })
    }
  }

  const stopTyping = (roomId) => {
    if (socket) {
      socket.emit('typing_stop', { roomId })
    }
  }

  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join_room', roomId)
    }
  }

  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave_room', roomId)
    }
  }

  const setActiveRoom = (room) => {
    if (state.activeRoom && state.activeRoom._id !== room._id) {
      leaveRoom(state.activeRoom._id)
    }
    dispatch({ type: 'SET_ACTIVE_ROOM', payload: room })
    joinRoom(room._id)
  }

  const value = {
    ...state,
    loadRooms,
    loadMessages,
    sendMessage,
    startTyping,
    stopTyping,
    setActiveRoom,
    joinRoom,
    leaveRoom
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
