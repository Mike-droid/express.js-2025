const express = require('express');
const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, 'users.json');
const LoggerMiddleware = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(LoggerMiddleware);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send(`
		<h1>Welcome to my Express App!</h1>
		<p>Running on port ${PORT}</p>
		<h2>Just a text for testing node...</h2>
		<p>Visit <a href="/about">About Page</a></p>`);
});

app.get('/users/:id', (req, res) => {
	const userId = req.params.id;
	res.send(`User ID: ${userId}`);
});

app.get('/search', (req, res) => {
	const terms = req.query.terms || 'No Terms Found';
	const category = req.query.category || 'All Categories';

	res.send(`
		<h2>Search results:</h2>
		<p>Terms: ${terms}</p>
		<p>Category: ${category}</p>
	`);
});

app.post('/form', (req, res) => {
	const { name } = req.body || 'anonymous';
	const { email } = req.body || 'no email provided';
	res.json({
		message: 'Form submitted successfully',
		data: {
			name: name,
			email: email,
		},
	});
});

app.post('/api/data', (req, res) => {
	const data = req.body;
	if (!data || Object.keys(data).length === 0) {
		return res.status(400).json({ error: 'No data provided' });
	}
	res.status(201).json({ message: 'Data received', data: data });
});

app.get('/users', (req, res) => {
	fs.readFile(usersFilePath, 'utf-8', (err, data) => {
		if (err) {
			return res.status(500).json({ error: 'Error reading users file' });
		}
		try {
			const users = JSON.parse(data);
			res.json(users);
		} catch (parseError) {
			res.status(500).json({ error: 'Error parsing users data' });
		}
	});
});

app.post('/users', (req, res) => {
	const newUser = req.body;
	const newUserId = Date.now(); // Simple ID generation based on timestamp
	newUser.id = newUserId;
	if (!newUser || !newUser.name || !newUser.email) {
		return res.status(400).json({ error: 'Name and email are required' });
	}

	if (newUser.name.length < 3) {
		return res
			.status(400)
			.json({ error: 'Name must be at least 3 characters long' });
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(newUser.email)) {
		return res.status(400).json({ error: 'Invalid email format' });
	}

	fs.readFile(usersFilePath, 'utf-8', (err, data) => {
		if (err) {
			return res.status(500).json({ error: 'Error reading users file' });
		}
		try {
			const users = JSON.parse(data);
			users.push(newUser);
			fs.writeFile(
				usersFilePath,
				JSON.stringify(users, null, 2),
				(writeErr) => {
					if (writeErr) {
						return res
							.status(500)
							.json({ error: 'Error writing to users file' });
					}
					res
						.status(201)
						.json({ message: 'User added successfully', user: newUser });
				}
			);
		} catch (parseError) {
			res.status(500).json({ error: 'Error parsing users data' });
		}
	});
});

app.put('/users/:id', (req, res) => {
	const userId = parseInt(req.params.id, 10);
	const updatedUser = req.body;

	if (!updatedUser || !updatedUser.name || !updatedUser.email) {
		return res.status(400).json({ error: 'Name and email are required' });
	}

	if (updatedUser.name.length < 3) {
		return res
			.status(400)
			.json({ error: 'Name must be at least 3 characters long' });
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(updatedUser.email)) {
		return res.status(400).json({ error: 'Invalid email format' });
	}

	fs.readFile(usersFilePath, 'utf-8', (err, data) => {
		if (err) {
			return res.status(500).json({ error: 'Error reading users file' });
		}
		try {
			const users = JSON.parse(data);
			const userIndex = users.findIndex((user) => user.id === userId);
			if (userIndex === -1) {
				return res.status(404).json({ error: 'User not found' });
			}
			users[userIndex] = { ...users[userIndex], ...updatedUser };
			fs.writeFile(
				usersFilePath,
				JSON.stringify(users, null, 2),
				(writeErr) => {
					if (writeErr) {
						return res
							.status(500)
							.json({ error: 'Error writing to users file' });
					}
					res.status(200).json({
						message: 'User updated successfully',
						user: users[userIndex],
					});
				}
			);
		} catch (parseError) {
			res.status(500).json({ error: 'Error parsing users data' });
		}
	});
});

app.delete('/users/:id', (req, res) => {
	const userId = parseInt(req.params.id, 10);
	fs.readFile(usersFilePath, 'utf-8', (err, data) => {
		if (err) {
			return res.status(500).json({ error: 'Error reading users file' });
		}
		try {
			const users = JSON.parse(data);
			const userIndex = users.findIndex((user) => user.id === userId);
			if (userIndex === -1) {
				return res.status(404).json({ error: 'User not found' });
			}
			users.splice(userIndex, 1);
			fs.writeFile(
				usersFilePath,
				JSON.stringify(users, null, 2),
				(writeErr) => {
					if (writeErr) {
						return res
							.status(500)
							.json({ error: 'Error writing to users file' });
					}
					res.status(200).json({
						message: 'User deleted successfully',
					});
				}
			);
		} catch (parseError) {
			res.status(500).json({ error: 'Error parsing users data' });
		}
	});
});

app.get('/error', (req, res, next) => {
	next(new Error('This is a forced error for testing purposes'));
});

app.get('/db-users', async (req, res) => {
	try {
		const users = await prisma.user.findMany();
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching users from database' });
	}
});

app.post('/db-users', async (req, res) => {
	const { name, email } = req.body;
	if (!name || !email) {
		return res.status(400).json({ error: 'Name and email are required' });
	}

	if (name.length < 3) {
		return res
			.status(400)
			.json({ error: 'Name must be at least 3 characters long' });
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({ error: 'Invalid email format' });
	}

	try {
		const newUser = await prisma.user.create({
			data: {
				name,
				email,
			},
		});
		res
			.status(201)
			.json({ message: 'User created successfully', user: newUser });
	} catch (error) {
		if (error.code === 'P2002') {
			return res.status(400).json({ error: 'Email already exists' });
		}
		res.status(500).json({ error: 'Error creating user in database' });
	}
});

app.listen(PORT, () => {
	console.log('working app on http://localhost:' + PORT);
});
