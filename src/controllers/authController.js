import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req, res) => {
	try {
		const { email, password, name } = req.body;
		await registerUser(email, password, name);
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const token = await loginUser(email, password);
		res.status(200).json({ token });
	} catch (error) {
		return res.status(401).json({ error: error.message });
	}
};
