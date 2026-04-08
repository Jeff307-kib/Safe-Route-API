import snoozeService from "../services/snooze-service.js";
import catchAsync from "../utils/catch-async.js";
import ApiResponse from "../utils/api-response.js";

export class SnoozeController {
    snooze = catchAsync(async (req, res) => {
        const userId = req.user.user_id;
        const { tripId } = req.params;
        const { requestedDuration, reason, currentLocation } = req.body;

        const result = await snoozeService.snoozeTrip(
            parseInt(tripId),
            userId,
            { requestedDuration, reason, currentLocation }
        );

        ApiResponse.created(res, result, 'Trip snoozed successfully');
    });

    resume = catchAsync(async (req, res) => {
        const userId = req.user.user_id;
        const { tripId } = req.params;

        const result = await snoozeService.resumeTrip(parseInt(tripId), userId);

        ApiResponse.success(res, result, 'Trip monitoring has resumed.');
    });
}

export default new SnoozeController();
