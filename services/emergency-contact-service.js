// services/emergency-contact-service.js
import EmergencyContact from "../models/EmergencyContact.js";
import AppError from "../utils/app-error.js";

class EmergencyContactService {
  async addContact(contactData) {
    
    if (!contactData || Object.keys(contactData).length === 0) {
      throw new AppError("No contact data provided", 400);
    }
   
    const { userId, name, phone, relationship } = contactData;
    return await EmergencyContact.create({ userId, name, phone, relationship });
  }

  async getContactsByUserId(userId) {
    return await EmergencyContact.findByUserId(userId);
  }
}

export default new EmergencyContactService();