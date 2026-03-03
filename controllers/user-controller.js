import userService from "../services/user-service.js";
import catchAsync from '../utils/catch-async.js';
import ApiResponse from "../utils/api-response.js";

export class UserController {
<<<<<<< Updated upstream
    create = catchAsync(async (req, res, next) => {
        const user = await userService.createUser(req.body);
        ApiResponse.created(res, user, 'User created successfully');
    });

    getById = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        ApiResponse.success(res, user, 'User retrieved successfully');
    });
=======
    register = catchAsync(async (req, res) => {
        const {user, token} = await userService.register(req.body);

        ApiResponse.created(res, {user, token}, 'Register successful');
    });

    login = catchAsync(async (req, res) => {
        const {user, token} = await userService.login(req.body);

        ApiResponse.success(res, {user, token}, 'Login successful.')
    })

    getMe = catchAsync(async (req, res) => {
        ApiResponse.success(res, { user: req.user}, 'User profile retrieved');
    })
>>>>>>> Stashed changes

    getAllUsers = catchAsync(async (req, res) => {
        const { page, limit } = req.query;
        const users = await userService.getAllUsers(page, limit);
        const count = users.length;

        ApiResponse.success(res, { total: count, users }, 'Users retrieved successfully');
    });

<<<<<<< Updated upstream
    update = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const user = await userService.updateUser(id, req.body);
        ApiResponse.success(res, user, 'User updated successfully');
    });

    delete = catchAsync(async (req, res, next) => {
=======
    update = catchAsync(async (req, res) => {
        const updatedUser = await userService.updateUser(req.user.user_id, req.body);
        ApiResponse.success(res, {user: updatedUser}, 'User updated successfully');
    });

    updateDetails = catchAsync(async (req, res) => {
        const details = await userService.updateProfileDetails(req.user.user_id, req.body);
        ApiResponse.success(res, details, 'Profile details updated successfully');
    })

    delete = catchAsync(async (req, res) => {
>>>>>>> Stashed changes
        const { id } = req.params;
        await userService.deleteUser(id);
        ApiResponse.noContent(res, 'User deleted successfully');
    });
}

export default new UserController();