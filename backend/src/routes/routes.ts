import { Router } from "express";
import loginRouter from "../routes/loginRoutes"
import userRouter from "../routes/userRoutes"


const router = Router();

router.use("/login", loginRouter)
router.use("/users", userRouter)


export default router;