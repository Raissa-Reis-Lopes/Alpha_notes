"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createUser = void 0;
const userRepository = __importStar(require("../repositories/userRepository"));
const validation_1 = require("../utils/validation");
const hashPassword_1 = require("../utils/hashPassword");
const createUser = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!username) {
            throw new Error("The username cannot be empty.");
        }
        if (typeof username !== "string") {
            throw new Error("Invalid data type in the username, it must be a string.");
        }
        if (!email) {
            throw new Error("Email cannot be empty.");
        }
        if (typeof email !== "string") {
            throw new Error("Invalid data types in the email, it must be a string.");
        }
        if (!(0, validation_1.validateEmail)(email)) {
            throw new Error("Invalid email format. (example@example.com) ");
        }
        if (!password) {
            throw new Error("Password cannot be empty.");
        }
        if (!(0, validation_1.validatePassword)(password)) {
            throw new Error("Password must have at least 8 characters with at least 1 uppercase letter and 1 number.");
        }
        if (typeof username !== "string") {
            throw new Error("Invalid data types in the username, it must be a string.");
        }
        const existingUser = yield userRepository.getUserByUsername(username);
        if (existingUser.length > 0) {
            throw new Error("Username already registered!");
        }
        const existingEmail = yield userRepository.getUserByEmail(email);
        if (existingEmail.length > 0) {
            throw new Error("Email already registered.");
        }
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        if (!hashedPassword) {
            throw new Error("Error generating password hash.");
        }
        const user = yield userRepository.createUser(username, email, hashedPassword);
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.createUser = createUser;
