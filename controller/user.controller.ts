import { Request, Response } from "express";
import * as core from "express-serve-static-core";
// import { omit } from "lodash";
import { IUser, UserModel } from "../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface TypedRequest<P extends core.ParamsDictionary, U extends core.Query, T>
  extends Request {
  body: T;
  query: U;
  params: P;
}
interface Para extends core.ParamsDictionary {
  id: string;
}

// interface ResBody extends IUser {
//   message?: string;
// }

export const signUp = async (
  req: TypedRequest<never, never, Omit<IUser, "project" | "tasks">>,
  res: Response
) => {
  const { name, email, password, designation } = req.body;
  let user;

  try {
    user = await UserModel.findOne({ email });
    if (user) return res.send("User with this email already exists.");
    user = new UserModel({
      name,
      email,
      password,
      designation,
    });
    await user.save();
  } catch (err) {
    res.status(500).send("Internal server errror");
  }
  res.json(user?.toJSON());
};

export const logIn = async (
  req: TypedRequest<never, never, Omit<IUser, "project" | "tasks" | "name">>,
  res: Response
) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await UserModel.findOne({ email });
    if (!user)
      res.status(404).json("User with the given email doesn't exists.");
    // user?.comparePassword()
    if (!bcrypt.compareSync(password, user?.password!))
      return res.status(403).json("Password not matched");
    const jwToken = jwt.sign(
      { userId: user?._id, userEMail: user?.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWTTTL }
    );
    console.log(jwToken);
    res
      .status(200)
      .json({ token: jwToken, message: "successfully logged in." });
  } catch (error) {
    res.status(500).json("Internal server error.");
  }
};

export const userDetails = async (
  req: TypedRequest<Para, never, never>,
  res: Response
) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id)
      .populate({
        path: "project",
        select: "name-_id",
      })
      .populate({ path: "tasks", select: "name-_id" });
    if (!user) res.status(404).json("Couldn't find user with the given id.");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error.");
  }
};

export const addProjectsAndTasks = async function (
  req: TypedRequest<Para, never, IUser>,
  res: Response
) {
  const id = req.params.id;
  const { project, tasks, designation } = req.body;
  let user;
  try {
    user = await UserModel.findById(id);
    if (!user) res.status(404).json({ message: "User not found." });
    user?.project?.push(...project!);
    user?.tasks?.push(...tasks!);
    user!.designation = designation;
    await user?.save();
    res.status(200).json({ user: user, message: "Successfully updated data." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error." });
  }
};
