import mongoose from "mongoose";
import http from "http";
import { app } from "./app";

const server = http.createServer(app);
console.log("hi");
server.listen(process.env.PORT, () => {
  try {
    mongoose.connect(process.env.DB_URI!);
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
});
