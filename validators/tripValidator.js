import { body } from "express-validator";

export const tripValidators = {
    create: [
        body('startLocation.latitude').isFloat({ min: -90, max: 90 }),
        body('startLocation.longitude').isFloat({ min: -180, max: 180 }),
        body('destinationLocation.latitude').isFloat({ min: -90, max: 90 }),
        body('destinationLocation.longitude').isFloat({ min: -180, max: 180 }),
        body('durationMinutes').isInt({ min: 1 }),
        body('currentStatus').isString().notEmpty(),
    ]
}

export default tripValidators;