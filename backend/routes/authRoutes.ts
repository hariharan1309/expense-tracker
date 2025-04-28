import { Router } from "express";
import { regHandler } from "../controllers/authControllers";

const router = Router();

router.post("/register", regHandler);
