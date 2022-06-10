import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import HttpError from "../services/http.error";

interface TypedRequest extends Request {
  userData?: string | JwtPayload;
}
interface MyToken {
  isAdmin: boolean;
  projects?: [string];
}

export default async (req: TypedRequest, res: Response, next: NextFunction) => {
  if (req.method == "OPTIONS") next();
  if (!req.headers) {
    const err = new HttpError("Unauthorized, no headers", 401);
    return next(err);
  }
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
      const err = new HttpError("Unauthorized", 401);
      return next(err);
    }
    const decodedToken = jwt.verify(token!, process.env.JWT_SECRET!);
    // console.log(decodedToken);
    req.userData = {
      isAdmin: (decodedToken as MyToken)?.isAdmin,
      projects: (decodedToken as MyToken)?.projects,
    };
    next();
  } catch (error: any) {
    const err = new HttpError(error.message, 401);
    return next(err);
  }
};
