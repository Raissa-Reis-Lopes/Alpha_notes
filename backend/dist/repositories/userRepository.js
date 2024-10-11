"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByUsername = exports.getUserByEmail = exports.createUser = void 0;
const connection_1 = require("../database/connection");
const createUser = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";
    try {
        const result = yield connection_1.pool.query(query, [
            username,
            email,
            password,
        ]);
        return result.rows[0];
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user.");
    }
});
exports.createUser = createUser;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "SELECT * FROM users WHERE email=$1";
    try {
        const result = yield connection_1.pool.query(query, [email]);
        return result.rows;
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to locate the user by email.");
    }
});
exports.getUserByEmail = getUserByEmail;
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "SELECT * FROM users WHERE username=$1";
    try {
        const result = yield connection_1.pool.query(query, [username]);
        return result.rows;
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to locate the user by username.");
    }
});
exports.getUserByUsername = getUserByUsername;
