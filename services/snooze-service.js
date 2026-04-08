import SnoozeDetail from "../models/Snooze-Details.js";
import Trip from "../models/Trip.js";
import AppError from "../utils/app-error.js";
import pool from "../config/db-config.js";

const MAX_SNOOZE_COUNT = 3;
const SNOOZE_INCREMENT_MINUTES = 15;
const MAX_TOTAL_SNOOZE_MINUTES = 45;

export class SnoozeService {
    async snoozeTrip(tripId, userId, { requestedDuration, reason, currentLocation }) {
        // 1. Fetch trip and verify ownership
        const trip = await Trip.findById(tripId);

        if (!trip) {
            throw new AppError('Trip not found', 404);
        }

        if (trip.user_id !== userId) {
            throw new AppError('You are not authorized to snooze this trip', 403);
        }

        // 2. Verify trip is in a snoozable state
        if (trip.current_status !== 'Active') {
            throw new AppError('Trip must be active to snooze', 400);
        }

        // 3. Check snooze count limit (max 3 times / 45 minutes total)
        const snoozeCount = trip.snooze_count || 0;

        if (snoozeCount >= MAX_SNOOZE_COUNT) {
            throw new AppError(`Maximum snooze limit reached (${MAX_SNOOZE_COUNT} times / ${MAX_TOTAL_SNOOZE_MINUTES} minutes)`, 400);
        }

        // 4. Calculate effective snooze duration
        let effectiveDuration = Math.min(requestedDuration, SNOOZE_INCREMENT_MINUTES);

        // 5. Short trip cap: cannot snooze more than 50% of remaining trip time
        const tripCreatedAt = new Date(trip.created_at);
        const tripEndTime = new Date(tripCreatedAt.getTime() + trip.duration_minutes * 60 * 1000);
        const now = new Date();
        const remainingMinutes = Math.max(0, (tripEndTime - now) / (60 * 1000));

        const maxSnoozeForShortTrip = Math.floor(remainingMinutes * 0.5);

        if (maxSnoozeForShortTrip <= 0) {
            throw new AppError('Trip has insufficient remaining time to snooze', 400);
        }

        effectiveDuration = Math.min(effectiveDuration, maxSnoozeForShortTrip);

        // Ensure at least 1 minute snooze
        if (effectiveDuration < 1) {
            effectiveDuration = 1;
        }

        // 6. Execute in transaction
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Insert snooze record
            const snoozeRecord = await SnoozeDetail.create({
                userId,
                tripId,
                snoozeDurationMinutes: effectiveDuration,
                reason,
                timeLimit: effectiveDuration
            }, client);

            // Update trip status to Snoozed
            await Trip.updateStatus(tripId, 'Snoozed', client);

            // Increment snooze count
            await Trip.incrementSnoozeCount(tripId, client);

            await client.query('COMMIT');

            return {
                snooze: snoozeRecord,
                tripStatus: 'Snoozed',
                snoozeCount: snoozeCount + 1,
                effectiveDuration,
                message: `Trip snoozed for ${effectiveDuration} minutes.`
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async resumeTrip(tripId, userId) {
        // 1. Fetch trip and verify ownership
        const trip = await Trip.findById(tripId);

        if (!trip) {
            throw new AppError('Trip not found', 404);
        }

        if (trip.user_id !== userId) {
            throw new AppError('You are not authorized to resume this trip', 403);
        }

        // 2. Verify trip is snoozed
        if (trip.current_status !== 'Snoozed') {
            throw new AppError('Trip is not currently snoozed', 400);
        }

        // 3. Execute in transaction
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Deactivate active snooze records
            await SnoozeDetail.deactivateByTripId(tripId, client);

            // Update trip status back to Active
            await Trip.updateStatus(tripId, 'Active', client);

            await client.query('COMMIT');

            return {
                tripStatus: 'Active',
                message: 'Trip monitoring has resumed.'
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

export default new SnoozeService();
