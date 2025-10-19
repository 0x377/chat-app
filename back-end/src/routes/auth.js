// src/routes/auth.js
import express from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../utils/validation.js';
import { registerValidation, loginValidation } from '../utils/validation.js';

const router = express.Router();

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;
