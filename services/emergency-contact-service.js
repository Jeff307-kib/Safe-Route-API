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

            // const relationshipExists = await EmergencyContact.existsSymmetric(requesterId, addresseeId, client);

            // if (relationshipExists) {
            //     throw new AppError("A request or relationship already exists between you and this user", 400);
            // }

            const isBlocked = await EmergencyContact.prepareForNewRequest(requesterId, addresseeId, client);

            if (isBlocked) {
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

    async declineContactRequest(requestId, currentUserId) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const request = await EmergencyContact.findById(requestId, client);

            if (!request) {
                throw new AppError('Request not found', 404);
            }

            if (request.addressee_id !== currentUserId) {
                throw new AppError('You are not authorized to declined this request');
            }

            if (request.status === 'accepted' || request.status === 'declined') {
                throw new AppError('This contact has been accepted or declined');
            }

            const declinedRequest = await EmergencyContact.declineRequest(requestId, currentUserId, client);

            const addressee = await User.findById(currentUserId, client);

            await notificationService.createNotification({
                recipientId: request.requester_id,
                referenceId: requestId,
                referenceType: 'CONTACT_DECLINE',
                message: `${addressee.full_name} declined your contact request.`
            }, client);

            await client.query('COMMIT');
            return declinedRequest;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async findContactById(id, userId) {
        const contact = await EmergencyContact.findContactById(id, userId);

        if (!contact) {
            throw new AppError("Contact not found", 404);
        }

        return contact;
    }

    async updateContactContext(id, userId, updateData) {
        const { relationship, notes } = updateData;

        // 1. Validation: Don't hit the DB if there is nothing to change
        if (relationship === undefined && notes === undefined) {
            throw new AppError('No update data provided (relationship or notes required).', 400);
        }

        // 2. Call the dynamic model method
        const updatedContact = await EmergencyContact.updateMyDetails(
            id,
            userId,
            { relationship, notes }
        );

        // 3. If null, it means the ID was wrong or the user isn't part of that row
        if (!updatedContact) {
            throw new AppError('Safety partner not found or unauthorized.', 404);
        }

        return updatedContact;
    }

    async getContactsByUserId(userId) {
        return await EmergencyContact.findAllContacts(userId);
    }

    async removeContacts(userId, { contactIds, deleteAll = false }) {
        let deletedRecords;

        if (deleteAll) {
            deletedRecords = await EmergencyContact.deleteAllContacts(userId);
        } else {
            if (!Array.isArray(contactIds) || contactIds.length === 0) {
                throw new AppError('Please provide an array of contact IDs to delete.', 400);
            }
            deletedRecords = await EmergencyContact.deleteSelectedContacts(contactIds, userId);
        }

        if (!deletedRecords || deletedRecords.length === 0) {
            throw new AppError('No contacts were found to delete.', 404);
        }

        return deletedRecords;
    }
}

export default new EmergencyContactService();