import express from 'express';
// import { getTrips } from '../controllers/tripController.js';
import tripController from '../controllers/trip-controller.js';
import tripValidators from '../validators/trip-validator.js';
import validate from '../middlewares/validate-middleware.js';

const router = express.Router();

// router
// .route('/')
// .get(getTrips);

router.get('/', tripValidators.getAll, validate, tripController.getAllTrips);
router.get('/:id', tripValidators.getById, validate, tripController.getById);
router.post('/', tripValidators.create, validate, tripController.create);

export default router;