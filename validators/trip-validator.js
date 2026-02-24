import { body, param } from "express-validator";

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

        // body('currentStatus')
        //     .notEmpty()
        //     .withMessage('Status is required')
        //     .isIn(['Active', 'Emergency', 'Completed', 'Cancelled', 'Snoozed'])
        //     .withMessage('Invalid status type'),
    ],

    getById: [
        param('id')
            .isInt({min: 1})
            .withMessage('Invalid trip id')
    ],
}

export default tripValidators;