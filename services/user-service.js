import User from "../models/User.js";
import AppError from '../utils/app-error.js';

class UserService {
    async createUser(userData) {
        return await User.create(userData);
    }

    async getUserById(id) {
        const user = await User.findById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async getAllUsers(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        return await User.findAll({ limit, offset });
    }

    async updateUser(id, updateData) {
        const user = await User.update(id, updateData);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async deleteUser(id) {
        const user = await User.delete(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }
}

export default new UserService();