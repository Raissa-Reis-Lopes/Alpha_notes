import { Router } from "express";
import loginRouter from "../routes/loginRoutes"


const router = Router();

router.use("/login", loginRouter)



export default router;