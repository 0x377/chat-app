import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Room from '../models/Room.js';
import logger from '../utils/logger.js';

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: env.CORS_ORIGIN,
        methods: ['GET', 'POST']
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    
    logger.info('Socket.IO server initialized');
  }

  setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
          return next(new Error('Authentication error: User not found'));
        }

        socket.userId = user._id;
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', async (socket) => {
      logger.info(`User ${socket.user.username} connected with socket ID: ${socket.id}`);

      // Store user connection
      this.connectedUsers.set(socket.userId.toString(), {
        socketId: socket.id,
        user: socket.user
      });

      // Update user online status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: true,
        socketId: socket.id
      });

      // Join user to their rooms
      await this.joinUserRooms(socket);

      // Notify others about user coming online
      socket.broadcast.emit('user_online', {
        userId: socket.userId,
        user: socket.user
      });

      // Message events
      socket.on('send_message', async (data) => {
        await this.handleSendMessage(socket, data);
      });

      socket.on('typing_start', (data) => {
        this.handleTypingStart(socket, data);
      });

      socket.on('typing_stop', (data) => {
        this.handleTypingStop(socket, data);
      });

      socket.on('message_read', async (data) => {
        await this.handleMessageRead(socket, data);
      });

      socket.on('join_room', async (roomId) => {
        await this.handleJoinRoom(socket, roomId);
      });

      socket.on('leave_room', async (roomId) => {
        await this.handleLeaveRoom(socket, roomId);
      });

      socket.on('disconnect', async () => {
        await this.handleDisconnect(socket);
      });
    });
  }

  async joinUserRooms(socket) {
    try {
      const rooms = await Room.find({
        'members.user': socket.userId,
        isActive: true
      });

      rooms.forEach(room => {
        socket.join(room._id.toString());
        logger.debug(`User ${socket.user.username} joined room ${room.name}`);
      });
    } catch (error) {
      logger.error('Error joining user rooms:', error);
    }
  }

  async handleSendMessage(socket, data) {
    try {
      const { content, roomId, replyTo, type = 'text', attachments = [] } = data;

      // Validate room membership
      const room = await Room.findOne({
        _id: roomId,
        'members.user': socket.userId
      });

      if (!room) {
        socket.emit('error', { message: 'Room not found or access denied' });
        return;
      }

      // Create message
      const message = new Message({
        content,
        type,
        sender: socket.userId,
        room: roomId,
        replyTo,
        attachments
      });

      await message.save();
      await message.populate('sender', 'username avatar');
      if (replyTo) {
        await message.populate('replyTo');
      }

      // Emit to room
      this.io.to(roomId).emit('new_message', {
        message,
        roomId
      });

      logger.info(`Message sent in room ${roomId} by user ${socket.user.username}`);

    } catch (error) {
      logger.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  handleTypingStart(socket, data) {
    const { roomId } = data;
    socket.to(roomId).emit('user_typing', {
      userId: socket.userId,
      username: socket.user.username,
      roomId
    });
  }

  handleTypingStop(socket, data) {
    const { roomId } = data;
    socket.to(roomId).emit('user_stop_typing', {
      userId: socket.userId,
      roomId
    });
  }

  async handleMessageRead(socket, data) {
    try {
      const { messageId, roomId } = data;

      await Message.findByIdAndUpdate(messageId, {
        $push: {
          readBy: {
            user: socket.userId,
            readAt: new Date()
          }
        }
      });

      socket.to(roomId).emit('message_read', {
        messageId,
        userId: socket.userId,
        roomId
      });

    } catch (error) {
      logger.error('Error marking message as read:', error);
    }
  }

  async handleJoinRoom(socket, roomId) {
    try {
      const room = await Room.findOne({
        _id: roomId,
        'members.user': socket.userId
      });

      if (room) {
        socket.join(roomId);
        socket.to(roomId).emit('user_joined_room', {
          userId: socket.userId,
          user: socket.user,
          roomId
        });
        logger.info(`User ${socket.user.username} joined room ${roomId}`);
      }
    } catch (error) {
      logger.error('Error joining room:', error);
    }
  }

  async handleLeaveRoom(socket, roomId) {
    try {
      socket.leave(roomId);
      socket.to(roomId).emit('user_left_room', {
        userId: socket.userId,
        roomId
      });
      logger.info(`User ${socket.user.username} left room ${roomId}`);
    } catch (error) {
      logger.error('Error leaving room:', error);
    }
  }

  async handleDisconnect(socket) {
    try {
      // Update user status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date(),
        socketId: null
      });

      // Remove from connected users
      this.connectedUsers.delete(socket.userId.toString());

      // Notify others
      socket.broadcast.emit('user_offline', {
        userId: socket.userId
      });

      logger.info(`User ${socket.user?.username} disconnected`);

    } catch (error) {
      logger.error('Error handling disconnect:', error);
    }
  }

  // Utility method to get online users in a room
  async getOnlineUsersInRoom(roomId) {
    const room = await Room.findById(roomId).populate('members.user');
    if (!room) return [];

    const onlineUsers = room.members
      .filter(member => 
        this.connectedUsers.has(member.user._id.toString())
      )
      .map(member => member.user);

    return onlineUsers;
  }

  // Send notification to specific user
  sendToUser(userId, event, data) {
    const userConnection = this.connectedUsers.get(userId.toString());
    if (userConnection) {
      this.io.to(userConnection.socketId).emit(event, data);
    }
  }

  // Broadcast to all users in room
  broadcastToRoom(roomId, event, data) {
    this.io.to(roomId).emit(event, data);
  }
}

export default new SocketService();
