import express from 'express';
import tripRouter from './routes/tripRoutes.js';
import GlobalErrorHandler from './middlewares/error.middleware.js';
const app = express();

app.use(express.json());

app.use('/api/v1/trips', tripRouter);

app.use(GlobalErrorHandler);

export default app;