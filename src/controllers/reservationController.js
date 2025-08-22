import {
	getReservation_s,
	createReservation_s,
	updateReservation_s,
	deleteReservation_s,
} from '../services/reservationService.js';

export const createReservation_c = async (req, res) => {
	console.log("🚀 ~ createReservation_c ~ req:", req.body)
	try {
		const reservation = await createReservation_s(req.body);
		return res.status(201).json(reservation);
	} catch (error) {
		console.log("🚀 ~ createReservation_c ~ error:", error)
		res.status(400).json({ message: 'Error creating reservation' });
	}
};

export const getReservation_c = async (req, res) => {
	try {
		const reservation = await getReservation_s(req.params.id);
		if (!reservation) {
			return res.status(404).json({ message: 'Reservation not found' });
		}
		return res.status(200).json(reservation);
	} catch (error) {
		res.status(500).json({ message: 'Error retrieving reservation' });
	}
};
export const updateReservation_c = async (req, res) => {
	try {
		const updatedReservation = await updateReservation_s(
			req.params.id,
			req.body
		);
		if (!updatedReservation) {
			return res.status(404).json({ message: 'Reservation not found' });
		}
		return res.status(200).json(updatedReservation);
	} catch (error) {
		res.status(400).json({ message: 'Error updating reservation' });
	}
};

export const deleteReservation_c = async (req, res) => {
	try {
		const deleted = await deleteReservation_s(req.params.id);
		if (!deleted) {
			return res.status(404).json({ message: 'Reservation not found' });
		}
		return res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: 'Error deleting reservation' });
	}
};
