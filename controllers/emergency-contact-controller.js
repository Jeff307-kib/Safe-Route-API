import emergencyContactService from "../services/emergency-contact-service.js";
import catchAsync from "../utils/catch-async.js";
import ApiResponse from "../utils/api-response.js";

export class EmergencyContactController {
    sendRequest = catchAsync(async (req, res) => {
        const { contactUserId, relationship, notes } = req.body;
        const requesterId = req.user.user_id;

        const newRequest = await emergencyContactService.sendContactRequest({
            requesterId,
            addresseeId: contactUserId,
            relationship,
            notes
        });

        ApiResponse.created(res, newRequest, 'Contact request sent successfully');
    })

    // create = catchAsync(async (req, res) => {
    //     const userId = req.user.user_id;
    //     const contact = await emergencyContactService.createContact({ userId, ...req.body });
    //     ApiResponse.created(res, contact, 'Contact added successfully');
    // });

    getMyContacts = catchAsync(async (req, res) => {
        const userId = req.user.user_id;
        const contacts = await emergencyContactService.getContactsByUserId(userId);
        ApiResponse.success(res, contacts, 'Your emergency contacts retrieved successfully');
    });

    getPendingRequests = catchAsync(async (req, res) => {
        const userId = req.user.user_id;
        const requests = await emergencyContactService.getPedningRequests(userId);
        ApiResponse.success(res, requests, 'Pending requests retrieved successfully')
    })

    acceptContactRequest = catchAsync(async (req, res) => {
        const userId = req.user.user_id;
        const requestId = req.params.id;
        const acceptedRequest = await emergencyContactService.acceptContactRequest(requestId, userId);
        ApiResponse.success(res, acceptedRequest, 'Contact accepted successfully');
    })

    getById = catchAsync(async (req, res) => {
        const contact = await emergencyContactService.getContactById(req.params.id);
        ApiResponse.success(res, contact, 'Contact retrieved successfully');
    });

    getByUser = catchAsync(async (req, res) => {
        const contacts = await emergencyContactService.getContactsByUserId(req.params.userId);
        ApiResponse.success(res, contacts, 'User contacts retrieved successfully');
    });

    // getMyContacts = catchAsync(async (req, res) => {
    //     const userId = req.user.user_id;
    //     const contacts = await emergencyContactService.getContactsByUserId(userId);
    //     ApiResponse.success(res, contacts, 'Your emergency contacts retrieved successfully');
    // });

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