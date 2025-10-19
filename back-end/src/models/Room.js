import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 200
  },
  type: {
    type: String,
    enum: ['public', 'private', 'direct'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  avatar: String,
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowInvites: {
      type: Boolean,
      default: true
    },
    maxMembers: {
      type: Number,
      default: 100
    },
    slowMode: {
      enabled: Boolean,
      delay: Number
    }
  }
}, {
  timestamps: true
});

// For direct messages, ensure unique room between two users
roomSchema.index({ type: 1, members: 1 }, { 
  unique: true, 
  partialFilterExpression: { type: 'direct' } 
});

export default mongoose.model('Room', roomSchema);
