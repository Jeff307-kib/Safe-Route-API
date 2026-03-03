import EmergencyContact from "../models/EmergencyContact.js";
import User from "../models/User.js";

class EmergencyContactService {
    async createContact(data) {
        const { userId, contactUserId, relationship } = data;

        // Fetch User B (e.g., John Watson ID: 12)
        const targetUser = await User.findById(contactUserId);

        if (!targetUser) {
            throw new Error("Target user not found");
        }

        // Inside a method, return is legal
        return await EmergencyContact.create({
            userId: userId,                // Owner (e.g., Moriarty ID: 5)
            name: targetUser.full_name,     // Mapping from 'users' table
            phone: targetUser.phone_number, // Mapping from 'users' table
            email: targetUser.email,
            relationship: relationship
        });
    }
}

export default new EmergencyContactService();