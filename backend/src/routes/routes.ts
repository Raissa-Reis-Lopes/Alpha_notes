import { Router } from "express";
import authRouter from "../routes/authRoutes"
import loginRouter from "../routes/loginRoutes"
import logoutRouter from "../routes/logoutRoutes"
import userRouter from "../routes/userRoutes"
import notesRouter from "../routes/noteRoutes"
import imageRouter from "../routes/imageRoutes"
import urlRouter from "../routes/urlRoutes"

const router = Router();

router.use("/auth", authRouter)
router.use("/login", loginRouter)
router.use("/logout", logoutRouter)
router.use("/users", userRouter)
router.use("/notes", notesRouter)
router.use('/image', imageRouter);
router.use('/url', urlRouter);


export default router;