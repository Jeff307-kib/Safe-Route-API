import express from 'express';
// import { getTrips } from '../controllers/tripController.js';
import tripController from '../controllers/tripController.js';
import tripValidators from '../validators/tripValidator.js';
import validate from '../middlewares/validate.middleware.js';

const router = express.Router();

// router
// .route('/')
// .get(getTrips);

router.post('/', tripValidators.create, validate, tripController.create);

export default router;