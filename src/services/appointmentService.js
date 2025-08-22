import { PrismaClient } from '../../generated/prisma/index.js';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export const createAppointment_s = async (userId, data) => {
	try {
		const conflict = await prisma.appointment.findFirst({
			where: {
				date: data.date,
				timeBlockId: data.timeBlockId,
				userId: parseInt(userId, 10),
			},
		});
		if (conflict) {
			throw new Error('Appointment conflict');
		}
		return prisma.appointment.create({
			data: {
				...data,
				userId: parseInt(userId, 10),
			},
		});
	} catch (error) {
		console.log('🚀 ~ createAppointment_s ~ error:', error);
		throw new Error('Error creating appointment');
	}
};
export const getUserAppointments = async (userId) => {
	try {
		const appointments = await prisma.appointment.findMany({
			where: { userId: parseInt(userId) },
			include: {
				timeBlock: true,
			},
		});
		return appointments;
	} catch (error) {
		throw new Error('Error retrieving appointments');
	}
};
export const updateAppointment_s = async (appointmentId, data) => {
	try {
		const conflict = await prisma.appointment.findFirst({
			where: {
				date: data.date,
				timeBlockId: data.timeBlockId,
				id: { not: parseInt(appointmentId, 10) },
			},
		});
		if (conflict) {
			throw new Error('Appointment conflict');
		}
		return prisma.appointment.update({
			where: { id: parseInt(appointmentId, 10) },
			data,
		});
	} catch (error) {
		throw new Error('Error updating appointment');
	}
};
export const deleteAppointment_s = async (appointmentId) => {
	try {
		return prisma.appointment.delete({
			where: { id: parseInt(appointmentId, 10) },
		});
	} catch (error) {
		throw new Error('Error deleting appointment');
	}
};
