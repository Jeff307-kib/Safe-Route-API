import Trip from "../models/Trip.js";
import AppError from '../utils/app-error.js';

export class TripService {
    async createTrip(tripData) {
        const maxExtensionMinutes = this.calculateMaxExtensionMinutes(tripData.durationMinutes);
        const currentStatus = 'Active'; // Trip status would only be Active when first created
        const trip = await Trip.create({...tripData, currentStatus, maxExtensionMinutes});
        return trip;
    }

    async getTripById(id) {
        const trip = await Trip.findById(id);

        if (!trip) {
            return new AppError('Trip not found', 404);
        }

        return trip;
    }

    async getAllTrips(status = 'Completed', page = 1, limit = 10, sortBy = 'created_at') {
        const offset = (page - 1) * limit;
        const trips = await Trip.findAll({status, limit, sortBy, offset});
        return trips;
    }

    calculateMaxExtensionMinutes(durationMinutes) {
        const duration = Number(durationMinutes);

        if (isNaN(durationMinutes) || durationMinutes <= 0) {
            return new AppError('Invalid trip duration', 400);
        }

        if (durationMinutes > 2880) {
            return new AppError('Trip duration cannot exceed 48 hours', 400);
        }

        const k = 11; // Increase the k value to get bigger number result
        let extensionMinutes = Math.round(k * Math.sqrt(durationMinutes)); 

        return extensionMinutes;
    }
}

export default new TripService();