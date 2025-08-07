const express = require('express');
const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, 'users.json');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
	console.log('working app on http://localhost:' + PORT);
});
