import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('chat_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('chat_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
}

export const chatService = {
  getMyRooms: () => api.get('/rooms/my-rooms'),
  getRoom: (roomId) => api.get(`/rooms/${roomId}`),
  createRoom: (roomData) => api.post('/rooms', roomData),
  getMessages: (roomId, page = 1, limit = 50) => 
    api.get(`/messages/room/${roomId}?page=${page}&limit=${limit}`),
  sendMessage: (messageData) => api.post('/messages', messageData),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
  addReaction: (messageId, emoji) => 
    api.post(`/messages/${messageId}/reaction`, { emoji })
}

export default api
