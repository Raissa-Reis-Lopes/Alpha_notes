import { Router } from "express";
import * as userController from "../controllers/userController";

const router: Router = Router();

router.get("/", userController.getAllUsers);
router.get("/:userId", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:userId", userController.updateUser);
router.delete("/:userId", userController.deleteUser);


export default router;