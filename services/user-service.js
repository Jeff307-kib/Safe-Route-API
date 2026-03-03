import User from "../models/User.js";
import ProfileDetails from '../models/Profile-Details.js';
import AppError from '../utils/app-error.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ProfileDetails from '../models/Profile-Details.js';
import dotenv from 'dotenv';

class UserService {
    async register(userData) {
        const { password, ...otherData } = userData

        // The "12" is the cost factor. Higher = more secure but slower.
        const salt = await bcrypt.genSalt(12);

        const hashedPassword = await bcrypt.hash(password, salt);

        const userToSave = {
            ...otherData,
            password: hashedPassword
        };

        const newUser = await User.create(userToSave);

        const token = signToken(newUser.user_id);
        return { user: newUser, token };
    }

    async login({ phoneNumber, password }) {
        const user = await User.findByPhoneNumber(phoneNumber);

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            throw new AppError('Invalid phone number or password', 401);
        }

        const token = signToken(user.user_id);

        // Clean up sensitive data before returning
        delete user.password_hash;

        return { user, token };
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

    async updateProfileDetails(userId, details) {
        if (details?.date_of_birth && new Date(details.date_of_birth) > new Date()) {
            throw new AppError('Date of birth cannot be in the future', 400);
        }

        return await ProfileDetails.upsert(userId, details);
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

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

export default new UserService();