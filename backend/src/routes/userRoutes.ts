import { Router } from "express";
import * as userController from "../controllers/userController";

const router: Router = Router();

router.post("/", userController.createUser);

export default router;