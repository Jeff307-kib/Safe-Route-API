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

  login: [
    body('phoneNumber')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
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
      .toInt(),

    query('sortBy')
      .optional()
      .isIn(['created_at', 'duration_minutes', 'trip_id'])
      .withMessage('Invalid sort field'),
  ],

  update: [
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
  ],

  updateDetails: [
    body('date_of_birth')
      .optional()
      .isISO8601()
      .withMessage('Please provide a valid date (YYYY-MM-DD)')
      .custom((value) => {
        if (new Date(value) > new Date()) {
          throw new Error('Date of birth cannot be in the future');
        }
        return true;
      }),

    body('blood_type')
      .optional()
      .toUpperCase()
      .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .withMessage('Invalid blood type. Must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-'),

    body('medical_note')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Medical note cannot exceed 500 characters')
  ]
};

export default userValidators;