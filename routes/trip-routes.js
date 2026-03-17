import express from 'express';
// import { getTrips } from '../controllers/tripController.js';
import tripController from '../controllers/trip-controller.js';
import tripEmergencyController from "../controllers/trip-emergency-contact-controller.js";
import tripValidators from '../validators/trip-validator.js';
import validate from '../middlewares/validate-middleware.js';
import { protect } from '../middlewares/auth-middleware.js';



const router = express.Router();

// router
// .route('/')
// .get(getTrips);

router.post(
    '/', 
    protect, 
    tripValidators.create, 
    validate, 
    tripController.create 
);

router.get(
    '/my-trips', 
    protect, 
    tripController.getMyTrips
);

router.get(
    '/:id', 
    tripValidators.getById, 
    validate, 
    tripController.getById
);

router.post(
    '/', 
    protect, 
    tripValidators.create, 
    validate, 
    tripController.create
);

router.patch(
    '/:id', 
    tripValidators.getById, 
    validate, 
    tripController.markCompleteTrip
);



router.post(
    '/:tripId/emergency-contacts', 
    protect, 
    tripEmergencyController.assignContacts 
);

router.get(
    '/:tripId/emergency-contacts', 
    protect, 
    tripEmergencyController.getTripContacts 
);

router.delete(
    '/:tripId/emergency-contacts/:contactId', 
    protect, 
    tripEmergencyController.removeContact 
);

export default router;