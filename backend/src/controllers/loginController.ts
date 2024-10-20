import { IUserResponse } from "../interfaces/user";
import * as loginServices from "../services/loginServices"
import { Request, Response } from "express"

export const authenticate = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user: IUserResponse = await loginServices.getUser(email);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const { auth, token } = await loginServices.authenticateUser(
            email,
            password
        )

        if (auth) {
            const maxAge = 10 * 24 * 60 * 60 * 1000;
            res.cookie("session_id", token, { maxAge, httpOnly: true });
            return res.status(200).json({ data: user, auth, message: "User sucessfully authenticated!" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to authenticate user, server error." })
    }
};


export const logout = (req: Request, res: Response) => {
    try {
        res.clearCookie("session_id", { path: "/" });
        return res.status(200).json({ success: true, message: "Logout successful" })
    } catch (error) {
        return res.status(500).json({ error: "Failed to logout" })
    }
}
