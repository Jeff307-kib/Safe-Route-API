// validators/emergency-contact-validators.js
import { body } from "express-validator";

const contactValidators = {
    create: [
        body('contactUserId').isInt().withMessage('Contact UserId is required'),
        body('relationship').notEmpty()
    ]
}

export default contactValidators;