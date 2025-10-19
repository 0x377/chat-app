import Message from '../models/Message.js';
import Room from '../models/Room.js';
import { messageValidation } from '../utils/validation.js';
import logger from '../utils/logger.js';

export const sendMessage = async (req, res) => {
  try {
    const { content, roomId, type, replyTo, attachments } = req.body;
    const userId = req.user._id;

    // Check if room exists and user is a member
    const room = await Room.findOne({
      _id: roomId,
      'members.user': userId,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or access denied'
      });
    }

    // Create message
    const message = new Message({
      content,
      type: type || 'text',
      sender: userId,
      room: roomId,
      replyTo,
      attachments: attachments || []
    });

    await message.save();

    // Populate sender info
    await message.populate('sender', 'username avatar');
    if (replyTo) {
      await message.populate('replyTo');
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message }
    });

  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50, before } = req.query;
    const userId = req.user._id;

    // Check if user is a member of the room
    const room = await Room.findOne({
      _id: roomId,
      'members.user': userId
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or access denied'
      });
    }

    // Build query
    const query = { room: roomId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    // Get messages with pagination
    const messages = await Message.find(query)
      .populate('sender', 'username avatar')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Message.countDocuments(query);

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Return in chronological order
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findOne({
      _id: messageId,
      sender: userId
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or access denied'
      });
    }

    // Soft delete by clearing content
    message.content = 'This message was deleted';
    message.type = 'system';
    message.attachments = [];
    await message.save();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    logger.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Remove existing reaction from same user
    message.reactions = message.reactions.filter(
      reaction => !reaction.user.equals(userId)
    );

    // Add new reaction
    message.reactions.push({
      user: userId,
      emoji
    });

    await message.save();
    await message.populate('reactions.user', 'username avatar');

    res.json({
      success: true,
      message: 'Reaction added successfully',
      data: { message }
    });

  } catch (error) {
    logger.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add reaction'
    });
  }
};
