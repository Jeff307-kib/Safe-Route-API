import Trip from "../models/Trip.js";
import TripEmergencyContact from "../models/TripEmergencyContact.js";
import EmergencyContact from "../models/EmergencyContact.js";
import AppError from '../utils/app-error.js';
import pool from "../config/db-config.js";
import notificationService from "./notification-service.js";


export class TripService {
    async createTrip(tripData) {
        // 1. Destructure and remove duplicates from selectedContactIds
        let { selectedContactIds, userId, ...restTripData } = tripData;

        if (selectedContactIds && Array.isArray(selectedContactIds)) {
            selectedContactIds = [...new Set(selectedContactIds)];
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 2. Original calculation and status logic
            const maxExtensionMinutes = this.calculateMaxExtensionMinutes(tripData.durationMinutes);
            const currentStatus = 'Active';

            // 3. Create trip using preserved original model call
            const trip = await Trip.create({
                ...restTripData,
                currentStatus,
                maxExtensionMinutes,
                user_id: userId
            }, client);

            // 4. Link contacts only if unique list has items
            if (selectedContactIds && selectedContactIds.length > 0) {
                // Preserved validation logic
                // const userContacts = await EmergencyContact.findAllContactIdsForUser(userId, client);

                // if (!userContacts || userContacts.length === 0) {
                //     throw new AppError('No contact found', 404);
                // }

                const userContactIds = await EmergencyContact.findAllContactIdsForUser(userId, client);

                if (!userContactIds || userContactIds.length === 0 ) {
                    throw new AppError('You do not have any emergency contact', 404);
                }

                const invalidContacts = selectedContactIds.filter(id => !userContactIds.includes(id));
                console.log(`User ID : ${userId}, Contacts : ${userContactIds}, Invalid Contacts : ${invalidContacts}`)

                if (invalidContacts.length > 0) {
                    throw new AppError(`Invalid contact IDs: ${invalidContacts.join(', ')}`, 400);
                }

                // Call bulkCreate with the cleaned unique list
                await TripEmergencyContact.bulkCreate(trip.trip_id, selectedContactIds, client);

                await Promise.all(selectedContactIds.map(contactId =>
                    notificationService.createNotification({
                        recipientId: contactId,
                        referenceId: trip.trip_id, 
                        referenceType: 'TRIP_START',
                        message: `Your contact has started a trip and selected you as an emergency contact.`
                    }, client)
                ));
            }

            await client.query('COMMIT');
            return trip;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
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

        if (!trips || trips.length === 0) {
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