import pkg from 'jsonwebtoken';
const { verify } = pkg;

function authenticateToken(req, res, next) {
	const token = req.header('Authorization')?.split(' ')[1];
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ error: 'Forbidden', details: err.message });
		}
		req.user = user;
		next();
	});
}

export default authenticateToken;
