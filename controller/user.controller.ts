import { Response } from "express";
import { IUser, UserModel } from "../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TypedRequest, Para } from "../types/types";

interface MyToken {
  isAdmin: boolean;
}

// interface ResBody extends IUser {
//   message?: string;
// }

export const signUp = async (
  req: TypedRequest<never, never, Omit<IUser, "_id">>,
  res: Response
) => {
  const { name, email, password, designation, project, tasks } = req.body;
  let user;
  try {
    user = await UserModel.findOne({ email });
    if (user) return res.send("User with this email already exists.");
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
  } catch (err) {
    console.log(err);
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
    user = await UserModel.findOne({ email }).populate("project");
    console.log(user);
    if (!user)
      res.status(404).json("User with the given email doesn't exists.");
    // user?.comparePassword()
    if (!bcrypt.compareSync(password, user?.password!))
      return res.status(403).json("Password not matched");
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
    console.log(error);
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
      .populate("project", { name: 1, status: 1 })
      .populate("tasks", { name: 1, status: 1 });
    console.log(user, "details");
    if (!user) res.status(404).json("Couldn't find user with the given id.");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error.");
  }
};

export const updateDetails = async function (
  req: TypedRequest<Para, never, Omit<IUser, "name" | "email" | "password">>,
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

export const createUser = async (
  req: TypedRequest<never, never, Omit<IUser, "_id">>,
  res: Response
) => {
  const userData = req.userData as MyToken;
  if (!userData?.isAdmin)
    return res.status(401).json({ message: "Unauthorized to create user" });
  const { name, email, password, designation, project, tasks, isAdmin } =
    req.body;
  let user;
  try {
    user = await UserModel.findOne({ email });
    if (user) return res.send("User with this email already exists.");
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
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server errror");
  }
  res.json(user?.toJSON());
};
