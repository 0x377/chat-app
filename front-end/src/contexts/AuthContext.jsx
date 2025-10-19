import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

const initialState = {
  user: null,
  token: localStorage.getItem('chat_token'),
  isAuthenticated: false,
  loading: false,
  error: null
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    if (state.token) {
      verifyToken()
    }
  }, [state.token])

  const verifyToken = async () => {
    try {
      const response = await authService.getMe()
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.data.user,
          token: state.token
        }
      })
    } catch (error) {
      localStorage.removeItem('chat_token')
      dispatch({ type: 'LOGOUT' })
    }
  }

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await authService.login(credentials)
      const { user, token } = response.data.data
      
      localStorage.setItem('chat_token', token)
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      })
      
      toast.success(`Welcome back, ${user.username}!`)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: message })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await authService.register(userData)
      const { user, token } = response.data.data
      
      localStorage.setItem('chat_token', token)
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      })
      
      toast.success(`Welcome to ChatApp, ${user.username}!`)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: message })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      if (state.token) {
        await authService.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('chat_token')
      dispatch({ type: 'LOGOUT' })
      toast.success('Logged out successfully')
    }
  }

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
