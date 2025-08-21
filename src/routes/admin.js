import { Router } from 'express';
import {
	createTimeBlock,
	listReservations,
} from '../controllers/adminController.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

router.post('/time-block', authenticateToken, createTimeBlock);
router.get('/reservations', authenticateToken, listReservations);

export default router;
