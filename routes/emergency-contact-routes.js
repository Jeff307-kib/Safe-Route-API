import express from 'express';
import controller from '../controllers/emergency-contact-controller.js';
import contactValidator from '../validators/emergency-contact-validators.js';
import validate from '../middlewares/validate-middleware.js';
import { protect } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(protect);

// router.post(
//     '/',
//     contactValidator.create,
//     validate,
//     controller.create
// );
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

// router.get(
//     '/:id'
// )

// router.patch(
//     '/:id/decline'
// );

// router.patch(
//     '/:id'
// );

// router.delete(
//     '/:id'
// );

// router.get(
//     '/:id', 
//     controller.getById
// );

// router.patch(
//     '/:id', 
//     controller.update
// );

// router.delete(
//     '/:id', 
//     controller.delete
// );

export default router;