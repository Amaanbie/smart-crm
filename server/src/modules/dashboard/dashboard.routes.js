import { Router } from 'express';
import verifyAuth from '../../middleware/auth.middleware.js';
import { getSummary } from './dashboard.controller.js';

const router = Router();
router.use(verifyAuth);
router.get('/summary', getSummary);

export default router;
