// import pool from "../config/dbConfig.js";
// import catchAsync from "../utils/catchAsync.js";
// import sendResponse from "../utils/sendResponse.js";

// export const getTrips = catchAsync(async (req, res, next) => {
//     const result = await pool.query("SELECT * FROM trips");
//     console.log('All Trips: ', result.rows);
//     sendResponse(res, result.rows);
// })

import tripService from "../services/tripService.js";
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from "../utils/ApiResponse.js";

export class TripController {
    create = catchAsync(async (req, res, next) => {
        const trip = await tripService.createTrip(req.body);
        ApiResponse.created(res, trip, 'Trip created successfully!');
    });
}

export default new TripController();