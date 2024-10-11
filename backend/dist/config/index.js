"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_KEY = exports.PORT = exports.DATABASE_URL = exports.NODE_ENV = void 0;
require("dotenv").config();
exports.NODE_ENV = process.env.NODE_ENV || "development";
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.PORT = process.env.PORT || 3000;
exports.SECRET_KEY = process.env.SECRET_KEY;
