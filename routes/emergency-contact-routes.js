import express from 'express';
import contactController from '../controllers/emergency-contact-controller.js';

const router = express.Router();
router.post('/', contactController.create);
router.get('/:userId', contactController.getAll);

export default router;