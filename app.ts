import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import router from "./routes/index.route";
import dotenv from "dotenv";
import HttpError from "./services/http.error";
dotenv.config();

export const app = express();

app.use(bodyParser.json());

app.use("/api", router);

app.use(() => {
  const err = new HttpError("Page not found", 404);
  throw err;
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500);
  res.json({ message: err.message || "unknown error occured" });
});
