// validators/emergency-contact-validators.js
import { body } from "express-validator";

export const contactValidators = [
    body('userId').isInt(),
    body('contactUserId').isInt().withMessage('contactUserId is required'), // Change this name
    body('relationship').notEmpty()
];