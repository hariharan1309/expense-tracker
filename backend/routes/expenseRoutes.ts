import { Router } from "express";
import authHandler from "../middleware/authHandler.js";
import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expenseControllers.js";

const expenseRouter = Router();

expenseRouter.get("/expenses", authHandler, getExpenses);
expenseRouter.get("/:id", authHandler, getExpense);
expenseRouter.post("/", authHandler, createExpense);
expenseRouter.put("/:id", authHandler, updateExpense);
expenseRouter.delete("/:id", authHandler, deleteExpense);

export default expenseRouter;
