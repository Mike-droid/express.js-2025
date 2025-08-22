import {
	createAppointment_s,
	deleteAppointment_s,
	getUserAppointments,
	updateAppointment_s,
} from '../services/appointmentService.js';

export const createAppointment_c = async (req, res) => {
	try {
		const userId = req.params.id;
		const appointment = await createAppointment_s(userId, req.body);
		return res.status(201).json(appointment);
	} catch (error) {
		throw new Error('Error creating appointment');
	}
};
export const listAppointments_c = async (req, res) => {
	try {
		const userId = req.params.id;
		const appointments = await getUserAppointments(userId);
		return res.status(200).json(appointments);
	} catch (error) {
		return res.status(500).json({ message: 'Error retrieving appointments' });
	}
};
export const updateAppointment_c = async (req, res) => {
	try {
		const { appointmentId } = req.params;
		const updatedAppointment = await updateAppointment_s(
			appointmentId,
			req.body
		);
		return res.status(200).json(updatedAppointment);
	} catch (error) {
		throw new Error('Error updating appointment');
	}
};
export const deleteAppointment_c = async (req, res) => {
	try {
		const { appointmentId } = req.params;
		await deleteAppointment_s(appointmentId);
		return res.status(204).send();
	} catch (error) {
		throw new Error('Error deleting appointment');
	}
};
