import emergencyContactService from "../services/emergency-contact-service.js";
import catchAsync from "../utils/catch-async.js";
import ApiResponse from "../utils/api-response.js";
import AppError from "../utils/app-error.js";

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

    declineContactRequest = catchAsync(async (req, res) => {
        const userId = req.user.user_id;
        const requestId = req.params.id;
        const declinedRequest = await emergencyContactService.declineContactRequest(requestId, userId);
        ApiResponse.success(res, declinedRequest, 'Contact declined successfullt');
    })

    getContactById = catchAsync(async (req, res) => {
        const userId = req.user.user_id;
        const id = req.params.id;
        const contact = await emergencyContactService.findContactById(id, userId);
        ApiResponse.success(res, contact, 'Contact retrieved successfully');
    })

    updateContactContext = catchAsync(async (req, res, next) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return next(new AppError('Request body is missing or empty. Please provide relationship or notes.', 400));
        }

        const userId = req.user.user_id;
        const id = req.params.id;
        const { relationship, notes } = req.body;

        const updatedContact = await emergencyContactService.updateContactContext(id, userId, { relationship, notes });
        ApiResponse.success(res, updatedContact, 'Contact updated successfully');
    })

    deleteContacts = catchAsync(async (req, res) => {
        const userId = req.user.user_id;
        const { contactIds, deleteAll } = req.body;

        const deleted = await emergencyContactService.removeContacts(userId, {
            contactIds,
            deleteAll
        });
        ApiResponse.success(res, deleted, `${deleted.length} contact(s) deleted successfully`);
    })
}

export default new EmergencyContactController();