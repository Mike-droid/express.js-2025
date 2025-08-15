const express = require('express');
const LoggerMiddleware = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const authenticateToken = require('./middlewares/auth');
const { PrismaClient } = require('./generated/prisma');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const { seedDatabase } = require('./seed');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(LoggerMiddleware);
app.use(errorHandler);
//app.use(authenticateToken);

const PORT = process.env.PORT || 3000;

app.get('/error', (req, res, next) => {
	next(new Error('This is a forced error for testing purposes'));
});

app.get('/db-users', async (req, res) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
			},
		});
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching users from database' });
	}
});

app.post('/db-users', async (req, res) => {
	try {
		const result = await seedDatabase();
		res.status(201).json({
			message: 'Database seeded successfully',
			count: result.count,
		});
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Error seeding database', details: error.message });
	}
});

app.post('/db-user', async (req, res) => {
	try {
		const { name, email, password, role } = req.body;

		// Validación básica
		if (!name || !email || !password) {
			return res.status(400).json({
				error: 'Name, email and password are required',
			});
		}

		// Validar role si se proporciona
		if (role && !['ADMIN', 'USER'].includes(role)) {
			return res.status(400).json({
				error: 'Role must be either ADMIN or USER',
			});
		}

		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				password,
				role: role || 'USER', // Por defecto USER si no se especifica
			},
		});

		// No devolver la password en la respuesta
		const { password: _, ...userResponse } = newUser;

		res.status(201).json(userResponse);
	} catch (error) {
		if (error.code === 'P2002') {
			return res.status(400).json({
				error: 'Email already exists',
			});
		}

		console.error('Error creating user:', error);
		res.status(500).json({
			error: 'Error creating user',
		});
	}
});

app.delete('/db-users', async (req, res) => {
	try {
		await prisma.user.deleteMany();
		res.status(200).json({ message: 'All users deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Error deleting users from database' });
	}
});

app.get('/protected-route', authenticateToken, (req, res) => {
	res.json({ message: 'This is a protected route' });
});

app.post('/register', async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json({ error: 'All fields are required' });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const user = await prisma.user.create({
			data: { name, email, password: hashedPassword, role: 'USER' },
		});
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Error registering user', details: error.message });
	}
});

app.listen(PORT, () => {
	console.log('working app on http://localhost:' + PORT);
});
