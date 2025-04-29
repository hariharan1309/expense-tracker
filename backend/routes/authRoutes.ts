import { Router } from "express";
import { regHandler } from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.post("/register", regHandler);

export default authRouter;
