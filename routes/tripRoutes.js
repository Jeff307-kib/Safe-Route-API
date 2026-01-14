import express from 'express';
import { getTrips } from '../controllers/tripController.js';

const tripRouter = express.Router();

tripRouter
.route('/')
.get(getTrips);


export default tripRouter;