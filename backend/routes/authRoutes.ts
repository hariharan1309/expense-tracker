import { Router } from "express";
import { loginHandler, regHandler } from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.post("/register", regHandler);
authRouter.post("/login", loginHandler);
export default authRouter;
