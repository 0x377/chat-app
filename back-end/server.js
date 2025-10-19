// server.js
import Application from './src/app.js';

const app = new Application();
app.start().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
