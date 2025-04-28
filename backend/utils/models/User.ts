import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: 3,
      maxLength: 48,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address."], // Regular expression for email validation
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 10,
      maxLength: 64,
    },
  },
  {
    timestamps: true, // adding additional details for user.
  }
);

const User = mongoose.model("User", UserSchema);// creating a model
export default User;
