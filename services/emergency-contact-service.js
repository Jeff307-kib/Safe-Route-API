import EmergencyContact from "../models/EmergencyContact.js";
import User from "../models/User.js";

class EmergencyContactService {
    async createContact(data) {
        const { userId, contactUserId, relationship } = data;
        const targetUser = await User.findById(contactUserId);
        if (!targetUser) throw new Error("Target user not found");

        return await EmergencyContact.create({
            userId,
            name: targetUser.full_name,
            phone: targetUser.phone_number,
            email: targetUser.email,
            relationship
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