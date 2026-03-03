import express from 'express';
import userController from '../controllers/user-controller.js';
import userValidators from '../validators/user-validator.js';
import validate from '../middlewares/validate-middleware.js';
import { protect } from '../middlewares/auth-middleware.js';

const router = express.Router();

router
    .post(
        '/register',
        userValidators.create,
        validate,
        userController.register
    );
router
    .post(
        '/login',
        userValidators.login,
        validate,
        userController.login
    );
router
    .get(
        '/me',
        protect,
        userController.getMe
    );
router
    .get(
        '/',
        userValidators.getAll,
        validate,
        userController.getAllUsers
    );

router
    .patch(
        '/me',
        protect,
        userValidators.update,
        validate,
        userController.update
    );
router
    .delete(
        '/:id',
        userValidators.getById,
        validate,
        userController.delete
    );

export default router;