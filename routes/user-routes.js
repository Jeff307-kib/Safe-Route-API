import express from 'express';
import userController from '../controllers/user-controller.js';
import userValidators from '../validators/user-validator.js';
import validate from '../middlewares/validate-middleware.js';

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
        '/',
        userValidators.getAll,
        validate,
        userController.getAllUsers
    );
router
    .get(
        '/:id',
        userValidators.getById,
        validate,
        userController.getById
    );
router
    .patch(
        '/:id',
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