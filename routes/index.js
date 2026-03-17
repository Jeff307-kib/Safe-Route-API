import express from "express";
import tripRoutes from './trip-routes.js';
import userRoutes from './user-routes.js';
import emergencyContactRoutes from './emergency-contact-routes.js';
import notificationRoutes from './notification-routes.js';


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
router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/emergency-contacts', emergencyContactRoutes);
router.use('/notifications', notificationRoutes);



export default router;