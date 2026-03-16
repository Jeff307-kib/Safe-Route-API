import EmergencyContact from "../models/EmergencyContact.js";
import User from "../models/User.js";
import pool from "../config/db-config.js";
import notificationService from "./notification-service.js";
import AppError from "../utils/app-error.js";

class EmergencyContactService {
    async sendContactRequest(data) {
        const { requesterId, addresseeId, relationship, notes } = data;

        if (requesterId === addresseeId) {
            throw new AppError("You cannot add yourself as an Emergency Contact.", 400);
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const [requester, targetUser] = await Promise.all([
                User.findById(requesterId, client),
                User.findById(addresseeId, client)
            ]);

            if (!targetUser) {
                throw new AppError("The user you are trying to add does not exist", 404);
            }

            const relationshipExists = await EmergencyContact.existsSymmetric(requesterId, addresseeId, client);
            if (relationshipExists) {
                throw new AppError("A request or relationship already exists between you and this user", 400);
            }

            const newRequest = await EmergencyContact.create({
                requesterId,
                addresseeId,
                relationship,
                notes
            }, client);

            await notificationService.createNotification({
                recipientId: addresseeId,
                referenceId: newRequest.id,
                referenceType: 'CONTACT_REQUEST',
                message: `${requester.full_name} wants add you as Emergency Contact. Click to respond.`
            }, client);

            await client.query('COMMIT');
            return newRequest;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getPedningRequests(userId) {
        const requests = await EmergencyContact.findPendingRequests(userId);
        return requests;
    }

    async acceptContactRequest(requestId, currentUserId) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const request = await EmergencyContact.findById(requestId);

            if (!request) {
                throw new AppError('Request not found', 404);
            }
           
            if (request.addressee_id !== currentUserId) {
                throw new AppError('You are not authorized to accept this request', 403)
            }

            if (request.status === 'accepted') {
                throw new AppError('This contact has been accepted', 400);
            }

            const acceptedRequest = await EmergencyContact.acceptRequest(requestId, client);

            const addressee = await User.findById(currentUserId, client);

            await notificationService.createNotification({
                recipientId: request.requester_id,
                referenceId: requestId,
                referenceType: 'CONTACT_ACCEPT',
                message: `${addressee.full_name} accepted your contact request.`
            }, client);

            await client.query('COMMIT');
            return acceptedRequest;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

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
        return await EmergencyContact.findAllContacts(userId);
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