import { body, param } from "express-validator";

export const snoozeValidators = {
    snooze: [
        param('tripId')
            .isInt({ min: 1 })
            .withMessage('Invalid trip ID'),

        body('requestedDuration')
            .isInt({ min: 1, max: 15 })
            .withMessage('Requested duration must be between 1 and 15 minutes'),

        body('reason')
            .optional()
            .isString()
            .withMessage('Reason must be a string')
            .isLength({ max: 255 })
            .withMessage('Reason must not exceed 255 characters'),

        body('currentLocation.lat')
            .optional()
            .isFloat({ min: -90, max: 90 })
            .withMessage('Latitude must be between -90 and 90'),

        body('currentLocation.lng')
            .optional()
            .isFloat({ min: -180, max: 180 })
            .withMessage('Longitude must be between -180 and 180'),
    ],

    resume: [
        param('tripId')
            .isInt({ min: 1 })
            .withMessage('Invalid trip ID'),
    ]
};

export default snoozeValidators;
