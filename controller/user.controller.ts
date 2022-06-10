import { NextFunction, Response } from "express";
import { IUser, UserModel } from "../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TypedRequest, Para } from "../types/types";
import HttpError from "../services/http.error";

interface MyToken {
  isAdmin: boolean;
}

// interface ResBody extends IUser {
//   message?: string;
// }

export const signUp = async (
  req: TypedRequest<never, never, Omit<IUser, "_id">>,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, designation, project, tasks } = req.body;
  let user;
  try {
    user = await UserModel.findOne({ email });
    if (user) {
      const err = new HttpError("User already exists.", 409);
      return next(err);
    }
    user = new UserModel({
      name,
      email,
      password,
      isAdmin: false,
      designation,
      project,
      tasks,
    });
    await user.save();
  } catch (error) {
    console.log(error);
    const err = new HttpError("Internal server error occured.", 500);
    return next(err);
  }
  res.json(user?.toJSON());
};

export const logIn = async (
  req: TypedRequest<never, never, Omit<IUser, "project" | "tasks" | "name">>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await UserModel.findOne({ email }).populate("project");
    console.log(user);
    if (!user) {
      const err = new HttpError("User doesn't exist.", 409);
      return next(err);
    }
    // user?.comparePassword()
    if (!bcrypt.compareSync(password, user?.password!)) {
      const err = new HttpError("Wrong password, please try again.", 401);
      return next(err);
    }
    const jwToken = jwt.sign(
      {
        userId: user?._id,
        userEMail: user?.email,
        isAdmin: user?.isAdmin,
        projects: user?.project,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWTTTL }
    );
    console.log(jwToken);
    res
      .status(200)
      .json({ token: jwToken, message: "successfully logged in." });
  } catch (error) {
    const err = new HttpError("Internal server error occured.", 500);
    return next(err);
  }
};

export const userDetails = async (
  req: TypedRequest<Para, never, never>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id)
      .populate("project", { name: 1, status: 1 })
      .populate("tasks", { name: 1, status: 1 });
    console.log(user, "details");
    if (!user) {
      const err = new HttpError(
        "Couldn't find the user with the given id.",
        404
      );
      return next(err);
    }
    res.status(200).json(user);
  } catch (error) {
    const err = new HttpError("Internal server error occured.", 500);
    return next(err);
  }
};

export const updateDetails = async function (
  req: TypedRequest<Para, never, Omit<IUser, "name" | "email" | "password">>,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  const { project, tasks, designation } = req.body;
  let user;
  try {
    user = await UserModel.findById(id);
    if (!user) {
      const err = new HttpError(
        "Couldn't find the user with the given id.",
        404
      );
      return next(err);
    }
    user?.project?.push(...project!);
    user?.tasks?.push(...tasks!);
    user!.designation = designation;
    await user?.save();
    res.status(200).json({ user: user, message: "Successfully updated data." });
  } catch (error) {
    const err = new HttpError("Internal server error occured.", 500);
    return next(err);
  }
};

export const createUser = async (
  req: TypedRequest<never, never, Omit<IUser, "_id">>,
  res: Response,
  next: NextFunction
) => {
  const userData = req.userData as MyToken;
  if (!userData?.isAdmin) {
    const err = new HttpError("Unauthorized.", 401);
    return next(err);
  }
  const { name, email, password, designation, project, tasks, isAdmin } =
    req.body;
  let user;
  try {
    user = await UserModel.findOne({ email });
    if (user) {
      {
        const err = new HttpError("User Exists.", 409);
        return next(err);
      }
    }
    user = new UserModel({
      name,
      email,
      password,
      isAdmin,
      designation,
      project,
      tasks,
    });
    await user.save();
  } catch (error) {
    const err = new HttpError("Internal server error occured.", 500);
    return next(err);
  }
  res.json(user?.toJSON());
};
