import express from 'express';
import { 
  sendMessage, 
  getMessages, 
  deleteMessage, 
  addReaction 
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../utils/validation.js';
import { messageValidation } from '../utils/validation.js';

const router = express.Router();

router.post('/', authenticate, validate(messageValidation), sendMessage);
router.get('/room/:roomId', authenticate, getMessages);
router.delete('/:messageId', authenticate, deleteMessage);
router.post('/:messageId/reaction', authenticate, addReaction);

export default router;
