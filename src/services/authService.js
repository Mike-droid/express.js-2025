import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import { PrismaClient } from '../../generated/prisma/index.js';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export const registerUser = async (email, password, name) => {
	const hashedPassword = await hash(password, 10);
	const newUser = await prisma.user.create({
		data: { email, password: hashedPassword, name, role: 'USER' },
	});
	return newUser;
};

export const loginUser = async (email, password) => {
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw new Error('Invalid email or password');
	}

	const isPasswordValid = await compare(password, user.password);
	if (!isPasswordValid) {
		throw new Error('Invalid email or password');
	}

	const token = sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
		expiresIn: '4h',
	});
	return token;
};
