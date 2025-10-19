# Advanced real-time chat application backend by using Node.js

## Sample Description:

This is a production-ready chat backend that can be extended with additional features like video calls, push notifications, message search, and more. The architecture is modular and follows best practices for Node.js applications.

## Setup project:

1. Create back-end directory

    ```bash
    mkdir -p back-end
    cd back-end
    ```

2. Install project

    ```bash
    npm init
    npm install
    ```

3. Install packages

    ```shell
    "dependencies": {
        "express": "^4.18.2",
        "socket.io": "^4.7.2",
        "mongoose": "^7.5.0",
        "bcryptjs": "^2.4.3",
        "jsonwebtoken": "^9.0.2",
        "cors": "^2.8.5",
        "helmet": "^7.0.0",
        "express-rate-limit": "^6.10.0",
        "validator": "^13.11.0",
        "multer": "^1.4.5",
        "cloudinary": "^1.40.0",
        "redis": "^4.6.7",
        "joi": "^17.9.2",
        "winston": "^3.10.0",
        "dotenv": "^16.3.1",
        "compression": "^1.7.4"
    },
    "devDependencies": {
        "nodemon": "^3.0.1",
        "jest": "^29.6.2",
        "supertest": "^6.3.3"
    },
    "engines": {
        "node": ">=18.0.0"
    }
    ```

4. Run project

    ```shell
    "scripts": {
        "start": "node server.js",
        "dev": "nodemon server.js",
        "test": "NODE_ENV=test jest",
        "test:watch": "NODE_ENV=test jest --watch"
    }
    ```

  Production

    ```bash
    npm run start
    ```

  Development

    ```bash
    npm run dev
    ```

  Testing

    ```bash
    npm run test
    npm run test:watch
    ```

## Project Structure:

    ```shell
    back-end/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   ├── socket/
    │   ├── utils/
    │   └── app.js
    ├── tests/
    ├── package.json
    ├── .env
    └── server.js
    ```

## ENV File

    ```shell
    # .env
    NODE_ENV=development
    PORT=4000
    MONGODB_URI=mongodb://localhost:27017/chat-app
    JWT_SECRET=your-super-secret-jwt-key-change-in-production
    JWT_EXPIRES_IN=7d
    REDIS_URL=redis://localhost:6379
    CORS_ORIGIN=http://localhost:3000

    # Cloudinary (optional - for file uploads)
    CLOUDINARY_CLOUD_NAME=your-cloud-name
    CLOUDINARY_API_KEY=your-api-key
    CLOUDINARY_API_SECRET=your-api-secret
    ```

## Features Included:

✅ Real-time messaging with Socket.IO
✅ JWT authentication
✅ User management (register, login, profile)
✅ Room/Channel system
✅ Message reactions
✅ Typing indicators
✅ Read receipts
✅ File upload support (extensible)
✅ Rate limiting
✅ Comprehensive error handling
✅ Logging system
✅ Input validation
✅ Security middleware
✅ Database connection management
✅ Pagination
✅ Test setup

# ENDING...
