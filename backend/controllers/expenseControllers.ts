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

export const getExpenseStats = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const total = await Expense.aggregate([
      { $match: { userId: req.user.userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const byCategory = await Expense.aggregate([
      { $match: { userId: req.user.userId } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    // Get expenses by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const byMonth = await Expense.aggregate([
      {
        $match: {
          userId: req.user.userId,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: total.length > 0 ? total[0].total : 0,
        byCategory,
        byMonth,
      },
    });
  } catch (error) {
    next(error);
  }
};
