import { Router } from "express";
import authRouter from "../routes/authRoutes"
import loginRouter from "../routes/loginRoutes"
import logoutRouter from "../routes/logoutRoutes"
import userRouter from "../routes/userRoutes"
import notesRouter from "../routes/noteRoutes"

const router = Router();

router.use("/auth", authRouter)
router.use("/login", loginRouter)
router.use("/logout", logoutRouter)
router.use("/users", userRouter)
router.use("/notes", notesRouter)


export default router;