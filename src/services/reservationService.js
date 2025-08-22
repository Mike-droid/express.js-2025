import { PrismaClient } from '../../generated/prisma/index.js';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export const createReservation_s = async (data) => {
	const conflict = await prisma.appointment.findFirst({
		where: {
			date: data.date,
			timeBlockId: data.timeBlockId,
		},
	});

	if (conflict) {
		throw new Error('Time slot already booked');
	}
	return await prisma.appointment.create({ data });
};
export const getReservation_s = async (id) => {
	return await prisma.appointment.findUnique({
		where: { id: parseInt(id, 10) },
	});
};
export const updateReservation_s = async (id, data) => {
	const conflict = await prisma.appointment.findFirst({
		where: {
			date: data.date,
			timeBlockId: data.timeBlockId,
			id: { not: parseInt(id, 10) },
		},
	});
	if (conflict) {
		throw new Error('Time slot already booked');
	}
	return await prisma.appointment.update({
		where: { id: parseInt(id, 10) },
		data,
	});
};
export const deleteReservation_s = async (id) => {
	return await prisma.appointment.delete({
		where: { id: parseInt(id, 10) },
	});
};
