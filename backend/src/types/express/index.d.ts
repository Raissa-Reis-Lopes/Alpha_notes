import * as express from "express";
import { IUserResponse } from "../../interfaces/user";

declare global {
    namespace Express {
        interface Request {
            user?: IUserResponse;
        }
    }
}