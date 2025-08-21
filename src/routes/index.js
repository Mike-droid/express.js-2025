import { Router } from 'express';
import authRouter from './auth.js';
import adminRouter from './admin.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);

export default router;
