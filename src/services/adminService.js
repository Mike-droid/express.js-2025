import { PrismaClient } from '../../generated/prisma/index.js';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export const createTimeBlockService = async (startTime, endTime) => {
	const newTimeBlock = await prisma.timeBlock.create({
		data: {
			startTime: new Date(startTime),
			endTime: new Date(endTime),
		},
	});
	return newTimeBlock;
};

export const listReservationsService = async () => {
	const reservations = await prisma.appointment.findMany({
		include: {
			user: true,
			timeBlock: true,
		},
	});
	return reservations;
};
