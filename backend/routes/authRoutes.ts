import { Router } from "express";

const router = Router();

router.post("/register", (req, res, next) => {
  try {
    const { name, email, password } = req.body;
  } catch (error) {
    next(error);
  }
});
