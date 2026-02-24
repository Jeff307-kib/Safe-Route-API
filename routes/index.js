import express from "express";
import tripRoutes from './trip-routes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
router.use('/trips', tripRoutes);

export default router;