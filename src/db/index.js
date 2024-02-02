import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected To Database`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
 