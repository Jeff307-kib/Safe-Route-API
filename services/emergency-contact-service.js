import EmergencyContact from "../models/EmergencyContact.js";
import AppError from "../utils/app-error.js";

class EmergencyContactService {
    async addContact(data) {
        
        if (!data || Object.keys(data).length === 0) {
            throw new AppError("No contact data provided", 400);
        }

        const { userId, emergencyContactId, relationship, notes } = data;

        // Validation for  specific schema fields
        if (!userId || !emergencyContactId || !relationship) {
            throw new AppError("userId, emergencyContactId, and relationship are required", 400);
        }

        return await EmergencyContact.create({ userId, emergencyContactId, relationship, notes });
    }
}

export default new EmergencyContactService();