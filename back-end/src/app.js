import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import env from './config/env.js';
import database from './config/database.js';
import routes from './routes/index.js';
import logger from './utils/logger.js';

class Application {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use(limiter);

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  setupRoutes() {
    // API routes
    this.app.use('/api', routes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });

    // Global error handler
    this.app.use((error, req, res, next) => {
      logger.error('Unhandled error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(env.NODE_ENV === 'development' && { error: error.message })
      });
    });
  }

  async start() {
    try {
      // Connect to database
      await database.connect();
      
      // Start server
      const server = this.app.listen(env.PORT, () => {
        logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      });

      // Initialize socket service
      import('./socket/socketService.js').then(module => {
        module.default.initialize(server);
      });

      return server;

    } catch (error) {
      logger.error('Failed to start application:', error);
      process.exit(1);
    }
  }
}

export default Application;
