import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export const auth = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.cookies.session_id

    if (!token) return res.status(401).json({ message: "Access Denied" });

    jwt.verify(token, process.env.SECRET_KEY!, (err: any, decoded: any) => {
        if (err) {
            return res.status(400).json({ message: "Invalid jwt token" })
        }

        //Só para anotar uma expicação aqui, como o user não é padrão do req, tive que criar uma tipagem para ele, que está lá na pasta types
        req.user = { id: decoded.id, username: decoded.username, email: decoded.email };
        next();
    })


}