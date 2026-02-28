import userService from "../services/user-service.js";
import catchAsync from '../utils/catch-async.js';
import ApiResponse from "../utils/api-response.js";

export class UserController {
    create = catchAsync(async (req, res, next) => {
        const user = await userService.createUser(req.body);
        ApiResponse.created(res, user, 'User created successfully');
    });

    getById = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        ApiResponse.success(res, user, 'User retrieved successfully');
    });

    getAllUsers = catchAsync(async (req, res, next) => {
        const { page, limit } = req.query;
        const users = await userService.getAllUsers(page, limit);
        const count = users.length;

        ApiResponse.success(res, { total: count, users }, 'Users retrieved successfully');
    });

    update = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const user = await userService.updateUser(id, req.body);
        ApiResponse.success(res, user, 'User updated successfully');
    });

    delete = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        await userService.deleteUser(id);
        ApiResponse.noContent(res, 'User deleted successfully');
    });
}

export default new UserController();