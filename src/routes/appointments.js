import { Router } from 'express';
import authenticateToken from '../middlewares/auth.js';
import {
	updateAppointment_c,
	deleteAppointment_c,
	createAppointment_c,
	listAppointments_c,
} from '../controllers/appointmentController.js';
const router = Router();

router.get('/:id/appointments', authenticateToken, listAppointments_c);
router.post('/:id/appointments', authenticateToken, createAppointment_c);
router.put(
	'/:id/appointments/:appointmentId',
	authenticateToken,
	updateAppointment_c
);
router.delete(
	'/:id/appointments/:appointmentId',
	authenticateToken,
	deleteAppointment_c
);

export default router;
