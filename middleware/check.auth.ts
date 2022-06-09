import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TypedRequest extends Request {
  userData?: string | JwtPayload;
}
interface MyToken {
  isAdmin: boolean;
  projects?: [string];
}

export default async (req: TypedRequest, res: Response, next: NextFunction) => {
  if (req.method == "OPTIONS") next();
  if (!req.headers)
    res.status(401).json({ message: "Unauthorize, no headers" });
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) res.status(401).json({ message: "Unauthorized" });
    const decodedToken = jwt.verify(token!, process.env.JWT_SECRET!);
    // console.log(decodedToken);
    req.userData = {
      isAdmin: (decodedToken as MyToken)?.isAdmin,
      projects: (decodedToken as MyToken)?.projects,
    };
    next();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
