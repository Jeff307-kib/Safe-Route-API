import express from 'express';
import controller from '../controllers/emergency-contact-controller.js';
import contactValidator from '../validators/emergency-contact-validators.js';
import validate from '../middlewares/validate-middleware.js';
import { protect } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/', protect, contactValidator.create, validate, controller.create);
router.get('/:id', protect, controller.getById);
router.get('/user/:userId', protect, controller.getByUser);
router.patch('/:id', protect, controller.update);
router.delete('/:id', protect, controller.delete);

export default router;