import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';

class Database {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    try {
      if (this.isConnected) return;

      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      await mongoose.connect(env.MONGODB_URI, options);
      this.isConnected = true;
      
      logger.info('✅ MongoDB connected successfully');
      
      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        this.isConnected = false;
      });

      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      });

    } catch (error) {
      logger.error('MongoDB connection failed:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info('MongoDB disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting MongoDB:', error);
    }
  }
}

export default new Database();
