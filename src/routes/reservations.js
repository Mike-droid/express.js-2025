import { Router } from 'express';
import authenticateToken from '../middlewares/auth.js';
import {
	createReservation_c,
	deleteReservation_c,
	getReservation_c,
	updateReservation_c,
} from '../controllers/reservationController.js';

const router = Router();

router.post('/', authenticateToken, createReservation_c);
router.get('/:id', authenticateToken, getReservation_c);
router.put('/:id', authenticateToken, updateReservation_c);
router.delete('/:id', authenticateToken, deleteReservation_c);

export default router;
