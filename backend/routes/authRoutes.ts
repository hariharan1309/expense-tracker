import { Router } from "express";
import { regHandler } from "../controllers/authControllers.js";

const router = Router();

router.post("/register", regHandler);
