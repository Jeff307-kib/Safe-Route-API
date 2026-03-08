import { body, param, query } from "express-validator";

export const tripValidators = {
    create: [
        body('startLocation.latitude')
            .isFloat({ min: -90, max: 90 })
            .withMessage('Latitude must be between -90 and 90'),

        body('startLocation.longitude')
            .isFloat({ min: -180, max: 180 })
            .withMessage('Longitude must be between -180 and 180'),

        body('destinationLocation.latitude')
            .isFloat({ min: -90, max: 90 })
            .withMessage('Latitude must be between -90 and 90'),

        body('destinationLocation.longitude')
            .isFloat({ min: -180, max: 180 })
            .withMessage('Longitude must be between -180 and 180'),

        body('durationMinutes')
            .isInt({ min: 5 })
            .withMessage('Duration must be at least 5 minutes'),

        body('selectedContactIds')
            .exists()
            .withMessage('Contact must be selected to create a trip')
            .bail()
            .isArray()
            .withMessage('Must be arrary')
            .bail()
            .isArray({ min: 1 })
            .withMessage('At least one emergency contact must be selected')
            .bail()
            .custom((ids) => {
                if (!ids.every(Number.isInteger)) {
                    throw new Error('All contact IDs must be integers');
                }

                const uniqueIds = new Set(ids);
                if (uniqueIds.size !== ids.length) {
                     throw new Error('Duplicate emergency contacts are not allowed');
                 }    
                return true;
            }),

        // body('currentStatus')
        //     .notEmpty()
        //     .withMessage('Status is required')
        //     .isIn(['Active', 'Emergency', 'Completed', 'Cancelled', 'Snoozed'])
        //     .withMessage('Invalid status type'),
    ],

    getById: [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Invalid trip id')
    ],

    getAll: [
        query('status')
            .optional()
            .isIn(['Completed', 'Active', 'Emergency', 'Cancelled', 'Snoozed'])
            .withMessage('Invalid status type'),

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
            .isIn(['created_at', 'full_name', 'email', 'phone_number'])
            .withMessage('Invalid sort field'),
    ]
}

export default tripValidators;