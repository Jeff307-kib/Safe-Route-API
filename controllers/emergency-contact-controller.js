import contactService from "../services/emergency-contact-service.js";
import catchAsync from "../utils/catch-async.js";
import ApiResponse from "../utils/api-response.js";

export class EmergencyContactController {
    create = catchAsync(async (req, res) => {
        
        const contact = await contactService.addContact(req.body);
        ApiResponse.created(res, contact, 'Emergency contact linked successfully');
    });

    getAll = catchAsync(async (req, res) => {
        const contacts = await contactService.getContacts(req.params.userId);
        ApiResponse.success(res, contacts);
    });
}

export default new EmergencyContactController();