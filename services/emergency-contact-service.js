import EmergencyContact from "../models/EmergencyContact.js";
import User from "../models/User.js";

class EmergencyContactService {
    async createContact(data) {
    const { userId, contactUserId, relationship, notes } = data;
    
    // Check if the contact person exists in the users table first
    const targetUser = await User.findById(contactUserId);
    if (!targetUser) {
        // Use your custom error handler if you have one
        const error = new Error(`User with ID ${contactUserId} does not exist.`);
        error.statusCode = 404;
        throw error;
    }

    // Prevent users from adding themselves 
    if (userId === contactUserId) {
        throw new Error("You cannot add yourself as an emergency contact.");
    }

    // Check for duplicates
    const alreadyExists = await EmergencyContact.exists(userId, contactUserId);
    if (alreadyExists) {
        throw new Error('This user is already in your emergency contacts');
    }

    return await EmergencyContact.create({
        userId,
        emergencyContactId: contactUserId,
        relationship,
        notes
    });

}

    async getContactById(id) {
        const contact = await EmergencyContact.findById(id);
        if (!contact) throw new Error("Contact not found");
        return contact;
    }

    async getContactsByUserId(userId) {
        return await EmergencyContact.findByUserId(userId);
    }

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