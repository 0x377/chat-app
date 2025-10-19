import express from 'express';
import authRoutes from './auth.js';
import messageRoutes from './messages.js';
import roomRoutes from './rooms.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/messages', messageRoutes);
router.use('/rooms', roomRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

export default router;
