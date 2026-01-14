import pool from "../config/dbConfig.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

export const getTrips = catchAsync(async (req, res, next) => {
    const result = await pool.query("SELECT * FROM trips");
    console.log('All Trips: ', result.rows);
    sendResponse(res, result.rows);
})