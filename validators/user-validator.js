import { body, param, query } from "express-validator";

export const userValidators = {
    create: [
        body('fullName')
            .trim()
            .notEmpty()
            .withMessage('Full name is required')
            .isLength({ max: 255 })
            .withMessage('Full name must be under 255 characters'),

        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),

        body('phoneNumber')
            .trim()
            .notEmpty()
            .withMessage('Phone number is required')
            .matches(/^\+?[1-9]\d{1,14}$/)
            .withMessage('Invalid phone number format (E.164 recommended)'),

        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
    ],

    getById: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid user id')
    ],

    getAll: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be at least 1')
            .toInt(),

        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
            .toInt()
    ],

    update: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid user id'),
        
        body('fullName')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Full name cannot be empty'),

        body('phoneNumber')
            .optional()
            .trim()
            .matches(/^\+?[1-9]\d{1,14}$/)
            .withMessage('Invalid phone number format')
    ]
};

export default userValidators;