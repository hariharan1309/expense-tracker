import { Router } from "express";
import { loginHandler, regHandler } from "../controllers/authControllers.js";
import authHandler, { CustomReq } from "../middleware/authHandler.js";

const authRouter = Router();

authRouter.post("/register", regHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/info", authHandler, (req: CustomReq, res) => {
  res.status(200).json({
    success: true,
    data: req.user._doc,
  });
});
export default authRouter;
