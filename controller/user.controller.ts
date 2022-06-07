import { Request, Response, NextFunction } from "express";
import { omit } from "lodash";
import {
  checkExistingUser,
  createUserHandler,
  ValidateUSer,
} from "../services/user.services";

export const signUp = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
  }: { name: string; email: string; password: string } = req.body;
  let user;
  try {
    user = await checkExistingUser(email);
    if (user)
      return res.json({ message: "User with this email already exists." });
    user = await createUserHandler(name, email, password);
  } catch (err) {
    res.status(500).json({ message: "Internal server errror" });
  }
  res.status(201).json({
    user: omit(user?.toObject(), ["password"]),
    message: "Successfully signed up.",
  });
};

export const logIn = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  let user;
  try {
    user = await checkExistingUser(email);
    if (!user) res.json(404).json("User with the given email doesn't exists.");
    // user?.comparePassword()
    console.log(user);
    const jwToken = ValidateUSer(user, password);
    console.log(await jwToken);
    if (await jwToken)
      res
        .status(200)
        .json({ token: await jwToken, message: "successfully logged in." });
    else res.status(403).json("password is wrong");
  } catch (error) {
    res.status(500).json("Internal server error.");
  }
};
