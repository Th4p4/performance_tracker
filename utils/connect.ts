import mongoose from "mongoose";

export const connect = async () => {
  mongoose.connect("mongodb://localhost:27017/new_ts");
  console.log("DB connected");
};
