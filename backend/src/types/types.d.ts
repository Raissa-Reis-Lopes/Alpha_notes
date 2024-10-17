import { Request } from "express";
import { IUserResponse } from "../interfaces/user";

declare module "express" {
    export interface Request {
        user?: IUserResponse;
    }
}