import express from 'express';
import Room from '../models/Room.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../utils/validation.js';
import { roomValidation } from '../utils/validation.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Create new room
router.post('/', authenticate, validate(roomValidation), async (req, res) => {
  try {
    const { name, description, type, members = [] } = req.body;

    // Create room with creator as admin
    const room = new Room({
      name,
      description,
      type,
      createdBy: req.user._id,
      members: [
        {
          user: req.user._id,
          role: 'admin'
        },
        ...members.map(memberId => ({
          user: memberId,
          role: 'member'
        }))
      ]
    });

    await room.save();
    await room.populate('members.user', 'username avatar');
    await room.populate('createdBy', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: { room }
    });

  } catch (error) {
    logger.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create room'
    });
  }
});

// Get user's rooms
router.get('/my-rooms', authenticate, async (req, res) => {
  try {
    const rooms = await Room.find({
      'members.user': req.user._id,
      isActive: true
    })
    .populate('members.user', 'username avatar isOnline')
    .populate('createdBy', 'username avatar')
    .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: { rooms }
    });

  } catch (error) {
    logger.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms'
    });
  }
});

// Get room details
router.get('/:roomId', authenticate, async (req, res) => {
  try {
    const room = await Room.findOne({
      _id: req.params.roomId,
      'members.user': req.user._id
    })
    .populate('members.user', 'username avatar isOnline lastSeen')
    .populate('createdBy', 'username avatar');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      data: { room }
    });

  } catch (error) {
    logger.error('Get room error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room'
    });
  }
});

// Add member to room
router.post('/:roomId/members', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;
    const room = await Room.findOne({
      _id: req.params.roomId,
      'members.user': req.user._id,
      'members.role': { $in: ['admin', 'moderator'] }
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or insufficient permissions'
      });
    }

    // Check if user is already a member
    const isAlreadyMember = room.members.some(member => 
      member.user.toString() === userId
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this room'
      });
    }

    // Add new member
    room.members.push({
      user: userId,
      role: 'member'
    });

    await room.save();
    await room.populate('members.user', 'username avatar');

    res.json({
      success: true,
      message: 'Member added successfully',
      data: { room }
    });

  } catch (error) {
    logger.error('Add member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add member'
    });
  }
});

export default router;
