import tripService from "../services/trip-service.js";
import catchAsync from '../utils/catch-async.js';
import ApiResponse from "../utils/api-response.js";

export class TripController {
    create = catchAsync(async (req, res) => {
        const userId = req.user.user_id;

        const tripData = {
            ...req.body,
            user_id: userId
        }

        const trip = await tripService.createTrip(tripData);
        ApiResponse.created(res, trip, 'Trip created successfully');
    });

    getById = catchAsync(async (req, res) => {
        const { id } = req.params;
        const trip = await tripService.getTripById(id);
        ApiResponse.success(res, trip, 'Trip retrieved successfully');
    });

    getAllTrips = catchAsync(async (req, res) => {
        const { status, page, limit, sortBy } = req.query;
        const trips = await tripService.getAllTrips(status, page, limit, sortBy);
        const count = trips.length

        ApiResponse.success(res, { total: count, trips }, 'Trips retrieved successfully');
    });

    getMyTrips = catchAsync(async (req, res) => {
        const userId = req.user.user_id;

        const trips = await tripService.getUserTrips(userId);
        ApiResponse.success(res, trips, 'Trips retrieved successful');
    })

    markCompleteTrip = catchAsync(async (req, res) => {
        const { id } = req.params;
        const trip = await tripService.markCompleteTrip(id);
        ApiResponse.success(res, trip, 'Trip marked as complete');
    });
}

export default new TripController();