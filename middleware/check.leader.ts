import { NextFunction, Request, Response } from "express";
import { UserModel } from "../model/user.model";

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (!user) res.status(400).json("Couldn't find user with the given id");
    if (!user?.isAdmin) res.status(401).json({ message: "unauthorized" });
    next();
  } catch (error) {}
};

export const checkLeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
