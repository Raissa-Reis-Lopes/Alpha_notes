import { pool } from "../database/connection";
import { IUser } from "../interfaces/user";

export const createUser = async (
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string,
) => {
    const query =
        "INSERT INTO users (username, email, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    try {
        const result = await pool.query(query, [
            username,
            email,
            first_name,
            last_name,
            password,
        ]);
        return result.rows[0];
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user.");
    }
};

export const getUserByEmail = async (email: string) => {
    const query = "SELECT * FROM users WHERE email=$1";
    try {
        const result = await pool.query(query, [email]);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to locate the user by email.");
    }
};

export const getUserByUsername = async (username: string) => {
    const query = "SELECT * FROM users WHERE username=$1";
    try {
        const result = await pool.query(query, [username]);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to locate the user by username.");
    }
};