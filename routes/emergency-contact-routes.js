import express from 'express';
import controller from '../controllers/emergency-contact-controller.js';
import contactValidator from '../validators/emergency-contact-validators.js';
import validate from '../middlewares/validate-middleware.js';
import { protect } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(protect);

router.post(
    '/',
    controller.sendRequest
);

router.get(
    '/my-contacts',
    controller.getMyContacts
);

router.get(
    '/pending',
    controller.getPendingRequests
);

router.patch(
    '/:id/accept',
    controller.acceptContactRequest
);

router.patch(
    '/:id/decline',
    controller.declineContactRequest
);

router.get(
    '/:id',
    controller.getContactById
)

router.patch(
    '/:id',
    controller.updateContactContext
);

router.delete(
    '/',
    controller.deleteContacts
)

export default router;