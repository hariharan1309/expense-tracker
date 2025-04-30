import type { Request, Response, NextFunction } from "express";
import Expense from "../utils/models/Expense.js";
import { ErrorExtended } from "./authControllers.js";
import { CustomReq } from "../middleware/authHandler.js";

export const getExpenses = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId }).sort({
      date: -1,
    });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      userId: req.user.userId,
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpense = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!expense) {
      let error: ErrorExtended = new Error("Expense not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, amount, category, date } = req.body;

    let expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!expense) {
      let error: ErrorExtended = new Error("Expense not found");
      error.statusCode = 404;
      throw error;
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, category, date },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!expense) {
      let error: ErrorExtended = new Error("Expense not found");
      error.statusCode = 404;
      throw error;
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      data: {
        id: req.params.id,
      },
    });
  } catch (error) {
    next(error);
  }
};
