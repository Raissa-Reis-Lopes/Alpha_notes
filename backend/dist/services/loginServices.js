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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.getUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const comparePassword_1 = require("../utils/comparePassword");
const config_1 = require("../config");
const userRepository = __importStar(require("../repositories/userRepository"));
const getUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userRepository.getUserByEmail(email);
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.getUser = getUser;
const authenticateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userRepository.getUserByEmail(email);
        if (user && user.length > 0) {
            const matchPassword = yield (0, comparePassword_1.comparePassword)(password, user[0].password);
            if (matchPassword) {
                const token = jsonwebtoken_1.default.sign({ id: user[0].id }, config_1.SECRET_KEY, { expiresIn: "10d" });
                return { auth: true, token };
            }
        }
        return { auth: false, error: "Invalid username and/or password." };
    }
    catch (error) {
        throw new Error("User authentication failed");
    }
});
exports.authenticateUser = authenticateUser;
