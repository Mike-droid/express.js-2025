import express, { json, urlencoded } from 'express';
import routes from './routes/index.js';
const app = express();
import { LoggerMiddleware } from './middlewares/logger.js';
import {errorHandler} from './middlewares/errorHandler.js';

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(LoggerMiddleware);
app.use(errorHandler);
app.use('/api', routes);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

export default app;
