import {
	createTimeBlockService,
	listReservationsService,
} from '../services/adminService.js';

export const createTimeBlock = async (req, res) => {
	if (req.user.role !== 'ADMIN') {
		return res.status(403).json({ message: 'Forbidden' });
	}
	try {
		const { startTime, endTime } = req.body;
		const newTimeBlock = await createTimeBlockService(startTime, endTime);
		return res.status(201).json(newTimeBlock);
	} catch (error) {
		return res.status(500).json({ message: 'Error creating time block' });
	}
};

export const listReservations = async (req, res) => {
	if (req.user.role !== 'ADMIN') {
		return res.status(403).json({ message: 'Forbidden' });
	}
	try {
		const reservations = await listReservationsService();
		return res.status(200).json(reservations);
	} catch (error) {
		return res.status(500).json({ message: 'Error listing reservations' });
	}
};
