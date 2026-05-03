import { Router } from 'express';
import validate from '../../middleware/validate.middleware.js';
import verifyAuth from '../../middleware/auth.middleware.js';
import { register, login, getMe, getUsers } from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', verifyAuth, getMe);
router.get('/users', verifyAuth, getUsers);

export default router;
