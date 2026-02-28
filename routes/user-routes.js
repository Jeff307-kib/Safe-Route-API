import express from 'express';
import userController from '../controllers/user-controller.js';
import userValidators from '../validators/user-validator.js';
import validate from '../middlewares/validate-middleware.js';

const router = express.Router();

router.get('/', userValidators.getAll, validate, userController.getAllUsers);
router.get('/:id', userValidators.getById, validate, userController.getById);
router.post('/', userValidators.create, validate, userController.create);
router.patch('/:id', userValidators.update, validate, userController.update);
router.delete('/:id', userValidators.getById, validate, userController.delete);

export default router;