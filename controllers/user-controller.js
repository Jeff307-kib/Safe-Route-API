import userService from "../services/user-service.js";
import catchAsync from '../utils/catch-async.js';
import ApiResponse from "../utils/api-response.js";

export class UserController {
    register = catchAsync(async (req, res, next) => {
        const {user, token} = await userService.register(req.body);
        const newUser = {
            user,
            token
        };
        ApiResponse.created(res, {user, token}, 'Register successful');
    });

    login = catchAsync(async (req, res, next) => {
        const {user, token} = await userService.login(req.body);

        ApiResponse.success(res, {user, token}, 'Login successful.')
    })

    getMe = catchAsync(async (req, res, next) => {
        ApiResponse.success(res, { user: req.user}, 'User profile retrieved');
    })

    getAllUsers = catchAsync(async (req, res, next) => {
        const { page, limit } = req.query;
        const users = await userService.getAllUsers(page, limit);
        const count = users.length;

        ApiResponse.success(res, { total: count, users }, 'Users retrieved successfully');
    });

    update = catchAsync(async (req, res, next) => {
        const updatedUser = await userService.updateUser(req.user.user_id, req.body);
        ApiResponse.success(res, {user: updatedUser}, 'User updated successfully');
    });

    delete = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        await userService.deleteUser(id);
        ApiResponse.noContent(res, 'User deleted successfully');
    });
}

export default new UserController();