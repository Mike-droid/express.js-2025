const express = require('express');

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

app.listen(PORT, () => {
	console.log('working app on http://localhost:' + PORT);
});
