import { Request, Response } from "express";
import { Router } from "express";
import { auth } from "../middlewares/auth";
import { getUserById } from "../repositories/userRepository";

const router: Router = Router();

router.post("/validate", auth, async (req: Request, res: Response) => {
  return res.status(200).json({ message: "Session is valid", data: req.user });
});

export default router;