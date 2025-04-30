import mongoose, { Schema } from "mongoose";

const ExpenseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Please provide an amount"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: [
        "food",
        "transportation",
        "entertainment",
        "utilities",
        "housing",
        "healthcare",
        "education",
        "other",
      ],
    },
    date: {
      type: Date,
      required: [true, "Please provide a date"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // adding additional expense details.
  }
);

const Expense = mongoose.model("Expense", ExpenseSchema);
export default Expense;
