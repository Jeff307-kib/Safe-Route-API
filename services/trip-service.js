import Trip from "../models/Trip.js";
import AppError from '../utils/app-error.js';
import pool from "../config/db-config.js";
import ContactHelper from "../utils/contact-helper.js";

export class TripService {
    async createTrip(tripData) {

        const { selectedContactIds, ...restTripData } = tripData;
        
        const maxExtensionMinutes = this.calculateMaxExtensionMinutes(tripData.durationMinutes);
        const currentStatus = 'Active'; // Trip status would only be Active when first created
        const trip = await Trip.create({ ...restTripData, currentStatus, maxExtensionMinutes });

        if (selectedContactIds && selectedContactIds.length > 0) {
            const bulkData = ContactHelper.prepareBulkTripContacts(trip.trip_id, selectedContactIds);
            
            for (const record of bulkData) {
                await pool.query(
                    'INSERT INTO trip_emergency_contacts (trip_id, contact_id) VALUES ($1, $2)',
                    record
                );
            }
        }
        return trip;
    }

    async getTripById(id) {
        const trip = await Trip.findById(id);
        console.log('GET TRIP BY ID', trip)
        if (!trip) {
            throw new AppError('Trip not found', 404);
        }

        return trip;
    }

    async getAllTrips(status = 'Completed', page = 1, limit = 10, sortBy = 'created_at') {
        const offset = (page - 1) * limit;
        const trips = await Trip.findAll({ status, limit, sortBy, offset });
        return trips;
    }

    async getUserTrips(userId) {
        const trips = await Trip.findByUserId(userId);

        if(!trips || trips.length === 0) {
            return [];
        }

        return trips;
    }

    async markCompleteTrip(id) {
        const existingTrip = await Trip.findById(id);

        if (!existingTrip) {
            throw new AppError('Trip not found', 404);
        }

        if (existingTrip.current_status === 'Completed') {
            throw new AppError('This trip has already been completed', 400);
        }

        if (existingTrip.current_status === 'Cancelled') {
            throw new AppError('Cannot complete a cancelled trip', 400);
        }

        const trip = await Trip.complete(id);

        if (!trip) {
            throw new AppError('Failed to complete trip', 409);
        }

        return trip;
    }

    calculateMaxExtensionMinutes(durationMinutes) {
        const duration = Number(durationMinutes);

        if (isNaN(durationMinutes) || durationMinutes <= 0) {
            throw new AppError('Invalid trip duration', 400);
        }

        if (durationMinutes > 2880) {
            throw new AppError('Trip duration cannot exceed 48 hours', 400);
        }

        const k = 11; // Increase the k value to get bigger number result
        let extensionMinutes = Math.round(k * Math.sqrt(durationMinutes));

        return extensionMinutes;
    }
}

export default new TripService();