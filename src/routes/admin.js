import { Router } from 'express';
import {
	createTimeBlock,
	listReservations,
} from '../controllers/adminController.js';

const router = Router();

router.post('/time-blocks', createTimeBlock);
router.get('/reservations', listReservations);

export default router;