// controllers/emergency-contact-controller.js
import emergencyContactService from "../services/emergency-contact-service.js";
import catchAsync from "../utils/catch-async.js";
import ApiResponse from "../utils/api-response.js";

export class EmergencyContactController {
    create = catchAsync(async (req, res) => {
        // This calls the method in your service
        const contact = await emergencyContactService.createContact(req.body);
        ApiResponse.created(res, contact, 'Contact added successfully');
    });
}