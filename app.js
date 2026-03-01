import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
import GlobalErrorHandler from './middlewares/error-middleware.js';
const app = express();

app.use(cors());

// Body parser middleware
app.use(express.json());

// API routes
app.use('/api/v1', routes);

// 404 routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: 'Route not found'
        }
    });
});

app.use((req, res, next) => {
    console.log(`Inbound Request: ${req.method} ${req.originalUrl}`);
    next();
});

app.use(GlobalErrorHandler);


export default app;