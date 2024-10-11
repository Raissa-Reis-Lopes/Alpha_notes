import * as userRepository from "../repositories/userRepository";
import { IUser } from "../interfaces/user";
import {
    validateEmail,
    validatePassword
} from "../utils/validation";
import { hashPassword } from "../utils/hashPassword";

export const createUser = async (
    username: string,
    email: string,
    password: string,
) => {
    try {
        if (!username) {
            throw new Error("The username cannot be empty.");
        }

        if (typeof username !== "string") {
            throw new Error(
                "Invalid data type in the username, it must be a string."
            );
        }

        if (!email) {
            throw new Error("Email cannot be empty.");
        }

        if (typeof email !== "string") {
            throw new Error("Invalid data types in the email, it must be a string.");
        }

        if (!validateEmail(email)) {
            throw new Error("Invalid email format. (example@example.com) ");
        }

        if (!password) {
            throw new Error("Password cannot be empty.");
        }

        if (!validatePassword(password)) {
            throw new Error(
                "Password must have at least 8 characters with at least 1 uppercase letter and 1 number."
            );
        }

        if (typeof username !== "string") {
            throw new Error(
                "Invalid data types in the username, it must be a string."
            );
        }

        const existingUser = await userRepository.getUserByUsername(username);
        if (existingUser.length > 0) {
            throw new Error("Username already registered!");
        }

        const existingEmail = await userRepository.getUserByEmail(email);
        if (existingEmail.length > 0) {
            throw new Error("Email already registered.");
        }

        const hashedPassword = await hashPassword(password);

        if (!hashedPassword) {
            throw new Error("Error generating password hash.");
        }

        const user = await userRepository.createUser(
            username,
            email,
            hashedPassword,
        );
        return user;
    } catch (error: any) {
        throw error;
    }
};