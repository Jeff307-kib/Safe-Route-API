import User from "../models/User.js";
import AppError from '../utils/app-error.js';
import bcrypt from "bcryptjs";

class UserService {
    async createUser(userData) {
        const { password, ...otherData } = userData

        // The "12" is the cost factor. Higher = more secure but slower.
        const salt = await bcrypt.genSalt(12);

        const hashedPassword = await bcrypt.hash(password, salt);

        const userToSave = {
            ...otherData,
            password: hashedPassword
        };

        return await User.create(userToSave);
    }

    async getUserById(id) {
        const user = await User.findById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    async getAllUsers(page = 1, limit = 10, sortBy = 'created_at') {
        const offset = (page - 1) * limit;
        return await User.findAll({ limit, sortBy, offset });
    }

    async updateUser(id, updateData) {
        const user = await User.findById(id);
        // const user = await User.update(id, updateData);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        const updatedUser = await User.updateUser(id, updateData);
        return updatedUser;
    }

    async deleteUser(id) {
        const user = await User.findById(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        const deletedUser = await User.deleteUser(id);
        return deletedUser;
    }
}

export default new UserService();