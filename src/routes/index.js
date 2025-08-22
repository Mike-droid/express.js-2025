import { Router } from 'express';
import authRouter from './auth.js';
import adminRouter from './admin.js';
import reservations from './reservations.js';
import appointments from './appointments.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/reservations', reservations);
router.use('/users', appointments);

export default router;
