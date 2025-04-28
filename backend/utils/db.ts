import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_DB_URL!);
    console.log("Successfully connected to the MongoDB database");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
