import EmergencyContact from "../models/EmergencyContact.js";
import User from "../models/User.js";
import pool from "../config/db-config.js";
import notificationService from "./notification-service.js";

class EmergencyContactService {
    async createContact(data) {
        const { userId, contactUserId, relationship, notes } = data;

        if (userId === contactUserId) {
            throw new AppError("You cannot add yourself as an emergency contact.", 400);
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const [adder, targetUser] = await Promise.all([
                User.findById(userId, client),
                User.findById(contactUserId, client)
            ]);

            if (!targetUser) throw new AppError(`User with ID ${contactUserId} does not exist.`, 404);

            const alreadyExists = await EmergencyContact.exists(userId, contactUserId, client);
            if (alreadyExists) throw new AppError('This user is already in your emergency contacts', 400);

            const newContact = await EmergencyContact.create({
                userId,
                emergencyContactId: contactUserId,
                relationship,
                notes
            }, client);

            await notificationService.createNotification({
                recipientId: contactUserId,
                referenceId: newContact.id, 
                referenceType: 'EMERGENCY_CONTACT',
                message: `${adder.full_name} has added you as their emergency contact (${relationship}).`
            }, client);

            await client.query('COMMIT');
            return newContact;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getContactById(id) {
        const contact = await EmergencyContact.findById(id);
        if (!contact) throw new Error("Contact not found");
        return contact;
    }

    // async getContactsByUserId(userId) {
    //     return await EmergencyContact.findByUserId(userId);
    // }

    async getContactsByUserId(userId) {
        return await EmergencyContact.findAllByUserId(userId);
    }

    async updateContact(id, data) {
        const contact = await EmergencyContact.update(id, data);
        if (!contact) throw new Error("Contact not found");
        return contact;
    }

    async deleteContact(id) {
        const contact = await EmergencyContact.delete(id);
        if (!contact) throw new Error("Contact not found");
        return contact;
    }
}

export default new EmergencyContactService();