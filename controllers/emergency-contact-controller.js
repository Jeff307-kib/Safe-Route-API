import emergencyContactService from "../services/emergency-contact-service.js";
import catchAsync from "../utils/catch-async.js";
import ApiResponse from "../utils/api-response.js";

export class EmergencyContactController {
    create = catchAsync(async (req, res) => {
        const userId = req.user.user_id;
        const contact = await emergencyContactService.createContact({userId, ...req.body});
        ApiResponse.created(res, contact, 'Contact added successfully');
    });

    getMyContacts = catchAsync(async (req, res) => {
        const userId = req.user.user_id; 
        const contacts = await emergencyContactService.getContactsByUserId(userId);
        ApiResponse.success(res, contacts, 'Your emergency contacts retrieved successfully');
    });

    getById = catchAsync(async (req, res) => {
        const contact = await emergencyContactService.getContactById(req.params.id);
        ApiResponse.success(res, contact, 'Contact retrieved successfully');
    });

    getByUser = catchAsync(async (req, res) => {
        const contacts = await emergencyContactService.getContactsByUserId(req.params.userId);
        ApiResponse.success(res, contacts, 'User contacts retrieved successfully');
    });

    update = catchAsync(async (req, res) => {
        const contact = await emergencyContactService.updateContact(req.params.id, req.body);
        ApiResponse.success(res, contact, 'Contact updated successfully');
    });

    delete = catchAsync(async (req, res) => {
        await emergencyContactService.deleteContact(req.params.id);
        ApiResponse.noContent(res, 'Contact deleted successfully');
    });
}

export default new EmergencyContactController();