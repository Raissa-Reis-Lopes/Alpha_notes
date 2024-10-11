"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const token = req.cookies.session_id;
    if (!token)
        return res.status(401).json({ message: "Access Denied" });
    jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: "Invalid jwt token" });
        }
        //Só para anotar uma expicação aqui, como o user não é padrão do req, tive que criar uma tipagem para ele, que está lá na pasta types
        req.user = decoded.id;
        next();
    });
};
exports.auth = auth;
