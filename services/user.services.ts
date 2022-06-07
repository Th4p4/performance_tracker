import { UserModel } from "../model/user.model";
import jwt from "jsonwebtoken";

export const createUserHandler = async (
  name: string,
  email: string,
  password: string
) => {
  let user;
  try {
    user = new UserModel({
      name,
      email,
      password,
    });
    const hashedpassword = user.generateHash(password);
    user.password = hashedpassword;
    await user.save();
  } catch (error: any) {
    throw new Error(error);
  }
  return user;
};

export const checkExistingUser = async (email: string) => {
  let existingUser;
  try {
    existingUser = await UserModel.findOne({ email });
    return existingUser;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const ValidateUSer = async (
  user: any,
  password: string
): Promise<string | boolean | undefined> => {
  const valid = await UserModel.comparePassword(password, user.password);
  if (valid) {
    const jwToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWTTTL }
    );
    console.log(jwToken);
    return jwToken;
  }
  return false;
};
