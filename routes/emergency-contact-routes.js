
import express from 'express';
import { EmergencyContactController } from '../controllers/emergency-contact-controller.js';
import { contactValidators } from '../validators/emergency-contact-validators.js';
import validate from '../middlewares/validate-middleware.js';

const router = express.Router();
const controller = new EmergencyContactController();

router.post('/', contactValidators, validate, controller.create);

export default router;