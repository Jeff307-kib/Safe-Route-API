import tripService from "../services/trip-service.js";
import catchAsync from '../utils/catch-async.js';
import ApiResponse from "../utils/api-response.js";

export class TripController {
    create = catchAsync(async (req, res, next) => {
        const trip = await tripService.createTrip(req.body);
        ApiResponse.created(res, trip, 'Trip created successfully');
    });

    getById = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const trip = await tripService.getTripById(id);
        ApiResponse.success(res, trip, 'Trip retrieved successfully');
    });
}

export default new TripController();