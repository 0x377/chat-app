# Advanced real-time chat application frontend by using React.js

## Sample Description:

This frontend provides a professional, modern chat interface with smooth animations and excellent user experience. The code is modular, maintainable, and follows React best practices.

## Setup project:

1. Create back-end directory

    ```bash
    npm create vite@latest front-end -- --template react
    cd front-end
    ```

2. Install project

    ```bash
    npm install
    ```

3. Install packages

    ```shell
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.15.0",
        "socket.io-client": "^4.7.2",
        "axios": "^1.5.0",
        "framer-motion": "^10.16.1",
        "bootstrap": "^5.3.1",
        "react-bootstrap": "^2.8.0",
        "react-hot-toast": "^2.4.1",
        "react-icons": "^4.11.0",
        "date-fns": "^2.30.0",
        "clsx": "^2.0.0",
        "lucide-react": "^0.288.0"
    }
    ```

4. Run project

    ```shell
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "lint": "eslint .",
        "preview": "vite preview"
    }
    ```

  Production

    ```bash
    npm run build
    ```

  Development

    ```bash
    npm run dev
    ```

  Run after build

    ```bash
    npm run preview
    ```

## Project Structure:

    ```shell
    front-end/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── chat/
    │   │   ├── common/
    │   │   └── layout/
    │   ├── contexts/
    │   ├── hooks/
    │   ├── services/
    │   ├── utils/
    │   ├── styles/
    │   └── assets/
    ├── package.json
    └── vite.config.js
    ```

## ENV File

    ```shell
    # .env
    VITE_API_URL=http://localhost:3001
    VITE_APP_NAME=ChatApp
    ```

## Features Included:

✅ Modern React with Hooks & Context API
✅ Real-time messaging with Socket.IO
✅ JWT Authentication
✅ Room-based chat system
✅ Advanced animations with Framer Motion
✅ Responsive design with Bootstrap
✅ Dark theme with modern UI
✅ Typing indicators
✅ Message reactions & replies
✅ File attachment support
✅ Search functionality
✅ Online/offline status
✅ Read receipts
✅ Error handling & loading states
✅ Optimized performance

# ENDING...
