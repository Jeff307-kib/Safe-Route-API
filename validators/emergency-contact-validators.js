import { body } from "express-validator";

const contactValidator = {
    create: [
        body("contactUserId")
            .isInt()
            .withMessage("contactUserId must be an integer"),
        body("relationship")
            .isIn(['parent', 'friend', 'partner', 'colleague'])
            .withMessage("Invalid relationship type"),
        body("notes")
            .optional()
            .isString()
            .withMessage("Notes must be a string")
            .isLength({ max: 500 })
            .withMessage("Notes cannot exceed 500 characters")
    ],
    update: [
        body("relationship")
            .optional()
            .isIn(['parent', 'friend', 'partner', 'colleague'])
            .withMessage("Invalid relationship type"),
        body("notes")
            .optional()
            .isString()
            .isLength({ max: 500 })
    ]
};

export default contactValidator;