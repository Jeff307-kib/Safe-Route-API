import TripEmergencyContact from "../models/TripEmergencyContact.js";
import EmergencyContact from "../models/EmergencyContact.js";
import catchAsync from '../utils/catch-async.js';
import ApiResponse from "../utils/api-response.js";
import AppError from "../utils/app-error.js";

export class TripEmergencyContactController {
    assignContacts = catchAsync(async (req, res) => {
        const { tripId } = req.params;
        const { selectedContactIds } = req.body;

        if (!selectedContactIds || !Array.isArray(selectedContactIds)) {
            throw new AppError('selectedContactIds must be an array', 400);
        }

        if (selectedContactIds.length === 0) {
            ApiResponse.success(res, [], 'No emergency contacts selected');
            return;
        }

        // Get user's emergency contacts to validate ownership
        const userContacts = await EmergencyContact.findByUserId(req.user.user_id);
        const userContactIds = userContacts.map(contact => contact.id);

        // Validate that all selected contacts belong to the user
        const invalidContacts = selectedContactIds.filter(id => !userContactIds.includes(id));
        if (invalidContacts.length > 0) {
            throw new AppError(`You can only select your own emergency contacts. Invalid IDs: ${invalidContacts.join(', ')}`, 403);
        }

        // Bulk create the trip-emergency contact relationships
        const linkedContacts = await TripEmergencyContact.bulkCreate(tripId, selectedContactIds);

        ApiResponse.created(res, linkedContacts, 'Emergency contacts assigned to trip successfully');
    });

    getTripContacts = catchAsync(async (req, res) => {
        const { tripId } = req.params;
        const contacts = await TripEmergencyContact.findByTripId(tripId);
        ApiResponse.success(res, contacts, 'Trip emergency contacts retrieved successfully');
    });

    removeContact = catchAsync(async (req, res) => {
        const { tripId, contactId } = req.params;
        const removedContact = await TripEmergencyContact.delete(tripId, contactId);
        
        if (!removedContact) {
            throw new AppError('Contact not found for this trip', 404);
        }

        ApiResponse.success(res, removedContact, 'Emergency contact removed from trip successfully');
    });

    removeAllContacts = catchAsync(async (req, res) => {
        const { tripId } = req.params;
        const removedContacts = await TripEmergencyContact.deleteByTripId(tripId);
        ApiResponse.success(res, removedContacts, 'All emergency contacts removed from trip successfully');
    });
}

export default new TripEmergencyContactController();
