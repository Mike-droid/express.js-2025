const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
console.log("🚀 ~ PORT:", PORT)

app.get('/', (req, res) => {
	res.send(`
		<h1>Welcome to my Express App!</h1>
		<p>Running on port ${PORT}</p>
		<h2>Just a text for testing node...</h2>
		<p>Visit <a href="/about">About Page</a></p>`);
});

app.listen(PORT, () => {
	console.log('working app on http://localhost:' + PORT);
});
