import mongoose from "mongoose";

const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url);
    console.info(`Connected to the Database!`);
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
