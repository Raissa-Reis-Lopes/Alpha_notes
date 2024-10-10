import { Request, Response } from "express";
import * as userServices from "../services/userServices";
import { IUser } from "../interfaces/user";
import { IAPIResponse } from "../interfaces/api";

export const createUser = async (req: Request, res: Response) => {
    const response: IAPIResponse<IUser> = { success: false };
    try {
        const { username, email, first_name, last_name, password } = req.body;

        const user = await userServices.createUser(
            username,
            email,
            first_name,
            last_name,
            password,
        );
        response.data = user;
        response.success = true;
        response.message = "User successfully registered!";
        res.status(201).json(response);
    } catch (error: any) {
        response.error = error.message;
        response.message = "Failed to register the user!";
        return res.status(400).json(response);
    }
};
