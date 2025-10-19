import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Lock, Globe } from 'lucide-react'
import { useChat } from '../../contexts/ChatContext'
import { chatService } from '../../services/api'
import toast from 'react-hot-toast'

const CreateRoomModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'public',
    members: []
  })
  const [loading, setLoading] = useState(false)
  const { loadRooms } = useChat()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await chatService.createRoom(formData)
      await loadRooms()
      toast.success(`Room "${formData.name}" created successfully!`)
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create room')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const roomTypes = [
    {
      value: 'public',
      icon: <Globe size={20} />,
      label: 'Public Room',
      description: 'Anyone can join this room'
    },
    {
      value: 'private',
      icon: <Lock size={20} />,
      label: 'Private Room',
      description: 'Only invited members can join'
    }
  ]

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="create-room-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <h2>Create New Room</h2>
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            {/* Room Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Room Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={50}
                className="form-control"
                placeholder="Enter room name..."
              />
              <div className="character-count">
                {formData.name.length}/50
              </div>
            </div>

            {/* Room Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={200}
                className="form-control"
                rows={3}
                placeholder="What is this room about?..."
              />
              <div className="character-count">
                {formData.description.length}/200
              </div>
            </div>

            {/* Room Type */}
            <div className="form-group">
              <label className="form-label">Room Type</label>
              <div className="room-type-grid">
                {roomTypes.map((type) => (
                  <motion.label
                    key={type.value}
                    className={`room-type-option ${
                      formData.type === type.value ? 'selected' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="type-icon">{type.icon}</div>
                    <div className="type-info">
                      <div className="type-label">{type.label}</div>
                      <div className="type-description">{type.description}</div>
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="modal-actions">
              <motion.button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="btn-primary"
                disabled={loading || !formData.name.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Creating...' : 'Create Room'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CreateRoomModal